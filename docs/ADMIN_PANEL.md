# Admin Panel Documentation - bapx.in

## Overview

**YES, Suna/bapx.in has a comprehensive Admin Panel** with both backend APIs and frontend UI.

---

## Admin Panel Locations

### 1. Trailbase Admin UI (Database & Auth)
- **URL:** `http://localhost:8081` (or `https://bapx.in/trailbase/`)
- **Purpose:** Database management, user authentication admin
- **Access:** Admin key authentication (`vn2gVGUvxLMs9w5cwYK6`)
- **Features:**
  - User management
  - Database browsing
  - Auth configuration
  - System logs

### 2. Suna Admin Dashboard (Application Admin)
- **URL:** `https://bapx.in/admin/*` (requires admin role)
- **Location:** `/root/Agent/apps/frontend/src/app/(dashboard)/admin/`
- **Access:** Requires `admin` or `super_admin` role in `user_roles` table

---

## Admin Dashboard Pages

| Page | Route | Purpose |
|------|-------|---------|
| **Feedback** | `/admin/feedback` | User feedback management |
| **Analytics** | `/admin/analytics` | Usage analytics, user insights, ARR simulator |
| **Notifications** | `/admin/notifications` | System notifications management |
| **Utils** | `/admin/utils` | System utilities, maintenance |
| **Sandbox Pool** | `/admin/sandbox-pool` | Sandbox environment management |
| **Stateless** | `/admin/stateless` | System health, metrics, DLQ |
| **Stress Test** | `/admin/stress-test` | Load testing tools |

---

## Backend Admin APIs

### Location
`/root/Agent/backend/core/admin/`

### Admin API Modules

| Module | File | Endpoints |
|--------|------|-----------|
| **Core Admin** | `admin_api.py` | `/admin/users/*`, `/admin/threads/*` |
| **Billing Admin** | `billing_admin_api.py` | `/admin/billing/*` |
| **Feedback Admin** | `feedback_admin_api.py` | `/admin/feedback/*` |
| **Analytics Admin** | `analytics_admin_api.py` | `/admin/analytics/*` |
| **Notifications** | `notification_admin_api.py` | `/admin/notifications/*` |
| **System Status** | `system_status_admin_api.py` | `/admin/status/*` |
| **Sandbox Pool** | `sandbox_pool_admin_api.py` | `/admin/sandbox-pool/*` |
| **Stress Test** | `stress_test_admin_api.py` | `/admin/stress-test/*` |
| **Stateless Admin** | `stateless_admin_api.py` | `/admin/stateless/*` |

### Authentication

Admin APIs require **ONE** of:

1. **Admin API Key Header:**
   ```http
   X-Admin-Api-Key: <KORTIX_ADMIN_API_KEY>
   ```

2. **User Role (from `user_roles` table):**
   - `admin` - Standard admin access
   - `super_admin` - Full admin access

### Auth Implementation

```python
from core.auth import require_admin, require_super_admin

@router.get("/admin/users/list")
async def list_users(admin: dict = Depends(require_admin)):
    # Only admin/super_admin can access
    pass
```

---

## Admin Role System

### Role Hierarchy
```
user (0) < admin (1) < super_admin (2)
```

### Database Table
```sql
CREATE TABLE user_roles (
    user_id TEXT PRIMARY KEY,
    role TEXT NOT NULL,  -- 'user', 'admin', 'super_admin'
    created_at DATETIME,
    updated_at DATETIME
);
```

### Granting Admin Role

```sql
-- Via Trailbase admin panel or direct SQL
INSERT INTO user_roles (user_id, role) 
VALUES ('<user-id>', 'admin');
```

---

## Admin Features

### User Management
- List all users with pagination
- Search by email/name
- View user details (tier, credits, activity)
- View user threads
- Update user roles

### Analytics
- User growth tracking
- Conversation insights
- ARR simulator
- Top users by activity
- Retention metrics

### System Health
- Real-time metrics chart
- Circuit breakers status
- Rate limiters status
- Backpressure monitoring
- Dead letter queue (DLQ)
- Stuck runs detection

### Feedback Management
- View user feedback
- Update feedback status
- Filter by status/type

### Notifications
- Send system notifications
- Manage notification templates
- View delivery status

### Sandbox Management
- View sandbox pool status
- Trigger pool replenish
- Trigger pool cleanup
- Restart pool service
- View sandbox health

### Stress Testing
- Run load tests
- Monitor system under stress
- Performance metrics

---

## Access Control

### Frontend (React)

```tsx
import { useAdminRole } from '@/hooks/admin';

function AdminPage() {
  const { data: roleData } = useAdminRole();
  const isAdmin = roleData?.role === 'admin' || roleData?.role === 'super_admin';
  
  if (!isAdmin) {
    return <div>Access Denied</div>;
  }
  
  return <AdminDashboard />;
}
```

### Backend (FastAPI)

```python
from core.auth import require_admin

@router.get("/admin/protected")
async def protected_endpoint(admin: dict = Depends(require_admin)):
    # admin['user_id'] and admin['role'] available
    return {"message": "Admin access granted"}
```

---

## Current Status (2026-03-22)

| Component | Status | Notes |
|-----------|--------|-------|
| Trailbase Admin UI | ✅ Working | Port 8081 |
| Admin APIs | ✅ Working | All endpoints functional |
| Frontend Admin Pages | ✅ Available | 7 admin pages |
| Role-based Access | ✅ Working | Requires `user_roles` table |
| Admin API Key Auth | ✅ Working | Auto-generated key |

---

## Setup for New Admin User

1. **Create User Account:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/v1/register \
     -H "Content-Type: application/json" \
     -d '{"email": "admin@bapx.in", "password": "secure-password"}'
   ```

2. **Grant Admin Role:**
   ```sql
   -- Connect to user's database or main.db
   INSERT INTO user_roles (user_id, role) 
   VALUES ('<user-id-from-step-1>', 'admin');
   ```

3. **Access Admin Dashboard:**
   - Visit: `https://bapx.in/admin/analytics`
   - Login with admin credentials

---

## Admin API Key

### Location
- Auto-generated in backend logs
- Or set in `/root/Agent/backend/.env`:
  ```bash
  KORTIX_ADMIN_API_KEY=your-secret-key
  ```

### Usage
```bash
curl https://bapx.in/v1/admin/users/list \
  -H "X-Admin-Api-Key: your-secret-key"
```

---

## Next Steps

1. **Test Admin Access:**
   - Create admin user
   - Grant admin role
   - Access `/admin/analytics`

2. **Customize Admin Dashboard:**
   - Add bapx.in branding
   - Configure analytics
   - Set up notifications

3. **Security:**
   - Change default Trailbase admin key
   - Rotate KORTIX_ADMIN_API_KEY
   - Restrict admin IP access (optional)

---

**Last Updated:** 2026-03-22
**Version:** 1.0
