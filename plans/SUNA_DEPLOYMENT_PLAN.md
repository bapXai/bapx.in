# bapx.in Suna Deployment Plan

## Project Overview
- **Domain**: bapx.in (live VPS)
- **Goal**: Deploy Suna AI Agent Platform (kortix-ai/suna)
- **Stack**: Python/FastAPI + Next.js (NOT Rust/Wasm)
- **Database**: Local SQLite/PostgreSQL (NO Supabase)

---

## Current State

### ✅ Already Configured
- Nginx reverse proxy with SSL
- Domain bapx.in pointing to VPS
- Basic bapx-os UI (mock data, not functional)

### ❌ Needs to Be Done
- Clone Suna repository
- Set up local database
- Configure environment
- Build & deploy
- Connect to bapx.in

---

## Implementation Steps

### Step 1: Clone Suna Repository
```bash
cd /root/Agent
git clone https://github.com/kortix-ai/suna.git
# or
gh repo clone kortix-ai/suna
```

### Step 2: Set Up Local Database
Since Supabase is NOT used:
- Use SQLite for development
- Use PostgreSQL for production

**Option A: SQLite (simpler)**
- Suna supports SQLite via SQLAlchemy
- Set `DATABASE_URL=sqlite:///./suna.db`

**Option B: PostgreSQL (recommended)**
```bash
# Install PostgreSQL
sudo apt update
sudo apt install postgresql postgresql-contrib

# Create database
sudo -u postgres createdb suna
```

### Step 3: Configure Environment
Create `.env` file in suna-core:
```bash
# Database (local)
DATABASE_URL=postgresql://user:password@localhost:5432/suna
# OR for SQLite
DATABASE_URL=sqlite:///./suna.db

# Auth (disable or use local)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# AI Providers (bring your own keys)
OPENAI_API_KEY=sk-xxx
ANTHROPIC_API_KEY=sk-xxx

# Redis (for caching/sessions)
REDIS_URL=redis://localhost:6379

# Application
NEXT_PUBLIC_APP_URL=https://bapx.in
```

### Step 4: Deploy Backend (FastAPI)
```bash
cd /root/Agent/suna-core/backend

# Create virtual environment
python -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
alembic upgrade head

# Start backend server
uvicorn api:app --host 0.0.0.0 --port 8000 --workers 4
```

### Step 5: Deploy Frontend (Next.js)
```bash
cd /root/Agent/suna-core/apps/frontend

# Install dependencies
npm install
# or
pnpm install

# Build
npm run build

# Start production server
npm start -- -p 3000
```

### Step 6: Configure Nginx
Update `/etc/nginx/sites-available/bapx.in`:

```nginx
server {
    listen 443 ssl http2;
    server_name bapx.in;

    ssl_certificate /etc/letsencrypt/live/bapx.in/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/bapx.in/privkey.pem;

    # Frontend (Next.js)
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/v1/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# HTTP to HTTPS redirect
server {
    listen 80;
    server_name bapx.in;
    return 301 https://$server_name$request_uri;
}
```

### Step 7: Set Up Systemd Services
```bash
# /etc/systemd/system/suna-backend.service
[Unit]
Description=Suna Backend API
After=network.target

[Service]
User=root
WorkingDirectory=/root/Agent/suna-core/backend
ExecStart=/root/Agent/suna-core/backend/venv/bin/uvicorn api:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
# /etc/systemd/system/suna-frontend.service
[Unit]
Description=Suna Frontend
After=network.target

[Service]
User=root
WorkingDirectory=/root/Agent/suna-core/apps/frontend
ExecStart=/root/Agent/suna-core/apps/frontend/venv/bin/npm start -- -p 3000
Restart=always

[Install]
WantedBy=multi-user.target
```

Enable services:
```bash
sudo systemctl daemon-reload
sudo systemctl enable suna-backend suna-frontend
sudo systemctl start suna-backend suna-frontend
```

---

## Architecture Diagram

```
                    ┌─────────────┐
                    │   bapx.in   │
                    │   (Nginx)   │
                    │   (SSL)     │
                    └──────┬──────┘
                           │
           ┌───────────────┼───────────────┐
           │               │               │
    ┌──────▼──────┐ ┌──────▼──────┐ ┌──────▼──────┐
    │   Suna      │ │   Suna      │ │  PostgreSQL │
    │  Frontend   │ │   Backend   │ │  Database   │
    │  (Port 3000)│ │  (Port 8000)│ │  (Port 5432)│
    │  Next.js    │ │  FastAPI    │ │             │
    └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Notes

### About Suna (kortix-ai/suna)
- **NOT Rust or WASM** - It's Python (FastAPI) + Next.js
- AI Agent platform similar to Manus
- Allows creating and managing AI agents
- 100+ integrations via Composio
- Users can bring their own LLM API keys

### About Kortex
- If you meant a different project called "Kortex", please clarify
- Could not find specific "Kortex" AI agent project in archives

---

## Next Steps (for Code Mode)

1. Clone Suna repository
2. Install Python dependencies
3. Configure .env file
4. Test backend locally
5. Test frontend locally
6. Configure Nginx
7. Deploy to production
