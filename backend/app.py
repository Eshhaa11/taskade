from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS

from config import Config
from models import db

# Resources
from resources.user import Signup, Login
from resources.task import TaskList, TaskDetail
from resources.habit import HabitList, HabitDetail, HabitCheckinResource
from resources.progress import Progress
from resources.ai import ai_bp 

# AI blueprint
from resources.ai import ai_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Extensions
    db.init_app(app)
    jwt = JWTManager(app)
    CORS(app)

    api = Api(app)

    # API routes
    api.add_resource(Signup, "/api/signup")
    api.add_resource(Login, "/api/login")
    api.add_resource(TaskList, "/api/tasks")
    api.add_resource(TaskDetail, "/api/tasks/<int:task_id>")
    api.add_resource(HabitList, "/api/habits")
    api.add_resource(HabitDetail, "/api/habits/<int:habit_id>")
    api.add_resource(HabitCheckinResource, "/api/habits/<int:habit_id>/checkin")
    api.add_resource(Progress, "/api/progress")

    # AI routes under /api/ai/...
    app.register_blueprint(ai_bp, url_prefix="/api/ai")

    with app.app_context():
        db.create_all()

    return app

if __name__ == "__main__":
    app = create_app()
    app.run(debug=True)
