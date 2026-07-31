from fastapi import APIRouter
from app.utils.mock_data import MOCK_FISHERMEN, MOCK_CYCLONE
from app.agents.orchestrator import get_orchestrator

router = APIRouter()


@router.get("/fishermen")
async def get_fishermen():
    """Get all fishermen/boats status"""
    return {"fishermen": MOCK_FISHERMEN, "count": len(MOCK_FISHERMEN)}


@router.get("/fishermen/{boat_id}")
async def get_boat(boat_id: str):
    """Get specific boat details"""
    for f in MOCK_FISHERMEN:
        if f.get("boatId") == boat_id or f.get("id") == boat_id:
            return f
    return {"error": "Boat not found"}


@router.post("/fishermen/assess-fleet")
async def assess_fleet():
    """Run AI fleet risk assessment"""
    orchestrator = get_orchestrator()
    assessments = orchestrator.fishermen_agent.assess_fleet(
        MOCK_FISHERMEN, MOCK_CYCLONE
    )
    return {
        "assessments": [a.__dict__ for a in assessments[:5]],
        "total_assessed": len(assessments),
        "emergency": sum(1 for a in assessments if a.risk_level == "CRITICAL"),
        "high_risk": sum(1 for a in assessments if a.risk_level == "HIGH"),
    }
