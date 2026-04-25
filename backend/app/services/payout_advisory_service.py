"""
Gemini-powered payout advisory service.
Provides explainable guidance while final payout remains rule-governed.
"""

from __future__ import annotations

import asyncio
import json
import logging
from typing import Any, Dict

import google.generativeai as genai

from app.core.config import settings

logger = logging.getLogger(__name__)


class PayoutAdvisoryService:
    """Generate non-binding payout advice using Gemini."""

    def __init__(self) -> None:
        self._enabled = bool(settings.GEMINI_API_KEY)
        self._model = None

        if not self._enabled:
            logger.info("Gemini advisory disabled: GEMINI_API_KEY not set")
            return

        try:
            genai.configure(api_key=settings.GEMINI_API_KEY)
            self._model = genai.GenerativeModel("gemini-1.5-flash")
        except Exception as exc:
            logger.error("Failed to initialize Gemini payout advisory model: %s", exc)
            self._enabled = False
            self._model = None

    async def get_payout_advisory(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Return advisory as:
        {
          recommendation: approve|reject|manual_review,
          confidence: float 0..1,
          rationale: str,
          key_risks: [str]
        }
        """
        if not self._enabled or self._model is None:
            return {
                "recommendation": "manual_review",
                "confidence": 0.0,
                "rationale": "Gemini advisory unavailable; using deterministic payout rules.",
                "key_risks": ["llm_unavailable"],
            }

        prompt = self._build_prompt(context)
        try:
            raw = await asyncio.to_thread(self._model.generate_content, prompt)
            parsed = self._parse_json(raw.text if hasattr(raw, "text") else "")
            return {
                "recommendation": str(parsed.get("recommendation", "manual_review")).lower(),
                "confidence": float(parsed.get("confidence", 0.0) or 0.0),
                "rationale": str(parsed.get("rationale", "No rationale provided")).strip(),
                "key_risks": [str(r).strip() for r in (parsed.get("key_risks") or []) if str(r).strip()],
            }
        except Exception as exc:
            logger.warning("Gemini payout advisory failed: %s", exc)
            return {
                "recommendation": "manual_review",
                "confidence": 0.0,
                "rationale": "Gemini advisory request failed; fallback to deterministic payout rules.",
                "key_risks": ["llm_request_failed"],
            }

    def _build_prompt(self, context: Dict[str, Any]) -> str:
        return (
            "You are an insurance payout advisory assistant for parametric gig-worker claims. "
            "Output STRICT JSON only with keys: recommendation, confidence, rationale, key_risks. "
            "recommendation must be one of approve|reject|manual_review. "
            "confidence is a float from 0 to 1. key_risks is an array of short strings. "
            "Do NOT include markdown. Do NOT include extra keys.\n\n"
            f"Claim context:\n{json.dumps(context, ensure_ascii=True)}"
        )

    def _parse_json(self, text: str) -> Dict[str, Any]:
        cleaned = (text or "").strip()
        if cleaned.startswith("```"):
            parts = cleaned.split("```")
            if len(parts) >= 2:
                cleaned = parts[1]
            if cleaned.startswith("json"):
                cleaned = cleaned[4:]
        cleaned = cleaned.strip()
        parsed = json.loads(cleaned)
        if not isinstance(parsed, dict):
            raise ValueError("Gemini advisory response is not a JSON object")
        return parsed


payout_advisory_service = PayoutAdvisoryService()
