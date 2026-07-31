from fastapi import APIRouter
from app.utils.mock_data import CYCLONE_FREQUENCY_DATA, WIND_SPEED_TREND, RAINFALL_DATA, EVACUATION_PROGRESS

router = APIRouter()


@router.get("/analytics")
async def get_analytics():
    return {
        "cyclone_frequency": CYCLONE_FREQUENCY_DATA,
        "wind_speed_trend": WIND_SPEED_TREND,
        "rainfall_by_district": RAINFALL_DATA,
        "evacuation_progress": EVACUATION_PROGRESS,
        "summary": {
            "total_cyclones_2024": 3,
            "avg_response_time_min": 14.8,
            "total_evacuated": 222700,
            "total_damage_cr": 1720,
        }
    }
