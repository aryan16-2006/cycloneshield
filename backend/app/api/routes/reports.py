from fastapi import APIRouter

router = APIRouter()


@router.get("/reports")
async def get_reports():
    return {
        "reports": [
            {"id": "R001", "title": "Cyclone Biparjoy-II — Situation Report #3", "type": "Cyclone Report", "status": "Published"},
            {"id": "R002", "title": "Damage Assessment Preliminary — Jamnagar", "type": "Damage Report", "status": "Draft"},
            {"id": "R003", "title": "Evacuation Status Report — 5 Districts", "type": "Evacuation Report", "status": "Published"},
        ]
    }
