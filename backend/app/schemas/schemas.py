# ============================================================
# CycloneShield AI — Pydantic Schemas (Request / Response)
# ============================================================

from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime
from enum import Enum


# ── Enums ────────────────────────────────────────────────────
class RiskLevel(str, Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    SAFE = "SAFE"


class BoatStatus(str, Enum):
    AT_SEA = "AT_SEA"
    RETURNING = "RETURNING"
    IN_HARBOR = "IN_HARBOR"
    MISSING = "MISSING"
    EMERGENCY = "EMERGENCY"


class ShelterStatus(str, Enum):
    AVAILABLE = "AVAILABLE"
    PARTIAL = "PARTIAL"
    FULL = "FULL"
    DAMAGED = "DAMAGED"


class UserRole(str, Enum):
    ADMIN = "ADMIN"
    DISTRICT_OFFICER = "DISTRICT_OFFICER"
    DISASTER_RESPONSE = "DISASTER_RESPONSE"
    VOLUNTEER = "VOLUNTEER"
    CITIZEN = "CITIZEN"
    FISHERMAN = "FISHERMAN"


# ── Auth ──────────────────────────────────────────────────────
class UserLogin(BaseModel):
    email: EmailStr
    password: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    expires_in: int
    user: Dict[str, Any]


class UserCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=100)
    email: EmailStr
    password: str = Field(..., min_length=6)
    role: UserRole = UserRole.CITIZEN
    district: Optional[str] = None
    phone: Optional[str] = None


class UserResponse(BaseModel):
    id: str
    name: str
    email: str
    role: UserRole
    district: Optional[str]
    is_active: bool

    class Config:
        from_attributes = True


# ── Coordinates ───────────────────────────────────────────────
class Coordinates(BaseModel):
    lat: float
    lng: float


# ── Cyclone ───────────────────────────────────────────────────
class CycloneBase(BaseModel):
    name: str
    category: int = Field(..., ge=1, le=5)
    wind_speed: float
    pressure: float
    lat: float
    lng: float
    trajectory: List[Coordinates]
    predicted_landfall: str
    landfall_time: datetime
    intensity: str
    storm_surge: float
    rainfall_estimate: float
    confidence: int = Field(..., ge=0, le=100)
    is_active: bool = True


class CycloneResponse(CycloneBase):
    id: str
    last_updated: Optional[datetime] = None

    class Config:
        from_attributes = True


# ── Weather ───────────────────────────────────────────────────
class WeatherResponse(BaseModel):
    district: str
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: str
    rainfall: float
    pressure: float
    sea_state: str
    wave_height: float
    visibility: float
    timestamp: datetime


# ── Fisherman ─────────────────────────────────────────────────
class FishermanResponse(BaseModel):
    id: str
    name: str
    phone: str
    boat_id: str
    district: str
    lat: float
    lng: float
    status: BoatStatus
    crew_count: int
    nearest_harbor: str
    distance_to_harbor: float
    estimated_return: str
    last_ping: str
    risk_score: int


class FishermanAlertRequest(BaseModel):
    fisherman_id: str
    alert_type: str
    message: str


# ── Shelter ───────────────────────────────────────────────────
class ShelterResponse(BaseModel):
    id: str
    name: str
    district: str
    lat: float
    lng: float
    capacity: int
    occupied: int
    status: ShelterStatus
    facilities: List[str]
    contact_phone: str
    in_charge: str


# ── Alert ─────────────────────────────────────────────────────
class AlertResponse(BaseModel):
    id: str
    alert_type: str
    level: RiskLevel
    title: str
    message: str
    district: str
    affected_population: int
    issued_at: datetime
    expires_at: Optional[datetime]
    is_active: bool
    source: str


class AlertCreate(BaseModel):
    alert_type: str
    level: RiskLevel
    title: str
    message: str
    district: str
    affected_population: int
    source: str


# ── District ──────────────────────────────────────────────────
class DistrictResponse(BaseModel):
    id: str
    name: str
    lat: float
    lng: float
    population: int
    coastline_km: float
    risk_level: RiskLevel
    risk_score: int
    evacuated: int
    boats_at_sea: int
    shelters_total: int
    shelters_active: int
    shelter_capacity: int
    shelter_occupancy: int


# ── Evacuation ────────────────────────────────────────────────
class EvacuationRouteResponse(BaseModel):
    route_id: str
    from_location: str
    to_shelter: str
    distance_km: float
    estimated_time_min: int
    road_condition: str
    traffic_level: str
    waypoints: List[Coordinates]
    is_recommended: bool
    ai_reasoning: Optional[str] = None


class EvacuationPlanRequest(BaseModel):
    district: str
    population_count: int
    priority: str = "HIGH"


class EvacuationPlanResponse(BaseModel):
    district: str
    total_to_evacuate: int
    routes: List[EvacuationRouteResponse]
    shelters_allocated: List[ShelterResponse]
    estimated_completion_hours: float
    ai_summary: str
    confidence: int


# ── Relief ────────────────────────────────────────────────────
class ReliefInventoryResponse(BaseModel):
    id: str
    category: str
    item: str
    available: int
    required: int
    unit: str
    location: str
    coverage_pct: float
    status: str  # OK | LOW | CRITICAL


class ReliefRequestBody(BaseModel):
    district: str
    items: List[Dict[str, Any]]
    priority: str = "NORMAL"


# ── Damage ────────────────────────────────────────────────────
class DamageReportResponse(BaseModel):
    id: str
    district: str
    report_date: datetime
    houses_destroyed: int
    houses_damaged: int
    lives_lost: int
    injured: int
    livestock_loss: int
    crop_area_affected: float
    infrastructure_damage: float
    total_estimated_loss: float
    status: str
    verified_by: str
    ai_analysis: Optional[str] = None


# ── Dashboard ─────────────────────────────────────────────────
class DashboardStatsResponse(BaseModel):
    active_cyclones: int
    risk_level: RiskLevel
    active_alerts: int
    people_evacuated: int
    boats_at_sea: int
    shelters_available: int
    rescue_teams: int
    total_districts: int
    critical_districts: int
    last_updated: datetime


# ── AI Prediction ─────────────────────────────────────────────
class PredictionRequest(BaseModel):
    cyclone_id: Optional[str] = None
    district: Optional[str] = None
    prediction_type: str = "CYCLONE_TRACK"  # CYCLONE_TRACK | INTENSITY | FLOOD_RISK | SHELTER_DEMAND


class PredictionResponse(BaseModel):
    prediction_type: str
    district: Optional[str]
    prediction: Dict[str, Any]
    confidence: int
    model_used: str
    reasoning_steps: List[str]
    summary: str
    generated_at: datetime


# ── Chat ──────────────────────────────────────────────────────
class ChatRequest(BaseModel):
    message: str
    language: str = "en"  # en | hi | gu
    session_id: Optional[str] = None
    agent_type: str = "ASSISTANT"


class ChatResponse(BaseModel):
    session_id: str
    message: str
    confidence: int
    agent_type: str
    language: str
    sources: List[str] = []
    timestamp: datetime


# ── Analytics ─────────────────────────────────────────────────
class AnalyticsResponse(BaseModel):
    cyclone_frequency: List[Dict[str, Any]]
    wind_speed_trend: List[Dict[str, Any]]
    rainfall_data: List[Dict[str, Any]]
    evacuation_progress: List[Dict[str, Any]]
    shelter_occupancy: List[Dict[str, Any]]
    district_risk_scores: List[Dict[str, Any]]
    response_time_data: List[Dict[str, Any]]
    damage_cost_trend: List[Dict[str, Any]]
