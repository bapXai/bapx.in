# Admin Login - Credentials & Access

## Quick Answer

**There is NO separate admin login page.** Admin authentication uses the **same login page as regular users** at:

### Login URL
```
https://bapx.in/auth
```

---

## How Admin Access Works

### Step 1: Login as Regular User
1. Go to `https://bapx.in/auth`
2. Enter your email and password
3. Login normally (same as any user)

### Step 2: Admin Role Check
- After login, the system checks your `role` in the `user_roles` table
- If your role is `admin` or `super_admin`, you can access `/admin/*` pages
- If your role is `user`, admin pages are blocked

### Step 3: Access Admin Dashboard
- If you have admin role: Navigate to `https://bapx.in/admin/analytics`
- If you don't have admin role: You'll see "Access Denied"

---

## Current Admin Credentials

### Trailbase Admin (Database Level)
- **URL:** `http://localhost:8081`
- **Admin Key:** `vn2gVGUvxLMs9w5cwYK6`
- **Purpose:** Database management, user creation
- **⚠️ SECURITY:** Change this key in production!

### Application Admin (bapx.in Dashboard)
- **Login URL:** `https://bapx.in/auth`
- **Credentials:** Any user account with `admin` role in `user_roles` table
- **Default Admin:** No default admin user exists - you must create one

---

## Create First Admin User

### Method 1: Via Trailbase Admin UI

1. **Access Trailbase Admin:**
   ```
   http://localhost:8081
   ```
   Use admin key: `vn2gVGUvxLMs9w5cwYK6`

2. **Create User:**
   - Go to "Users" section
   - Click "Create User"
   - Enter email: `admin@bapx.in`
   - Set password: `<your-secure-password>`

3. **Grant Admin Role:**
   - Run SQL in Trailbase:
   ```sql
   INSERT INTO user_roles (user_id, role, created_at, updated_at)
   VALUES ('<user-id-from-step-2>', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   ```

4. **Login:**
   - Go to `https://bapx.in/auth`
   - Login with `admin@bapx.in` and your password
   - Navigate to `/admin/analytics`

### Method 2: Via API

1. **Create User Account:**
   ```bash
   curl -X POST http://localhost:4000/api/auth/v1/register \
     -H "Content-Type: application/json" \
     -d '{
       "email": "admin@bapx.in",
       "password": "YourSecurePassword123!",
       "password_repeat": "YourSecurePassword123!"
     }'
   ```

2. **Get User ID from Response:**
   ```json
   {
     "user": {
       "id": "user_abc123...",
       "email": "admin@bapx.in"
     }
   }
   ```

3. **Grant Admin Role (via Trailbase admin API):**
   ```bash
   curl -X POST http://localhost:4000/admin/users \
     -H "Authorization: Bearer vn2gVGUvxLMs9w5cwYK6" \
     -H "Content-Type: application/json" \
     -d '{
       "user_id": "user_abc123...",
       "role": "admin"
     }'
   ```

4. **Login at:** `https://bapx.in/auth`

### Method 3: Direct Database (SQLite)

1. **Find User Database:**
   ```bash
   ls -la /root/Agent/traildepot/data/
   ```

2. **Open Main Database:**
   ```bash
   sqlite3 /root/Agent/traildepot/data/main.db
   ```

3. **Create Admin Role:**
   ```sql
   -- First, find your user_id
   SELECT * FROM auth_users WHERE email = 'admin@bapx.in';
   
   -- Then insert admin role
   INSERT INTO user_roles (user_id, role, created_at, updated_at)
   VALUES ('<your-user-id>', 'admin', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
   
   -- Verify
   SELECT * FROM user_roles WHERE user_id = '<your-user-id>';
   ```

4. **Exit SQLite:**
   ```bash
   .quit
   ```

5. **Login at:** `https://bapx.in/auth`

---

## Admin Role Hierarchy

| Role | Level | Access |
|------|-------|--------|
| `user` | 0 | Regular user access only |
| `admin` | 1 | Full admin dashboard access |
| `super_admin` | 2 | Full access + admin management |

---

## Verify Admin Access

### Check Your Role

```sql
SELECT user_id, role, created_at 
FROM user_roles 
WHERE user_id = '<your-user-id>';
```

### Test Admin Page Access

1. Login at `https://bapx.in/auth`
2. Navigate to `https://bapx.in/admin/analytics`
3. If you see the dashboard → ✅ Admin access granted
4. If you see "Access Denied" → ❌ No admin role

---

## Admin API Access (Programmatic)

### Using Admin API Key

```bash
curl https://bapx.in/v1/admin/users/list \
  -H "X-Admin-Api-Key: <KORTIX_ADMIN_API_KEY>"
```

### Get Admin API Key

1. Check backend logs for auto-generated key:
   ```bash
   grep "KORTIX_ADMIN_API_KEY" /root/Agent/backend.log
   ```

2. Or check `.env` file:
   ```bash
   cat /root/Agent/backend/.env | grep KORTIX_ADMIN_API_KEY
   ```

3. Or set your own in `/root/Agent/backend/.env`:
   ```bash
   KORTIX_ADMIN_API_KEY=your-custom-secret-key
   ```

---

## Security Recommendations

### Immediate Actions
- [ ] Change default Trailbase admin key (`vn2gVGUvxLMs9w5cwYK6`)
- [ ] Set strong `KORTIX_ADMIN_API_KEY` in backend `.env`
- [ ] Create admin user with strong password
- [ ] Restrict admin IP access (optional)

### Production Checklist
- [ ] Use HTTPS only
- [ ] Enable 2FA for admin accounts (when available)
- [ ] Rotate admin keys regularly
- [ ] Monitor admin access logs
- [ ] Limit admin accounts to minimum necessary

---

## Troubleshooting

### "Access Denied" on Admin Pages

**Problem:** You logged in but can't access `/admin/*` pages

**Solution:**
```sql
-- Check if you have admin role
SELECT * FROM user_roles WHERE user_id = '<your-user-id>';

-- If no results, grant admin role
INSERT INTO user_roles (user_id, role) 
VALUES ('<your-user-id>', 'admin');
```

### Forgot Admin Password

**Solution:** Reset via Trailbase admin panel
1. Go to `http://localhost:8081`
2. Use admin key: `vn2gVGUvxLMs9w5cwYK6`
3. Find your user
4. Reset password

### Admin API Key Not Working

**Solution:**
1. Check backend logs for correct key
2. Verify header format: `X-Admin-Api-Key: <key>`
3. Ensure backend has restarted after key change

---

## Summary

| What | URL | Credentials |
|------|-----|-------------|
| **User Login** | `https://bapx.in/auth` | Email + Password |
| **Admin Dashboard** | `https://bapx.in/admin/analytics` | Same login + admin role |
| **Trailbase Admin** | `http://localhost:8081` | Admin key: `vn2gVGUvxLMs9w5cwYK6` |
| **Admin API** | `https://bapx.in/v1/admin/*` | `X-Admin-Api-Key` header |

**No separate admin login page exists - admin access is role-based after normal login.**

---

**Last Updated:** 2026-03-22
**Version:** 1.0
