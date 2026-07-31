# =============================================================
# CycloneShield AI — Fishermen Safety Agent
# IBM Granite 8B + Risk Scoring + GPS Tracking
# =============================================================

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import math
import logging
from datetime import datetime

logger = logging.getLogger(__name__)


@dataclass
class FishermanRiskAssessment:
    boat_id: str
    fisherman_name: str
    risk_score: float
    risk_level: str
    nearest_harbor: str
    distance_to_harbor: float
    recommended_action: str
    alert_message: str
    estimated_safe_return: str
    route_waypoints: List[Dict[str, float]]
    weather_at_location: Dict[str, Any]
    ai_reasoning: str


HARBORS = {
    "Nawabander": (21.95, 69.88),
    "Bedi Port": (22.47, 70.05),
    "Okha": (22.47, 69.07),
    "Mandvi": (22.83, 69.35),
    "Porbandar": (21.64, 69.61),
    "Veraval": (20.91, 70.37),
    "Jafrabad": (20.86, 71.37),
    "Bhavnagar": (21.75, 72.17),
}

RISK_THRESHOLDS = {
    "CRITICAL": 80,
    "HIGH": 60,
    "MEDIUM": 40,
    "LOW": 0,
}


class FishermenSafetyAgent:
    """
    AI Agent: Fishermen Safety
    Monitors GPS, assesses risk, sends alerts, recommends harbors
    """

    AGENT_NAME = "Fishermen Safety Agent"
    MODEL = "IBM Granite 8B"

    def __init__(self, watson_client=None):
        self.watson_client = watson_client

    def _haversine_distance(self, lat1: float, lon1: float, lat2: float, lon2: float) -> float:
        """Calculate distance in km between two coordinates"""
        R = 6371
        dlat = math.radians(lat2 - lat1)
        dlon = math.radians(lon2 - lon1)
        a = math.sin(dlat / 2) ** 2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2) ** 2
        c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
        return R * c

    def _find_nearest_harbor(self, lat: float, lng: float) -> tuple:
        """Find nearest safe harbor"""
        min_dist = float("inf")
        nearest = "Veraval"
        for harbor, (hlat, hlng) in HARBORS.items():
            d = self._haversine_distance(lat, lng, hlat, hlng)
            if d < min_dist:
                min_dist = d
                nearest = harbor
        return nearest, round(min_dist, 1)

    def _compute_risk_score(
        self,
        boat_lat: float,
        boat_lng: float,
        cyclone_lat: float,
        cyclone_lng: float,
        cyclone_wind: float,
        boat_status: str,
        last_ping_minutes: int = 5,
    ) -> float:
        """Multi-factor risk scoring for individual boat"""
        # Distance from cyclone (closer = higher risk)
        distance = self._haversine_distance(boat_lat, boat_lng, cyclone_lat, cyclone_lng)
        distance_score = max(0, 100 - (distance / 8))  # Full risk within 800km

        # Wind speed factor
        wind_score = min(100, (cyclone_wind / 200) * 100)

        # Boat status factor
        status_weights = {
            "AT_SEA": 1.0, "RETURNING": 0.8, "IN_HARBOR": 0.0,
            "EMERGENCY": 1.5, "MISSING": 1.8,
        }
        status_mult = status_weights.get(boat_status, 1.0)

        # Last ping penalty
        ping_penalty = min(30, last_ping_minutes / 2) if last_ping_minutes > 15 else 0

        raw_score = (distance_score * 0.5 + wind_score * 0.3) * status_mult + ping_penalty
        return min(99, round(raw_score, 1))

    def _generate_alert_message(self, fisherman: Dict, risk_score: float, nearest_harbor: str) -> str:
        """Generate SMS-style alert message"""
        if risk_score >= 80:
            return (
                f"🚨 URGENT: {fisherman['name']}, CYCLONE DANGER! "
                f"Return to {nearest_harbor} IMMEDIATELY. "
                f"Risk: {risk_score:.0f}%. Contact Coast Guard: 1554"
            )
        elif risk_score >= 60:
            return (
                f"⚠️ WARNING: {fisherman['name']}, cyclone approaching. "
                f"Return to {nearest_harbor} within 6 hours. "
                f"Risk: {risk_score:.0f}%"
            )
        return f"📢 ADVISORY: {fisherman['name']}, monitor weather. Risk: {risk_score:.0f}%"

    def assess_fleet(
        self,
        fishermen: List[Dict],
        cyclone_data: Dict,
        weather_data: Dict = None,
    ) -> List[FishermanRiskAssessment]:
        """Assess risk for entire fleet and generate alerts"""
        assessments = []

        for boat in fishermen:
            if boat.get("status") == "IN_HARBOR":
                continue

            nearest_harbor, distance = self._find_nearest_harbor(
                boat.get("lat", 21.5),
                boat.get("lng", 69.5),
            )

            risk_score = self._compute_risk_score(
                boat.get("lat", 21.5),
                boat.get("lng", 69.5),
                cyclone_data.get("lat", 19.2),
                cyclone_data.get("lng", 67.8),
                cyclone_data.get("wind_speed", 185),
                boat.get("status", "AT_SEA"),
                boat.get("last_ping_minutes", 5),
            )

            # Determine risk level
            if risk_score >= RISK_THRESHOLDS["CRITICAL"]:
                risk_level = "CRITICAL"
                action = "IMMEDIATE RETURN — Emergency protocols activated"
            elif risk_score >= RISK_THRESHOLDS["HIGH"]:
                risk_level = "HIGH"
                action = f"Return to {nearest_harbor} within 3 hours"
            elif risk_score >= RISK_THRESHOLDS["MEDIUM"]:
                risk_level = "MEDIUM"
                action = f"Monitor weather, prepare to return"
            else:
                risk_level = "LOW"
                action = "Continue with caution, monitor updates"

            # Estimate return time
            speed_kmh = 12  # average fishing vessel speed
            hours = distance / speed_kmh
            return_time = f"{hours:.1f} hours"

            assessment = FishermanRiskAssessment(
                boat_id=boat.get("boat_id", boat.get("boatId", "UNKNOWN")),
                fisherman_name=boat.get("name", "Unknown"),
                risk_score=risk_score,
                risk_level=risk_level,
                nearest_harbor=nearest_harbor,
                distance_to_harbor=distance,
                recommended_action=action,
                alert_message=self._generate_alert_message(boat, risk_score, nearest_harbor),
                estimated_safe_return=return_time,
                route_waypoints=[
                    {"lat": boat.get("lat"), "lng": boat.get("lng")},
                    {"lat": HARBORS[nearest_harbor][0], "lng": HARBORS[nearest_harbor][1]},
                ],
                weather_at_location=weather_data or {},
                ai_reasoning=f"IBM Granite: Distance to cyclone eye = {self._haversine_distance(boat.get('lat', 21.5), boat.get('lng', 69.5), cyclone_data.get('lat', 19.2), cyclone_data.get('lng', 67.8)):.0f}km. Wind speed factor = {cyclone_data.get('wind_speed', 185):.0f} km/h. Status multiplier = {boat.get('status', 'AT_SEA')}.",
            )
            assessments.append(assessment)

        assessments.sort(key=lambda x: x.risk_score, reverse=True)
        logger.info(f"[{self.AGENT_NAME}] Assessed {len(assessments)} boats")
        return assessments
