from flask import Flask
from flask_cors import CORS
import i18n

from app.core.config import settings
from app.core.database import db
from app.api.routes import api

def create_app():
    """应用工厂函数"""
    # 创建Flask应用
    app = Flask(__name__)
    
    # 配置应用
    app.config['JWT_SECRET_KEY'] = settings.JWT_SECRET_KEY
    app.config['JWT_ACCESS_TOKEN_EXPIRES'] = settings.JWT_ACCESS_TOKEN_EXPIRES
    app.config['UPLOAD_FOLDER'] = settings.UPLOAD_FOLDER
    app.config['MAX_CONTENT_LENGTH'] = settings.MAX_CONTENT_LENGTH
    
    # 添加CORS支持
    CORS(app, supports_credentials=True)
    
    # 配置i18n
    i18n.load_path.append(settings.I18N_PATH)
    i18n.set('filename_format', settings.I18N_FILENAME_FORMAT)
    i18n.set('skip_locale_root_data', True)
    i18n.set('fallback', settings.I18N_FALLBACK)
    
    # 注册蓝图
    app.register_blueprint(api, url_prefix='/api')
    
    # 初始化数据库
    db.connect()
    db.setup_indexes()
    
    return app