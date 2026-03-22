import math
from decimal import Decimal
from datetime import datetime, timezone, timedelta
from typing import Dict, Any, List, Optional

from core.utils.logger import logger
from core.resources.resource_service import ResourceService, get_resource_service
from core.billing.credits.manager import credit_manager
from core.billing.shared.config import STORAGE_PRICE_PER_GB, MINIMUM_STORAGE_GB, STORAGE_BILLING_INTERVAL_DAYS
from core.services.db import get_db

class StorageBillingService:
    """Service for calculating and enforcing storage-based billing."""
    
    def __init__(self, client):
        self.client = client
        self.resource_service = get_resource_service(client)
        
    async def process_account_storage_billing(self, account_id: str) -> Dict[str, Any]:
        """
        Calculate and bill for an account's storage usage.
        Enforces a minimum of 1 GB per month.
        """
        try:
            # 1. Measure current storage
            usage = await self.resource_service.calculate_total_storage(account_id)
            
            trailbase_bytes = usage['trailbase_bytes']
            sandbox_bytes = usage['sandbox_bytes']
            total_bytes = usage['total_bytes']
            
            # Convert to GB (1 GB = 1024^3 bytes)
            total_gb = Decimal(str(total_bytes)) / Decimal(str(1024**3))
            
            # 2. Enforce 1 GB minimum
            billed_gb = max(total_gb, MINIMUM_STORAGE_GB)
            
            # 3. Calculate cost in credits
            # Note: STORAGE_PRICE_PER_GB is in USD equivalent (e.g., $1.00 = 100 credits)
            # We multiply by 100 to get the actual credit amount
            cost_credits = billed_gb * STORAGE_PRICE_PER_GB * Decimal('100')
            
            logger.info(f"[STORAGE_BILLING] Account {account_id}: Actual={total_gb:.4f}GB, Billed={billed_gb:.2f}GB, Cost={cost_credits:.2f} credits")
            
            # 4. Record the measurement
            record = {
                'account_id': account_id,
                'total_size_bytes': total_bytes,
                'trailbase_size_bytes': trailbase_bytes,
                'sandbox_size_bytes': sandbox_bytes,
                'billed_size_gb': float(billed_gb),
                'cost_credits': float(cost_credits),
                'measured_at': datetime.now(timezone.utc).isoformat(),
                'status': 'pending'
            }
            
            result = await self.client.table('storage_usage_records').insert(record).execute()
            if not result.data:
                raise Exception("Failed to record storage usage")
            
            record_id = result.data[0]['id']
            
            # 5. Deduct credits
            deduction = await credit_manager.deduct_credits(
                account_id=account_id,
                amount=cost_credits,
                description=f"Storage billing: {billed_gb:.2f} GB (minimum 1GB enforced)",
                type='storage'
            )
            
            if deduction.get('success'):
                # Update record status
                await self.client.table('storage_usage_records').update({
                    'status': 'billed'
                }).eq('id', record_id).execute()
                
                # Update account last billing timestamp
                await self.client.table('accounts', schema='basejump').update({
                    'last_storage_billing_at': datetime.now(timezone.utc).isoformat()
                }).eq('id', account_id).execute()
                
                return {
                    'success': True,
                    'billed_gb': billed_gb,
                    'cost_credits': cost_credits,
                    'new_balance': deduction.get('new_balance')
                }
            else:
                await self.client.table('storage_usage_records').update({
                    'status': 'failed'
                }).eq('id', record_id).execute()
                
                return {
                    'success': False,
                    'error': 'Insufficient credits for storage minimum'
                }
                
        except Exception as e:
            logger.error(f"Storage billing failed for account {account_id}: {e}")
            return {'success': False, 'error': str(e)}

    async def run_daily_billing_check(self):
        """
        Check all accounts that haven't been billed for storage in the last 30 days.
        """
        # Get accounts that need billing
        # Logic: last_storage_billing_at is null OR > 30 days ago
        cutoff_date = (datetime.now(timezone.utc) - timedelta(days=STORAGE_BILLING_INTERVAL_DAYS)).isoformat()
        
        # This is a simplified query; in production, you'd use a more robust batching approach
        query = self.client.table('accounts', schema='basejump').select('id').or_(
            f"last_storage_billing_at.is.null,last_storage_billing_at.lt.{cutoff_date}"
        )
        
        accounts_result = await query.execute()
        accounts = accounts_result.data or []
        
        logger.info(f"[STORAGE_BILLING] Starting billing run for {len(accounts)} accounts")
        
        results = []
        for acc in accounts:
            res = await self.process_account_storage_billing(acc['id'])
            results.append({'account_id': acc['id'], 'result': res})
            
        return results

def get_storage_billing_service(client) -> StorageBillingService:
    return StorageBillingService(client)
