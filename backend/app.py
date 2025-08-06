from flask import Flask
from flask_restful import Api
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from config import Config
from db import db
from models import User
from resources.user import Signup, Login

app = Flask(__name__)
app.config.from_object(Config)
db.init_app(app)
api = Api(app)
jwt = JWTManager(app)
CORS(app)

api.add_resource(Signup, "/api/signup")
api.add_resource(Login, "/api/login")

if __name__ == "__main__":
    with app.app_context():
        db.create_all()
    app.run(debug=True)
