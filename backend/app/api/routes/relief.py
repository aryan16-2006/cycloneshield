from fastapi import APIRouter
from app.utils.mock_data import MOCK_INVENTORY, MOCK_RESCUE_TEAMS

router = APIRouter()


@router.get("/relief")
async def get_relief():
    return {"inventory": MOCK_INVENTORY, "rescue_teams": MOCK_RESCUE_TEAMS}
