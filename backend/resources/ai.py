# resources/ai.py
import os
import json
import re
from flask import Blueprint, request, current_app
from flask_restful import Resource, Api
from flask_jwt_extended import jwt_required, get_jwt_identity
from functools import lru_cache

ai_bp = Blueprint("ai", __name__)
api = Api(ai_bp)

@lru_cache(maxsize=128)
def _call_model_cached(prompt, max_tokens=300):
    return _call_model(prompt, max_tokens)

def _call_model(prompt, max_tokens=300):
    current_app.logger.info(f"Mock _call_model with prompt: {prompt[:60]}...")
    if "personalized daily goals" in prompt:
        return json.dumps([
            {"title": "Complete 2 tasks", "why": "Helps reduce backlog", "difficulty": "medium"},
            {"title": "Check habits progress", "why": "Stay consistent", "difficulty": "easy"},
            {"title": "Plan tomorrow's schedule", "why": "Better time management", "difficulty": "easy"}
        ])
    if "motivational message" in prompt:
        return "Keep pushing forward! Every step counts."
    return "{}"

class AISuggestGoals(Resource):
    @jwt_required()
    def post(self):
        user_id = get_jwt_identity()
        from models import Task
        recent = Task.query.filter_by(user_id=user_id).order_by(Task.created_at.desc()).limit(30).all()
        recent_summary = []
        for t in recent:
            s = f"- [{t.status}] {t.title}"
            if t.due_date:
                s += f" (due {t.due_date.date().isoformat()})"
            recent_summary.append(s)
        recent_text = "\n".join(recent_summary) if recent_summary else "No recent tasks."
        prompt = f"""
You are an assistant that creates 3 personalized daily goals for a user based on their recent tasks.
User task summary:
{recent_text}

Return a JSON array of objects with "title" and "why" and optional "difficulty".
"""
        try:
            model_output = _call_model_cached(prompt)
            m = re.search(r'(\[.*\])', model_output, re.S)
            json_text = m.group(1) if m else model_output
            suggestions = json.loads(json_text)
        except Exception as e:
            current_app.logger.exception("AI suggest error")
            return {"error": "AI service failed", "detail": str(e)}, 500

        return {"suggestions": suggestions}, 200

class AIMotivation(Resource):
    @jwt_required()
    def post(self):
        body = request.get_json() or {}
        tone = body.get("tone", "encouraging")
        prompt = f"Provide a short motivational message (1-2 sentences) in an {tone} tone."
        try:
            text = _call_model(prompt, max_tokens=80)
        except Exception as e:
            current_app.logger.exception("AI motivation error")
            return {"error": "AI service failed", "detail": str(e)}, 500
        return {"message": text.strip()}, 200

api.add_resource(AISuggestGoals, "/suggest-goals")
api.add_resource(AIMotivation, "/motivation")
