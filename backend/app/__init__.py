from flask import Flask
from flask_cors import CORS
from pymongo import MongoClient
from .config.config import Config
import os
from dotenv import load_dotenv

# 加载环境变量
load_dotenv()

def create_app(config_class=Config):
    app = Flask(__name__)
    
    # 简化的CORS配置，允许所有本地开发请求
    CORS(app, supports_credentials=True)
    
    # 加载配置
    app.config.from_object(config_class)
    app.config['JSON_AS_ASCII'] = False
    
    # 确保JWT密钥已设置
    if not app.config.get('JWT_SECRET_KEY'):
        app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'jwt_restaurant_app_secret_key_2024')
    
    # 初始化MongoDB
    client = MongoClient(app.config['MONGO_URI'])
    app.db = client[app.config['DB_NAME']]
    
    # 注册蓝图
    from .routes.auth import auth_bp
    from .routes.user import user_bp
    from .routes.admin import admin_bp
    from .routes.document import document_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api')
    app.register_blueprint(user_bp, url_prefix='/api')
    app.register_blueprint(admin_bp, url_prefix='/api')
    app.register_blueprint(document_bp, url_prefix='/api')
    
    return app