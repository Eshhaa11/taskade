from flask import request
from flask_restful import Resource
from models import User
from db import db
from flask_jwt_extended import create_access_token
from datetime import timedelta

class Signup(Resource):
    def post(self):
        data = request.get_json()
        if User.query.filter_by(username=data["username"]).first():
            return {"message": "User already exists"}, 400
        user = User(username=data["username"])
        user.set_password(data["password"])
        db.session.add(user)
        db.session.commit()
        return {"message": "User created successfully"}, 201

class Login(Resource):
    def post(self):
        data = request.get_json()
        user = User.query.filter_by(username=data["username"]).first()
        if user and user.check_password(data["password"]):
            access_token = create_access_token(identity=user.id, expires_delta=timedelta(days=1))
            return {"access_token": access_token}, 200
        return {"message": "Invalid credentials"}, 401
