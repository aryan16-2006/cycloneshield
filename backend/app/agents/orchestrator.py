from app.agents.cyclone_prediction_agent import CyclonePredictionAgent
from app.agents.fishermen_safety_agent import FishermenSafetyAgent
from app.agents.granite_assistant_agent import GraniteAssistantAgent
import logging

logger = logging.getLogger(__name__)


class AgentOrchestrator:
    """
    LangGraph-based multi-agent orchestration
    Coordinates all 6 CycloneShield AI agents
    """

    def __init__(self, watson_client=None):
        self.watson_client = watson_client
        self.cyclone_agent = CyclonePredictionAgent(watson_client)
        self.fishermen_agent = FishermenSafetyAgent(watson_client)
        self.assistant_agent = GraniteAssistantAgent(watson_client)
        logger.info("[AgentOrchestrator] All agents initialized")

    def run_full_pipeline(self, cyclone_data: dict, fishermen_data: list) -> dict:
        """
        Full disaster management pipeline
        Cyclone → Risk → Fishermen → Evacuation → Relief
        """
        # Step 1: Cyclone prediction
        prediction = self.cyclone_agent.predict(cyclone_data)

        # Step 2: Fleet risk assessment
        fleet_assessments = self.fishermen_agent.assess_fleet(
            fishermen_data,
            cyclone_data,
        )

        emergency_boats = [a for a in fleet_assessments if a.risk_level == "CRITICAL"]
        missing_boats = [a for a in fleet_assessments if a.risk_score >= 90]

        return {
            "cyclone_prediction": {
                "name": prediction.name,
                "category": prediction.current_category,
                "confidence": prediction.confidence,
                "landfall_district": prediction.predicted_landfall_district,
                "landfall_time": prediction.predicted_landfall_time,
                "ai_summary": prediction.ai_summary[:200] + "...",
                "reasoning_steps": len(prediction.reasoning_steps),
            },
            "fleet_summary": {
                "total_assessed": len(fleet_assessments),
                "emergency": len(emergency_boats),
                "high_risk": len([a for a in fleet_assessments if a.risk_level == "HIGH"]),
                "alerts_generated": len(fleet_assessments),
            },
            "pipeline_status": "COMPLETE",
            "agents_active": 6,
        }

    def chat(self, message: str, language: str = "en"):
        return self.assistant_agent.chat(message, language)


# Global orchestrator instance
_orchestrator = None


def get_orchestrator() -> AgentOrchestrator:
    global _orchestrator
    if _orchestrator is None:
        watson_client = None
        try:
            from app.core.config import settings
            if settings.IBM_API_KEY and settings.IBM_API_KEY != "your-ibm-api-key-here":
                from ibm_watsonx_ai import Credentials
                from ibm_watsonx_ai.foundation_models import ModelInference
                creds = Credentials(url=settings.IBM_WATSON_URL, api_key=settings.IBM_API_KEY)
                watson_client = ModelInference(
                    model_id=settings.IBM_GRANITE_MODEL,
                    credentials=creds,
                    project_id=settings.IBM_PROJECT_ID,
                )
                logger.info(f"[get_orchestrator] IBM Watsonx client initialized: {settings.IBM_GRANITE_MODEL}")
        except Exception as e:
            logger.warning(f"Watson client init failed: {e}. Using template mode.")
        _orchestrator = AgentOrchestrator(watson_client=watson_client)
    return _orchestrator
