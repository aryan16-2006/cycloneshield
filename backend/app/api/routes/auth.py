from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()


class LoginRequest(BaseModel):
    email: str
    password: str


@router.post("/login")
async def login(request: LoginRequest):
    """Mock authentication endpoint"""
    if request.password == "admin123":
        return {
            "access_token": "mock_jwt_token_cycloneshield_2024",
            "token_type": "bearer",
            "user": {
                "id": "1",
                "name": "Admin Officer",
                "email": request.email,
                "role": "ADMIN",
                "district": "Gujarat SDMA",
            }
        }
    return {"error": "Invalid credentials"}
