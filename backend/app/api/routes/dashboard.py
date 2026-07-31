from fastapi import APIRouter
from app.utils.mock_data import MOCK_CYCLONE, GUJARAT_DISTRICTS

router = APIRouter()


@router.get("/dashboard")
async def get_dashboard():
    """Main dashboard statistics"""
    return {
        "activeCyclones": 1,
        "riskLevel": "CRITICAL",
        "activeAlerts": 6,
        "peopleEvacuated": 222700,
        "boatsAtSea": 1482,
        "sheltersAvailable": 456,
        "rescueTeams": 38,
        "totalDistricts": 11,
        "criticalDistricts": 2,
        "lastUpdated": "2024-06-15T14:30:00Z",
        "activeCyclone": MOCK_CYCLONE,
        "districts": GUJARAT_DISTRICTS,
    }
