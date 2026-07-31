from fastapi import APIRouter
from app.utils.mock_data import MOCK_SHELTERS

router = APIRouter()


@router.get("/shelters")
async def get_shelters():
    return {"shelters": MOCK_SHELTERS, "total": len(MOCK_SHELTERS)}
