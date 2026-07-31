from fastapi import APIRouter
from pydantic import BaseModel
from typing import Optional
from app.agents.orchestrator import get_orchestrator

router = APIRouter()


class ChatRequest(BaseModel):
    message: str
    language: str = "en"
    agent_type: str = "ASSISTANT"


@router.post("/chat")
async def chat(request: ChatRequest):
    """IBM Granite AI Chat endpoint"""
    orchestrator = get_orchestrator()
    response = orchestrator.chat(request.message, request.language)
    return {
        "message": response.message,
        "confidence": response.confidence,
        "language": response.language,
        "agent": response.agent_name,
        "model": response.model,
        "sources": response.sources,
        "reasoning": response.reasoning,
    }


@router.get("/agents")
async def get_agents():
    """Get all AI agent statuses"""
    return {
        "agents": [
            {"id": "AGT001", "name": "Cyclone Prediction Agent", "type": "CYCLONE_PREDICTION", "status": "ACTIVE", "confidence": 87, "model": "IBM Granite 13B + LSTM", "tasksCompleted": 1247},
            {"id": "AGT002", "name": "Fishermen Safety Agent", "type": "FISHERMEN_SAFETY", "status": "PROCESSING", "confidence": 92, "model": "IBM Granite 8B", "tasksCompleted": 3891},
            {"id": "AGT003", "name": "Evacuation Planner Agent", "type": "EVACUATION", "status": "ACTIVE", "confidence": 85, "model": "IBM Granite 13B + XGBoost", "tasksCompleted": 892},
            {"id": "AGT004", "name": "Relief Coordination Agent", "type": "RELIEF", "status": "ACTIVE", "confidence": 89, "model": "IBM Granite 8B", "tasksCompleted": 456},
            {"id": "AGT005", "name": "Damage Assessment Agent", "type": "DAMAGE", "status": "IDLE", "confidence": 78, "model": "IBM Granite Vision + CNN", "tasksCompleted": 234},
            {"id": "AGT006", "name": "Granite AI Assistant", "type": "ASSISTANT", "status": "ACTIVE", "confidence": 95, "model": "IBM Granite 34B Instruct", "tasksCompleted": 15678},
        ]
    }
