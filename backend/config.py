import os

class Config:
    SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql://postgres:3031@localhost/taskadee")
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SECRET_KEY = 'your-secret-key'
    JWT_SECRET_KEY = 'your-jwt-secret-key'
