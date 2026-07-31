from fastapi import APIRouter
from app.utils.mock_data import MOCK_DAMAGE

router = APIRouter()


@router.get("/damage")
async def get_damage():
    return {"reports": MOCK_DAMAGE}
