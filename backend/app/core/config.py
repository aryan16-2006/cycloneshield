# ============================================================
# CycloneShield AI — Application Configuration
# ============================================================

from pydantic_settings import BaseSettings
from typing import List
import os


class Settings(BaseSettings):
    # App
    APP_NAME: str = "CycloneShield AI"
    VERSION: str = "1.0.0"
    ENVIRONMENT: str = "development"
    SECRET_KEY: str = "cycloneshield-secret-key-change-in-production"
    DEBUG: bool = True

    # Database
    DATABASE_URL: str = "postgresql://cyclone_user:cyclone_pass@localhost:5432/cycloneshield_db"
    REDIS_URL: str = "redis://localhost:6379/0"

    # IBM Watson / Granite
    IBM_WATSON_URL: str = "https://us-south.ml.cloud.ibm.com"
    IBM_API_KEY: str = "2g0pAtlgRmh-XMMnavcQios3Hsz9_88Jut3tO0T1P1Yf"
    IBM_PROJECT_ID: str = "ee9ca177-dd2a-4be0-96e3-bf2a45b494fe"
    IBM_GRANITE_MODEL: str = "ibm/granite-8b-code-instruct"
    IBM_GRANITE_EMBEDDING: str = "ibm/slate-30m-english-rtrvr"

    # CORS
    ALLOWED_ORIGINS: List[str] = [
        "http://localhost:3000",
        "http://localhost:5173",
        "https://cycloneshield.ibmcloud.com",
    ]

    # JWT
    JWT_SECRET_KEY: str = "jwt-secret-cycloneshield-2024"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRE_MINUTES: int = 60 * 24  # 24 hours

    # Weather APIs
    IMD_API_KEY: str = "your-imd-api-key"
    OPENWEATHER_API_KEY: str = "your-openweather-key"

    # Celery
    CELERY_BROKER_URL: str = "redis://localhost:6379/1"
    CELERY_RESULT_BACKEND: str = "redis://localhost:6379/2"

    class Config:
        env_file = ".env"
        case_sensitive = True


settings = Settings()
