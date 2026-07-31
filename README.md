# 🌀 CycloneShield AI

**AI-Driven Cyclone & Coastal Disaster Early Warning System for Gujarat**

> A national-hackathon-grade, production-ready full-stack application featuring IBM Granite LLM, LangGraph multi-agent AI, real-time Gujarat coastal disaster management, and a stunning glassmorphism dark-mode dashboard.

[![IBM Granite](https://img.shields.io/badge/IBM-Granite%2034B-0062FF?logo=ibm)](https://www.ibm.com/products/watsonx-ai)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-009688?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://react.dev)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

---

## 📸 Screenshots

| Dashboard | Cyclone Tracker | AI Prediction |
|-----------|----------------|---------------|
| Live stats, map, alerts | Real-time track + forecast | IBM Granite AI reasoning |

| Fishermen Alerts | Agent Console | Analytics |
|------------------|---------------|-----------|
| GPS tracking + risk scores | Multi-agent chatbot (EN/HI/GU) | 8+ interactive charts |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                     CycloneShield AI Platform                   │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (React + TypeScript + Vite)                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Dashboard │ │Cyclone   │ │Fishermen │ │  Agent Console   │  │
│  │ + Map    │ │Tracker   │ │ Alerts   │ │  (Granite Chat)  │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐  │
│  │Evacuation│ │ Relief   │ │ Damage   │ │   Analytics      │  │
│  │ Planner  │ │ Coord.   │ │ Assess.  │ │   (Recharts)     │  │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────────────────────┤
│  BACKEND (FastAPI + Python)                                     │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │  REST API  /api/v1/*   |   JWT Auth   |   WebSocket     │   │
│  └─────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  AI AGENTS (LangGraph + IBM Granite)                            │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐  │
│  │ Cyclone    │ │ Fishermen  │ │ Evacuation │ │  Relief    │  │
│  │ Prediction │ │ Safety     │ │ Planner    │ │  Coord.    │  │
│  │ (LSTM+XGB) │ │ (GPS+Risk) │ │ (Dijkstra) │ │(Inventory) │  │
│  └────────────┘ └────────────┘ └────────────┘ └────────────┘  │
│  ┌────────────┐ ┌──────────────────────────────────────────┐   │
│  │  Damage    │ │  Granite AI Assistant (RAG + EN/HI/GU)  │   │
│  │ Assessment │ │  IBM Granite 34B Instruct + watsonx.ai  │   │
│  └────────────┘ └──────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────┤
│  DATA LAYER                                                     │
│  PostgreSQL  │  Redis (Cache)  │  Celery (Jobs)               │
├─────────────────────────────────────────────────────────────────┤
│  DEPLOYMENT: Docker Compose  │  IBM Cloud Code Engine          │
│  CI/CD: GitHub Actions                                          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Python 3.11+
- Docker & Docker Compose
- IBM Cloud account (optional — runs in mock mode without it)

### Option 1: Docker Compose (Recommended)

```bash
git clone https://github.com/your-org/cycloneshield-ai.git
cd cycloneshield

# Copy environment file
cp .env.example .env
# Edit .env with your IBM API keys (optional)

# Start everything
docker-compose up -d

# Open browser
open http://localhost:3000
```

### Option 2: Manual Setup

#### Frontend
```bash
cd frontend
npm install
npm run dev        # → http://localhost:5173
```

#### Backend
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install -r requirements.txt

# Database setup (requires PostgreSQL)
createdb cycloneshield_db
psql cycloneshield_db < ../database/schema.sql
psql cycloneshield_db < ../database/seed.sql

# Start API server
uvicorn main:app --reload --port 8000
# API docs → http://localhost:8000/api/docs
```

---

## 📁 Project Structure

```
cycloneshield/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/
│   │   │   ├── layout/          # Sidebar, Navbar, AppLayout
│   │   │   ├── dashboard/       # StatCard, widgets
│   │   │   └── map/             # GujaratMap (Leaflet)
│   │   ├── pages/               # 11 full pages
│   │   │   ├── Dashboard.tsx
│   │   │   ├── LiveCycloneTracker.tsx
│   │   │   ├── FishermenAlerts.tsx
│   │   │   ├── AIPrediction.tsx
│   │   │   ├── EvacuationPlanner.tsx
│   │   │   ├── ReliefCoordination.tsx
│   │   │   ├── DamageAssessment.tsx
│   │   │   ├── Analytics.tsx
│   │   │   ├── AgentConsole.tsx  ← IBM Granite Chat
│   │   │   ├── Reports.tsx
│   │   │   └── Settings.tsx
│   │   ├── types/               # TypeScript definitions
│   │   └── utils/mockData.ts    # Gujarat realistic datasets
│   ├── Dockerfile
│   └── package.json
│
├── backend/                     # FastAPI + Python
│   ├── main.py                  # Entry point
│   ├── app/
│   │   ├── agents/              # AI Agents
│   │   │   ├── cyclone_prediction_agent.py  ← IBM Granite + LSTM
│   │   │   ├── fishermen_safety_agent.py    ← GPS + Risk scoring
│   │   │   ├── granite_assistant_agent.py   ← RAG chatbot
│   │   │   └── orchestrator.py              ← LangGraph workflow
│   │   ├── api/routes/          # FastAPI route handlers
│   │   ├── models/              # SQLAlchemy ORM models
│   │   ├── schemas/             # Pydantic validation schemas
│   │   ├── core/                # Config, database, auth
│   │   └── utils/               # Mock data, helpers
│   ├── Dockerfile
│   └── requirements.txt
│
├── database/
│   ├── schema.sql               # PostgreSQL schema (15 tables)
│   └── seed.sql                 # Sample Gujarat data
│
├── docker-compose.yml           # Full stack orchestration
├── .github/workflows/ci-cd.yml  # GitHub Actions CI/CD
├── .env.example
└── docs/
    └── ibm-cloud-config.yml     # IBM Cloud deployment
```

---

## 🤖 AI Agent Architecture

### Agent 1: Cyclone Prediction Agent
- **Model**: IBM Granite 13B + LSTM trajectory + XGBoost intensity
- **Workflow**: Data ingestion → LSTM trajectory → XGBoost intensity → Risk scoring → Granite summarization → RAG lookup → Confidence calibration
- **Output**: 7-step reasoning trace, 48h forecast, district risk scores

### Agent 2: Fishermen Safety Agent  
- **Model**: IBM Granite 8B
- **Features**: Haversine distance to harbor, multi-factor risk scoring (cyclone proximity, wind speed, status, last ping), SMS alert generation
- **Output**: Per-boat risk assessment, harbor routing, alert messages

### Agent 3: Evacuation Planner Agent
- **Model**: IBM Granite 13B + XGBoost
- **Features**: Road condition analysis, shelter capacity optimization, traffic estimation, AI route recommendation
- **Output**: Optimized routes with waypoints, shelter allocation, ETA

### Agent 4: Relief Coordination Agent
- **Model**: IBM Granite 8B
- **Features**: Inventory gap analysis, rescue team dispatch, supply chain optimization, priority ranking
- **Output**: Allocation recommendations, shortage alerts

### Agent 5: Damage Assessment Agent
- **Model**: IBM Granite Vision + YOLOv8 + SAR
- **Features**: Satellite imagery analysis, structure classification (4 damage levels), loss estimation
- **Output**: CNN classification results, recovery timeline, financial estimate

### Agent 6: Granite AI Assistant
- **Model**: IBM Granite 34B Instruct
- **Features**: RAG-enhanced knowledge base, English/Hindi/Gujarati, conversational disaster management
- **Output**: Natural language responses with confidence scores

---

## 🌐 API Reference

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/dashboard` | GET | Dashboard statistics |
| `/api/cyclone` | GET | Active cyclones |
| `/api/predict/cyclone` | POST | IBM Granite AI prediction |
| `/api/fishermen` | GET | Fleet status |
| `/api/fishermen/assess-fleet` | POST | AI fleet risk assessment |
| `/api/alerts` | GET | Active alerts |
| `/api/weather` | GET | District weather |
| `/api/shelters` | GET | Shelter status |
| `/api/evacuation` | GET | Evacuation routes |
| `/api/relief` | GET | Inventory + teams |
| `/api/damage` | GET | Damage reports |
| `/api/analytics` | GET | Chart data |
| `/api/chat` | POST | IBM Granite AI chat |
| `/api/predict/fleet` | POST | Fleet risk prediction |
| `/api/auth/login` | POST | JWT authentication |

Full interactive docs: `http://localhost:8000/api/docs`

---

## 🗃️ Database Schema

15 tables:
- `users` · `districts` · `cyclones` · `weather_observations`
- `fishermen` · `shelters` · `alerts` · `rescue_teams`
- `relief_inventory` · `damage_reports` · `satellite_images`
- `ai_reports` · `chat_messages` · `evacuation_routes` · `audit_logs`

---

## 🔐 Security

- JWT authentication with role-based access control
- 6 user roles: Admin, District Officer, Disaster Response, Volunteer, Citizen, Fisherman
- HTTPS enforced in production
- Input validation via Pydantic
- SQL injection prevention via SQLAlchemy ORM
- Environment variable secrets management
- Audit logging for all admin actions

---

## 📊 Tech Stack Summary

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 + TypeScript + Vite + TailwindCSS |
| UI Components | shadcn/ui + Lucide Icons + Framer Motion |
| Maps | Leaflet + OpenStreetMap |
| Charts | Recharts |
| State | Zustand + React Query |
| Backend | FastAPI + Python 3.11 |
| ORM | SQLAlchemy 2.0 |
| Database | PostgreSQL 16 |
| Cache | Redis 7 |
| Queue | Celery |
| AI LLM | IBM Granite 34B / 13B / 8B Instruct |
| AI Platform | IBM watsonx.ai |
| Agent Framework | LangGraph + LangChain |
| ML Models | XGBoost + LSTM + Random Forest + CNN |
| Containerization | Docker + Docker Compose |
| CI/CD | GitHub Actions |
| Cloud | IBM Cloud Code Engine |
| Auth | JWT + bcrypt |

---

## 🚀 IBM Cloud Deployment

```bash
# Install IBM Cloud CLI
curl -fsSL https://clis.cloud.ibm.com/install/linux | sh
ibmcloud login

# Push images to IBM Container Registry
ibmcloud cr login
docker tag cycloneshield-backend us.icr.io/cycloneshield/backend:latest
docker push us.icr.io/cycloneshield/backend:latest

# Deploy to Code Engine
ibmcloud ce project create --name cycloneshield
ibmcloud ce application create \
  --name cycloneshield-backend \
  --image us.icr.io/cycloneshield/backend:latest \
  --port 8000 \
  --min-scale 1 --max-scale 10

# Create secrets
ibmcloud ce secret create --name cycloneshield-secrets \
  --from-env-file .env.production
```

---

## 🔮 Future Scope

1. **Real IMD API Integration** — Live cyclone data feed from imd.gov.in
2. **INCOIS Integration** — Ocean state forecast for storm surge
3. **WhatsApp Business API** — Direct alerts to fishermen's phones
4. **Mobile App** (React Native) — Offline-capable PWA with GPS
5. **Drone Integration** — Real-time damage imagery via DJI SDK
6. **Multilingual NLP** — Extended regional language support (Marathi, Tamil)
7. **Digital Twin** — 3D coastal simulation for storm surge modeling
8. **Blockchain** — Tamper-proof relief distribution tracking
9. **Satellite API** — ISRO's Bhuvan + Copernicus integration
10. **Federated Learning** — Privacy-preserving model training across districts

---

## 👥 Team

Built with ❤️ for national-level disaster management hackathon.

**Technologies**: React · TypeScript · FastAPI · PostgreSQL · IBM Granite AI · IBM watsonx.ai · LangGraph · Leaflet · Docker · IBM Cloud

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.
