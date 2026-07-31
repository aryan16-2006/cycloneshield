from fastapi import APIRouter
from app.services.weather_service import get_all_live_weather

router = APIRouter()


@router.get("/weather")
async def get_weather():
    """Get real-time live weather observations for Gujarat coastal districts"""
    weather_data = get_all_live_weather()
    return {"weather": weather_data, "count": len(weather_data)}


@router.get("/weather/{district}")
async def get_district_weather(district: str):
    """Get real-time live weather observation for a specific district"""
    weather_data = get_all_live_weather()
    for w in weather_data:
        if w["district"].lower() == district.lower():
            return w
    return {"error": f"District '{district}' not found"}

