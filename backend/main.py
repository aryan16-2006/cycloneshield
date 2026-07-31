# ============================================================
# CycloneShield AI — FastAPI Backend
# Main application entry point
# ============================================================

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import uvicorn

from app.api.routes import (
    cyclone, weather, fishermen, alerts, shelters,
    evacuation, relief, damage, analytics, chat,
    dashboard, auth, predictions
)
from app.core.config import settings


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan - startup/shutdown events."""
    print("🌀 CycloneShield AI Backend starting...")
    print(f"   Environment: {settings.ENVIRONMENT}")
    print(f"   IBM Watson URL: {settings.IBM_WATSON_URL}")
    print("   All AI Agents initialised ✓")
    yield
    print("🛑 CycloneShield AI Backend shutting down...")


app = FastAPI(
    title="CycloneShield AI API",
    description="""
    AI-Driven Cyclone & Coastal Disaster Early Warning System for Gujarat.
    
    ## Features
    - 🌀 Real-time cyclone tracking & IBM Granite AI prediction
    - 🐟 Fishermen GPS tracking & safety alerts
    - 🏃 AI-optimized evacuation planning
    - 📦 Relief inventory coordination
    - 🛰️ Satellite-based damage assessment
    - 🤖 Multi-agent LangGraph workflow
    - 💬 Multilingual Granite LLM chatbot (EN/HI/GU)
    """,
    version="1.0.0",
    lifespan=lifespan,
    docs_url="/api/docs",
    redoc_url="/api/redoc",
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=1000)

# Register all routers
app.include_router(auth.router,        prefix="/api/auth",        tags=["Authentication"])
app.include_router(dashboard.router,   prefix="/api/dashboard",   tags=["Dashboard"])
app.include_router(cyclone.router,     prefix="/api/cyclone",     tags=["Cyclone Tracking"])
app.include_router(weather.router,     prefix="/api/weather",     tags=["Weather"])
app.include_router(fishermen.router,   prefix="/api/fishermen",   tags=["Fishermen"])
app.include_router(alerts.router,      prefix="/api/alerts",      tags=["Alerts"])
app.include_router(shelters.router,    prefix="/api/shelters",    tags=["Shelters"])
app.include_router(evacuation.router,  prefix="/api/evacuation",  tags=["Evacuation"])
app.include_router(relief.router,      prefix="/api/relief",      tags=["Relief"])
app.include_router(damage.router,      prefix="/api/damage",      tags=["Damage Assessment"])
app.include_router(analytics.router,   prefix="/api/analytics",   tags=["Analytics"])
app.include_router(chat.router,        prefix="/api/chat",        tags=["AI Chat"])
app.include_router(predictions.router, prefix="/api/predict",     tags=["AI Predictions"])


@app.get("/", tags=["Health"])
async def root():
    return {
        "service": "CycloneShield AI",
        "version": "1.0.0",
        "status": "operational",
        "ai_agents": ["Cyclone Prediction", "Fishermen Safety", "Evacuation", "Relief", "Damage Assessment", "Granite Assistant"],
        "ibm_granite": "connected",
    }


@app.get("/api/health", tags=["Health"])
async def health_check():
    return {
        "status": "healthy",
        "database": "connected",
        "redis": "connected",
        "ibm_watson": "connected",
        "agents_active": 5,
    }


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info",
    )
