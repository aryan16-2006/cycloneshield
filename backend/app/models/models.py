# ============================================================
# CycloneShield AI — SQLAlchemy Database Models
# ============================================================

from sqlalchemy import (
    Column, String, Integer, Float, Boolean, DateTime,
    Text, ForeignKey, JSON, Enum as SAEnum
)
from sqlalchemy.orm import relationship, DeclarativeBase
from sqlalchemy.sql import func
import uuid
import enum


class Base(DeclarativeBase):
    pass


def gen_uuid():
    return str(uuid.uuid4())


# ── Enums ────────────────────────────────────────────────────
class RiskLevel(str, enum.Enum):
    CRITICAL = "CRITICAL"
    HIGH = "HIGH"
    MEDIUM = "MEDIUM"
    LOW = "LOW"
    SAFE = "SAFE"


class BoatStatus(str, enum.Enum):
    AT_SEA = "AT_SEA"
    RETURNING = "RETURNING"
    IN_HARBOR = "IN_HARBOR"
    MISSING = "MISSING"
    EMERGENCY = "EMERGENCY"


class ShelterStatus(str, enum.Enum):
    AVAILABLE = "AVAILABLE"
    PARTIAL = "PARTIAL"
    FULL = "FULL"
    DAMAGED = "DAMAGED"


class UserRole(str, enum.Enum):
    ADMIN = "ADMIN"
    DISTRICT_OFFICER = "DISTRICT_OFFICER"
    DISASTER_RESPONSE = "DISASTER_RESPONSE"
    VOLUNTEER = "VOLUNTEER"
    CITIZEN = "CITIZEN"
    FISHERMAN = "FISHERMAN"


# ── Models ───────────────────────────────────────────────────

class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    email = Column(String(150), unique=True, nullable=False)
    hashed_password = Column(String(200), nullable=False)
    role = Column(SAEnum(UserRole), default=UserRole.CITIZEN)
    district = Column(String(50))
    phone = Column(String(20))
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())


class District(Base):
    __tablename__ = "districts"
    id = Column(String, primary_key=True)
    name = Column(String(100), nullable=False)
    lat = Column(Float, nullable=False)
    lng = Column(Float, nullable=False)
    population = Column(Integer)
    coastline_km = Column(Float)
    risk_level = Column(SAEnum(RiskLevel), default=RiskLevel.SAFE)
    risk_score = Column(Integer, default=0)
    evacuated = Column(Integer, default=0)
    boats_at_sea = Column(Integer, default=0)
    shelters_total = Column(Integer, default=0)
    shelters_active = Column(Integer, default=0)
    shelter_capacity = Column(Integer, default=0)
    shelter_occupancy = Column(Integer, default=0)
    hospitals_count = Column(Integer, default=0)
    rescue_teams = Column(Integer, default=0)
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class Cyclone(Base):
    __tablename__ = "cyclones"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    category = Column(Integer)
    wind_speed = Column(Float)          # km/h
    pressure = Column(Float)            # hPa
    lat = Column(Float)
    lng = Column(Float)
    trajectory = Column(JSON)           # List of {lat, lng}
    predicted_landfall = Column(String(100))
    landfall_time = Column(DateTime(timezone=True))
    intensity = Column(String(100))
    storm_surge = Column(Float)         # meters
    rainfall_estimate = Column(Float)   # mm
    confidence = Column(Integer)        # 0-100
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    ai_reports = relationship("AIReport", back_populates="cyclone")


class WeatherObservation(Base):
    __tablename__ = "weather_observations"
    id = Column(String, primary_key=True, default=gen_uuid)
    district_id = Column(String, ForeignKey("districts.id"))
    temperature = Column(Float)
    humidity = Column(Float)
    wind_speed = Column(Float)
    wind_direction = Column(String(10))
    rainfall = Column(Float)
    pressure = Column(Float)
    sea_state = Column(String(50))
    wave_height = Column(Float)
    visibility = Column(Float)
    timestamp = Column(DateTime(timezone=True), server_default=func.now())
    district = relationship("District")


class Fisherman(Base):
    __tablename__ = "fishermen"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(100), nullable=False)
    phone = Column(String(20))
    boat_id = Column(String(30), unique=True)
    district_id = Column(String, ForeignKey("districts.id"))
    lat = Column(Float)
    lng = Column(Float)
    status = Column(SAEnum(BoatStatus), default=BoatStatus.IN_HARBOR)
    crew_count = Column(Integer, default=1)
    nearest_harbor = Column(String(100))
    distance_to_harbor = Column(Float)
    estimated_return = Column(String(50))
    last_ping = Column(DateTime(timezone=True))
    risk_score = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    district = relationship("District")


