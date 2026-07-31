from fastapi import APIRouter
from app.utils.mock_data import MOCK_EVACUATION_ROUTES, MOCK_SHELTERS

router = APIRouter()


@router.get("/evacuate")
async def get_evacuation_routes():
    return {"routes": MOCK_EVACUATION_ROUTES}


@router.get("/shelters")
async def get_shelters():
    return {"shelters": MOCK_SHELTERS}
