# =============================================================
# CycloneShield AI — FastAPI Main Application
# =============================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from contextlib import asynccontextmanager
import logging

from app.api.routes import (
    auth, dashboard, cyclone, weather, fishermen,
    alerts, evacuation, shelters, relief, damage,
    analytics, chat, reports,
)
from app.core.config import settings

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("CycloneShield AI starting up…")
    logger.info(f"IBM Watson endpoint: {settings.IBM_WATSON_URL}")
    yield
    logger.info("CycloneShield AI shutting down…")


app = FastAPI(
    title="CycloneShield AI API",
    description="AI-Driven Cyclone & Coastal Disaster Early Warning System for Gujarat",
    version="1.0.0",
    docs_url="/api/docs",
    redoc_url="/api/redoc",
    lifespan=lifespan,
)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(GZipMiddleware, minimum_size=500)

# Routes
app.include_router(auth.router,       prefix="/api/v1", tags=["Authentication"])
app.include_router(dashboard.router,  prefix="/api/v1", tags=["Dashboard"])
app.include_router(cyclone.router,    prefix="/api/v1", tags=["Cyclone"])
app.include_router(weather.router,    prefix="/api/v1", tags=["Weather"])
app.include_router(fishermen.router,  prefix="/api/v1", tags=["Fishermen"])
app.include_router(alerts.router,     prefix="/api/v1", tags=["Alerts"])
app.include_router(evacuation.router, prefix="/api/v1", tags=["Evacuation"])
app.include_router(shelters.router,   prefix="/api/v1", tags=["Shelters"])
app.include_router(relief.router,     prefix="/api/v1", tags=["Relief"])
app.include_router(damage.router,     prefix="/api/v1", tags=["Damage"])
app.include_router(analytics.router,  prefix="/api/v1", tags=["Analytics"])
app.include_router(chat.router,       prefix="/api/v1", tags=["AI Chat"])
app.include_router(reports.router,    prefix="/api/v1", tags=["Reports"])


@app.get("/", tags=["Root"])
async def root():
    return {
        "name": "CycloneShield AI",
        "version": "1.0.0",
        "status": "operational",
        "theme": "AI-Driven Cyclone & Coastal Disaster Early Warning System",
        "docs": "/api/docs",
    }


@app.get("/health", tags=["Health"])
async def health():
    return {"status": "healthy", "ai_agents": 6, "active_cyclones": 1}
