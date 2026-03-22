"""
Trailbase Database Connection - High Performance Replacement
"""

from typing import Optional, Dict, Any
import os
import httpx
import asyncio
from core.utils.logger import logger
from core.utils.config import config

class TrailbaseConnection:
    _instance: Optional['TrailbaseConnection'] = None
    
    def __init__(self):
        self.base_url = os.getenv('TRAILBASE_URL', 'http://localhost:4000/v1')
        self.admin_key = os.getenv('TRAILBASE_ADMIN_KEY', 'vn2gVGUvxLMs9w5cwYK6')
        self.client = httpx.AsyncClient(base_url=self.base_url, headers={
            "Authorization": f"Bearer {self.admin_key}"
        })

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    async def health_check(self) -> bool:
        try:
            response = await self.client.get("/health")
            return response.status_code == 200
        except Exception as e:
            logger.error(f"Trailbase health check failed: {e}")
            return False

    async def query(self, db_name: str, sql: str, params: Optional[Dict] = None):
        """Execute a SQL query against a Trailbase database."""
        try:
            payload = {"sql": sql}
            if params:
                payload["params"] = params
            
            response = await self.client.post(f"/query/{db_name}", json=payload)
            response.raise_for_status()
            return response.json()
        except Exception as e:
            logger.error(f"Trailbase query failed: {e}")
            raise
