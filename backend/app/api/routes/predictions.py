from fastapi import APIRouter
from app.agents.orchestrator import get_orchestrator
from app.utils.mock_data import MOCK_CYCLONE, MOCK_FISHERMEN
from datetime import datetime

router = APIRouter()


@router.post("/cyclone")
async def predict_cyclone():
    """Run IBM Granite AI cyclone prediction"""
    orchestrator = get_orchestrator()
    prediction = orchestrator.cyclone_agent.predict(MOCK_CYCLONE)
    return {
        "status": "success",
        "prediction": {
            "name": prediction.name,
            "category": prediction.current_category,
            "predicted_category_36h": prediction.predicted_category_36h,
            "landfall_district": prediction.predicted_landfall_district,
            "landfall_time": prediction.predicted_landfall_time,
            "wind_speed_kmh": prediction.wind_speed_kmh,
            "pressure_hpa": prediction.pressure_hpa,
            "storm_surge_m": prediction.storm_surge_m,
            "rainfall_mm": prediction.rainfall_mm,
            "trajectory": prediction.trajectory,
            "confidence": prediction.confidence,
            "ai_summary": prediction.ai_summary,
            "reasoning_steps": prediction.reasoning_steps,
            "risk_scores": prediction.risk_scores,
            "model_used": prediction.model_used,
        },
        "generated_at": datetime.now().isoformat(),
    }


@router.post("/fleet")
async def predict_fleet_risk():
    """Run IBM Granite fishermen risk assessment"""
    orchestrator = get_orchestrator()
    assessments = orchestrator.fishermen_agent.assess_fleet(MOCK_FISHERMEN, MOCK_CYCLONE)
    return {
        "status": "success",
        "total_assessed": len(assessments),
        "emergency_count": sum(1 for a in assessments if a.risk_level == "CRITICAL"),
        "assessments": [
            {
                "boat_id": a.boat_id,
                "fisherman": a.fisherman_name,
                "risk_score": a.risk_score,
                "risk_level": a.risk_level,
                "nearest_harbor": a.nearest_harbor,
                "distance_km": a.distance_to_harbor,
                "action": a.recommended_action,
                "alert": a.alert_message,
                "eta": a.estimated_safe_return,
            }
            for a in assessments
        ],
        "generated_at": datetime.now().isoformat(),
    }


@router.post("/pipeline")
async def run_full_pipeline():
    """Run complete multi-agent AI pipeline"""
    orchestrator = get_orchestrator()
    result = orchestrator.run_full_pipeline(MOCK_CYCLONE, MOCK_FISHERMEN)
    return {"status": "success", "pipeline_result": result, "generated_at": datetime.now().isoformat()}