class Shelter(Base):
    __tablename__ = "shelters"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200), nullable=False)
    district_id = Column(String, ForeignKey("districts.id"))
    lat = Column(Float)
    lng = Column(Float)
    capacity = Column(Integer, default=0)
    occupied = Column(Integer, default=0)
    status = Column(SAEnum(ShelterStatus), default=ShelterStatus.AVAILABLE)
    facilities = Column(JSON)           # List of strings
    contact_phone = Column(String(20))
    in_charge = Column(String(100))
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    district = relationship("District")


class Alert(Base):
    __tablename__ = "alerts"
    id = Column(String, primary_key=True, default=gen_uuid)
    alert_type = Column(String(50))
    level = Column(SAEnum(RiskLevel))
    title = Column(String(300), nullable=False)
    message = Column(Text, nullable=False)
    district_id = Column(String, ForeignKey("districts.id"))
    affected_population = Column(Integer, default=0)
    issued_at = Column(DateTime(timezone=True), server_default=func.now())
    expires_at = Column(DateTime(timezone=True))
    is_active = Column(Boolean, default=True)
    source = Column(String(100))
    district = relationship("District")


class RescueTeam(Base):
    __tablename__ = "rescue_teams"
    id = Column(String, primary_key=True, default=gen_uuid)
    name = Column(String(200), nullable=False)
    district_id = Column(String, ForeignKey("districts.id"))
    members = Column(Integer)
    vehicles = Column(Integer)
    status = Column(String(30))
    lat = Column(Float)
    lng = Column(Float)
    specialization = Column(JSON)
    last_deployed = Column(DateTime(timezone=True))
    district = relationship("District")


class ReliefInventory(Base):
    __tablename__ = "relief_inventory"
    id = Column(String, primary_key=True, default=gen_uuid)
    category = Column(String(50))
    item = Column(String(200))
    available = Column(Integer, default=0)
    required = Column(Integer, default=0)
    unit = Column(String(30))
    location = Column(String(200))
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())


class DamageReport(Base):
    __tablename__ = "damage_reports"
    id = Column(String, primary_key=True, default=gen_uuid)
    district_id = Column(String, ForeignKey("districts.id"))
    report_date = Column(DateTime(timezone=True), server_default=func.now())
    houses_destroyed = Column(Integer, default=0)
    houses_damaged = Column(Integer, default=0)
    lives_lost = Column(Integer, default=0)
    injured = Column(Integer, default=0)
    livestock_loss = Column(Integer, default=0)
    crop_area_affected = Column(Float, default=0)
    infrastructure_damage = Column(Float, default=0)   # INR crores
    total_estimated_loss = Column(Float, default=0)
    status = Column(String(30), default="PRELIMINARY")
    verified_by = Column(String(100))
    ai_analysis = Column(Text)
    district = relationship("District")


class SatelliteImage(Base):
    __tablename__ = "satellite_images"
    id = Column(String, primary_key=True, default=gen_uuid)
    area = Column(String(200))
    capture_date = Column(DateTime(timezone=True))
    image_url = Column(String(500))
    analysis_status = Column(String(30), default="PENDING")
    damage_level = Column(String(30))
    ai_analysis = Column(Text)
    confidence = Column(Integer)
    structures_analyzed = Column(Integer, default=0)
    structures_damaged = Column(Integer, default=0)
    created_at = Column(DateTime(timezone=True), server_default=func.now())


class AIReport(Base):
    __tablename__ = "ai_reports"
    id = Column(String, primary_key=True, default=gen_uuid)
    cyclone_id = Column(String, ForeignKey("cyclones.id"))
    report_type = Column(String(50))
    summary = Column(Text)
    details = Column(JSON)
    confidence = Column(Integer)
    model_used = Column(String(100))
    language = Column(String(5), default="en")
    generated_at = Column(DateTime(timezone=True), server_default=func.now())
    cyclone = relationship("Cyclone", back_populates="ai_reports")


class ChatMessage(Base):
    __tablename__ = "chat_messages"
    id = Column(String, primary_key=True, default=gen_uuid)
    session_id = Column(String(100))
    user_id = Column(String, ForeignKey("users.id"), nullable=True)
    role = Column(String(20))           # user | agent | system
    content = Column(Text, nullable=False)
    language = Column(String(5), default="en")
    agent_type = Column(String(50))
    confidence = Column(Integer)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
