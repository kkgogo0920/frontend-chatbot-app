import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.getenv('SECRET_KEY', 'flask_restaurant_app_secret_key_2024')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_restaurant_app_secret_key_2024')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    DB_NAME = 'restaurant_db' 