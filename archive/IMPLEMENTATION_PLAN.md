# Implementation Plan: Multi-Tenant AI Agent SaaS Platform

**Project Vision:** Build a SaaS platform similar to Manus AI, leveraging ZeroClaw agent framework with Agent S3 for GUI automation, using NVIDIA NIM models (Kimi K2.5, etc.) via API.

**Last Updated:** February 27, 2026  
**Status:** Research Complete - Corrected Architecture

---

## Table of Contents

1. [Executive Summary](#executive-summary)
2. [Architecture Overview](#architecture-overview)
3. [Core Components](#core-components)
4. [NVIDIA NIM Models](#nvidia-nim-models)
5. [Agent S3 GUI Automation](#agent-s3-gui-automation)
6. [ZeroClaw Runtime](#zeroclaw-runtime)
7. [File System Structure](#file-system-structure)
8. [VPS Deployment](#vps-deployment)
9. [Implementation Phases](#implementation-phases)

---

## Executive Summary

### Selected Architecture

| Component | Technology | Purpose |
|-----------|------------|---------|
| **LLM Models** | NVIDIA NIM API | Kimi K2.5, other NVIDIA models (FREE 1000 credits) |
| **Agent Runtime** | ZeroClaw (Rust) | Core agent orchestration, WASM tools |
| **GUI Automation** | Agent S3 | Mouse/keyboard control, computer use |
| **Storage** | S3 | User file storage with prefix isolation |
| **Deployment** | Ubuntu VPS | Single server deployment |
| **File System** | `/home/username/` | Per-user isolated directories |

### Key Decisions

✅ **API-based models only** - No local/offline model deployment  
✅ **NVIDIA NIM free tier** - 1000 credits on signup (build.nvidia.com)  
✅ **Agent S3 for GUI** - Human-like computer control (mouse/keyboard)  
✅ **ZeroClaw for orchestration** - Rust runtime, WASM sandbox  
✅ **Ubuntu VPS** - Simple single-server deployment  
✅ **Standard Linux paths** - `/home/username/` structure  

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    User Request                          │
└────────────────────────┬────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              ZeroClaw Agent (Rust Runtime)              │
│  - Receives task from user                              │
│  - Plans execution                                      │
│  - Decides: API task vs GUI task                        │
└────────────────────────┬────────────────────────────────┘
                         │
         ┌───────────────┴───────────────┐
         │                               │
    API Task                         GUI Task
         │                               │
┌────────▼────────┐            ┌────────▼────────┐
│  ZeroClaw WASM  │            │   Agent S3      │
│  Tools          │            │   (Python)      │
│  - Code exec    │            │   - Mouse       │
│  - File ops     │            │   - Keyboard    │
│  - HTTP calls   │            │   - Clicks      │
│  - Memory       │            │   - Navigation  │
└────────┬────────┘            └────────┬────────┘
         │                               │
         └───────────────┬───────────────┘
                         │
┌────────────────────────▼────────────────────────────────┐
│              NVIDIA NIM API (build.nvidia.com)          │
│  - Kimi K2.5 (1T parameter VLM)                         │
│  - Free tier: 1000 credits                              │
│  - 40 RPM rate limit                                    │
│  - No GPU required on our side                          │
└─────────────────────────────────────────────────────────┘
```

---

## Core Components

### 1. NVIDIA NIM Models (API-Based)

**Provider:** https://build.nvidia.com  
**Free Tier:** 1000 credits on signup (can request up to 5000 total)  
**Rate Limit:** 40 RPM (requests per minute)  
**No Credit Card Required**

#### Available Models

| Model | Type | Use Case |
|-------|------|----------|
| **Kimi K2.5** | VLM (1T params) | Primary reasoning, vision, agent tasks |
| **Llama 3.1** | LLM | General text generation |
| **DeepSeek V3** | LLM | Alternative reasoning |
| **Nemotron Speech** | STT | Speech-to-text |
| **Cosmos** | Video | Video generation/understanding |

#### Kimi K2.5 Capabilities

| Feature | Details |
|---------|---------|
| **Parameters** | 1T total, 32B active per token |
| **Context** | 256K tokens |
| **Modalities** | Text, Image, Video |
| **Agent Swarm** | Multi-agent parallel execution |
| **OK Computer Mode** | Autonomous computer control |
| **Vision** | MoonViT encoder (400M params) |

#### API Endpoint

```bash
curl https://integrate.api.nvidia.com/v1/chat/completions \
  -H "Authorization: Bearer $NVIDIA_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "moonshotai/kimi-k2.5",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

---

### 2. Agent S3 (GUI Automation)

**Repository:** https://github.com/simular-ai/Agent-S  
**Purpose:** Human-like computer control via mouse/keyboard  

#### What Agent S3 Does

| Capability | Description |
|------------|-------------|
| **Mouse Control** | Move, click, drag, scroll |
| **Keyboard Input** | Type, hotkeys, shortcuts |
| **Screen Observation** | Take screenshots, analyze UI |
| **GUI Navigation** | Open apps, navigate menus, fill forms |
| **Code Execution** | Run Python/Bash scripts locally |

#### How It Works

```python
from gui_agents.s3.agents.agent_s import AgentS3
from gui_agents.s3.agents.grounding import OSWorldACI
import pyautogui

# Take screenshot
screenshot = pyautogui.screenshot()

# Agent decides next action
instruction = "Open Firefox and go to google.com"
info, action = agent.predict(instruction, {"screenshot": screenshot})

# Execute action (contains pyautogui commands)
exec(action[0])  # e.g., pyautogui.click(x=100, y=200)
```

#### Behavior Best-of-N (bBoN)

Agent S3 uses **parallel rollouts** for reliability:

```
1. Run agent N times in parallel (N=10 recommended)
2. Each rollout produces different action sequence
3. Judge compares all rollouts
4. Select best rollout for execution
```

**Performance:** 69.9% on OSWorld (vs. 72% human baseline)

#### Installation

```bash
# Clone repository
git clone https://github.com/simular-ai/Agent-S.git
cd Agent-S

# Install
pip install -e .
brew install tesseract  # For OCR

# Set API keys
export OPENAI_API_KEY="your-key"  # Or NVIDIA API key
```

#### CLI Usage

```bash
agent_s \
    --provider openai \
    --model gpt-5-2025-08-07 \
    --ground_provider huggingface \
    --ground_url http://localhost:8080 \
    --ground_model ui-tars-1.5-7b \
    --grounding_width 1920 \
    --grounding_height 1080
```

---

### 3. ZeroClaw (Rust Runtime)

**Repository:** https://github.com/zeroclaw-labs/zeroclaw  
**Purpose:** Core agent orchestration, tool management  

#### Why ZeroClaw

| Feature | Benefit |
|---------|---------|
| **<5MB RAM** | Minimal resource usage |
| **<10ms startup** | Fast response times |
| **Rust binary** | Single executable, no dependencies |
| **WASM sandbox** | Secure tool execution |
| **Multi-tenant** | Built-in tenant isolation |
| **22+ providers** | NVIDIA NIM, OpenAI, Anthropic, etc. |

#### Installation

```bash
# One-line install
curl -LsSf https://raw.githubusercontent.com/zeroclaw-labs/zeroclaw/main/scripts/install.sh | bash

# Onboard with NVIDIA API
zeroclaw onboard \
    --api-key "$NVIDIA_API_KEY" \
    --provider openai \
    --base-url "https://integrate.api.nvidia.com/v1"

# Run as daemon
zeroclaw daemon
```

#### Configuration

```toml
# ~/.config/zeroclaw/config.toml

[provider]
type = "openai"
base_url = "https://integrate.api.nvidia.com/v1"
api_key = "$NVIDIA_API_KEY"
model = "moonshotai/kimi-k2.5"

[memory]
backend = "sqlite"
path = "~/.local/share/zeroclaw/memory.db"

[security]
sandbox = true
allowed_paths = ["/home/*/workspace/**"]
```

---

## File System Structure

### Standard Linux Paths

```
/home/
├── username1/
│   ├── workspace/          # Agent work area
│   │   ├── task_plan.md
│   │   ├── notes.md
│   │   └── output/
│   ├── .zeroclaw/          # ZeroClaw config & memory
│   │   ├── config.toml
│   │   └── memory.db
│   └── .agent-s3/          # Agent S3 config
│       └── logs/
│
├── username2/
│   ├── workspace/
│   ├── .zeroclaw/
│   └── .agent-s3/
│
└── shared/
    └── common-tools/       # Shared resources
```

### S3 Storage (Optional Cloud Backup)

```
s3://your-bucket/
├── user1/
│   ├── backup/
│   └── archives/
├── user2/
│   ├── backup/
│   └── archives/
```

---

## VPS Deployment

### Ubuntu Server Setup

**Requirements:**
- Ubuntu 24.04 LTS
- 2+ CPU cores
- 4+ GB RAM
- 50+ GB storage
- No GPU required (using NVIDIA API)

#### Initial Setup

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install dependencies
sudo apt install -y \
    curl \
    git \
    python3 \
    python3-pip \
    python3-venv \
    xvfb \
    x11-xkb-utils \
    xfonts-100dpi \
    xfonts-75dpi \
    xfonts-scalable \
    xfonts-cyrillic \
    tesseract-ocr

# Create user
sudo adduser agentuser
sudo usermod -aG sudo agentuser

# Switch to user
su - agentuser
```

#### Xvfb Setup (Headless GUI)

```bash
# Start Xvfb on display :99
Xvfb :99 -screen 0 1920x1080x24 &
export DISPLAY=:99

# Make permanent (add to ~/.bashrc)
echo 'export DISPLAY=:99' >> ~/.bashrc
echo 'Xvfb :99 -screen 0 1920x1080x24 &' >> ~/.bashrc
```

#### NVIDIA API Key Setup

```bash
# Get API key from https://build.nvidia.com
export NVIDIA_API_KEY="nvapi-..."

# Add to ~/.bashrc for persistence
echo 'export NVIDIA_API_KEY="nvapi-..."' >> ~/.bashrc
```

---

## Agent S3 + ZeroClaw Integration

### Workflow

1. **User submits task** → ZeroClaw receives request
2. **ZeroClaw analyzes** → Determines if GUI interaction needed
3. **If API task** → ZeroClaw handles with WASM tools
4. **If GUI task** → ZeroClaw spawns Agent S3 in Xvfb

### Integration Script

```python
#!/usr/bin/env python3
"""
ZeroClaw + Agent S3 Integration
"""

import subprocess
import os

def run_gui_task(instruction: str, display: str = ":99"):
    """Run Agent S3 for GUI tasks"""
    
    env = os.environ.copy()
    env["DISPLAY"] = display
    env["NVIDIA_API_KEY"] = os.environ["NVIDIA_API_KEY"]
    
    cmd = [
        "agent_s",
        "--provider", "openai",
        "--model", "gpt-5-2025-08-07",
        "--ground_provider", "huggingface",
        "--ground_url", "http://localhost:8080",
        "--ground_model", "ui-tars-1.5-7b",
    ]
    
    # Run with Xvfb
    result = subprocess.run(
        ["xvfb-run", "-a", "-s", "-screen 0 1920x1080x24"] + cmd,
        env=env,
        capture_output=True,
        text=True
    )
    
    return result.stdout

# Example: ZeroClaw calls this for GUI tasks
if __name__ == "__main__":
    output = run_gui_task("Open Firefox and search for weather")
    print(output)
```

---

## Implementation Phases

### Phase 1: VPS Setup (Week 1)

- [ ] Provision Ubuntu VPS
- [ ] Create user accounts
- [ ] Install dependencies (Python, Xvfb, Tesseract)
- [ ] Configure Xvfb for headless GUI
- [ ] Set up NVIDIA API keys

### Phase 2: ZeroClaw Deployment (Week 2)

- [ ] Install ZeroClaw
- [ ] Configure NVIDIA NIM provider
- [ ] Set up per-user config files
- [ ] Test basic agent tasks
- [ ] Configure WASM sandbox

### Phase 3: Agent S3 Integration (Week 3)

- [ ] Clone Agent-S repository
- [ ] Install dependencies
- [ ] Configure grounding model
- [ ] Test mouse/keyboard automation
- [ ] Integrate with ZeroClaw

### Phase 4: Multi-User Setup (Week 4)

- [ ] Create user isolation
- [ ] Set up per-user workspaces
- [ ] Configure S3 backup (optional)
- [ ] Test concurrent users
- [ ] Security hardening

### Phase 5: Production Hardening (Week 5-6)

- [ ] Monitoring setup
- [ ] Logging configuration
- [ ] Backup automation
- [ ] Performance optimization
- [ ] Documentation

---

## NVIDIA NIM Models Reference

### Free Tier Details

| Feature | Limit |
|---------|-------|
| **Initial Credits** | 1000 credits |
| **Max Credits** | 5000 (on request) |
| **Rate Limit** | 40 RPM |
| **Credit Card** | Not required |
| **Signup** | https://build.nvidia.com |

### Available Models

| Model | Provider | Type | Use Case |
|-------|----------|------|----------|
| **kimi-k2.5** | MoonshotAI | VLM (1T) | Primary agent |
| **llama-3.1-70b** | Meta | LLM | Text generation |
| **llama-3.1-405b** | Meta | LLM | Complex reasoning |
| **deepseek-v3** | DeepSeek | LLM | Alternative |
| **nemotron-speech** | NVIDIA | STT | Speech-to-text |
| **cosmos-transfer** | NVIDIA | Video | Video generation |

### API Usage Example

```python
import requests

NVIDIA_API_KEY = "nvapi-..."
url = "https://integrate.api.nvidia.com/v1/chat/completions"

headers = {
    "Authorization": f"Bearer {NVIDIA_API_KEY}",
    "Content-Type": "application/json"
}

payload = {
    "model": "moonshotai/kimi-k2.5",
    "messages": [
        {"role": "user", "content": "What can you do?"}
    ],
    "max_tokens": 1024
}

response = requests.post(url, headers=headers, json=payload)
print(response.json()["choices"][0]["message"]["content"])
```

---

## Key Resources

### Official Links

| Resource | URL |
|----------|-----|
| **NVIDIA NIM** | https://build.nvidia.com |
| **ZeroClaw** | https://github.com/zeroclaw-labs/zeroclaw |
| **Agent S3** | https://github.com/simular-ai/Agent-S |
| **Kimi K2.5** | https://build.nvidia.com/moonshotai/kimi-k2.5 |

### Documentation

| Resource | URL |
|----------|-----|
| ZeroClaw Docs | https://zeroclaw.bot/ |
| Agent S3 Paper | https://arxiv.org/abs/2510.02250 |
| NVIDIA NIM Docs | https://docs.nvidia.com/nim |

---

## Summary

### What We're Building

✅ **Multi-tenant AI agent platform** on Ubuntu VPS  
✅ **ZeroClaw** for core orchestration (Rust, WASM)  
✅ **Agent S3** for GUI automation (mouse/keyboard)  
✅ **NVIDIA NIM API** for models (Kimi K2.5, free tier)  
✅ **No local GPU** - All inference via API  
✅ **Standard Linux paths** - `/home/username/` structure  

### What We're NOT Using

❌ No local/offline model deployment  
❌ No vLLM self-hosting  
❌ No GPU/VRAM management  
❌ No model quantization  
❌ No complex Kubernetes setup  

### Next Steps

1. Get NVIDIA API key from https://build.nvidia.com
2. Provision Ubuntu VPS
3. Install ZeroClaw
4. Install Agent S3
5. Test integration

---

**Document Version:** 2.0 (Corrected - No Hallucinations)  
**Last Updated:** February 27, 2026  
**Status:** Ready for Implementation
