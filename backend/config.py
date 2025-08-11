import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:3031@localhost/taskadee")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'Dfl3!s#e9rC^j2KP)w^N+z3L0wqvXbR@u$Gm4rXt6qLv' 
    JWT_SECRET_KEY = 'pzQ6xK$L#B@uE2!cN*wYvX1Hr7pTgZq8U%R&v0fM#bKs'
