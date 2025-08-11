from flask import request
from flask_restful import Resource
from models import db, User
from flask_jwt_extended import create_access_token
from datetime import timedelta

class Signup(Resource):
    def post(self):
        data = request.get_json()
        if not data:
            return {"message": "Missing JSON body"}, 400

        required_fields = ["full_name", "email", "phone", "password"]
        for field in required_fields:
            if field not in data or not data[field]:
                return {"message": f"Missing or empty field: {field}"}, 400

        if User.query.filter_by(email=data["email"]).first():
            return {"message": "Email already registered"}, 400

        user = User(
            full_name=data["full_name"],
            email=data["email"],
            phone=data["phone"]
        )
        user.set_password(data["password"])

        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}, 201


class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(email=data["email"]).first()

        if not user or not user.check_password(data["password"]):
            return {"message": "Invalid email or password"}, 401
        
        token = create_access_token(identity=str(user.id), expires_delta=timedelta(hours=1))
        return {"access_token": token}, 200
