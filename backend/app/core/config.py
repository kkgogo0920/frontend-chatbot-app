import os
from datetime import timedelta, datetime
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Settings:
    # App settings
    APP_NAME = "Chef Workplace API"
    DEBUG = True
    HOST = "0.0.0.0"
    PORT = 5000
    
    # JWT settings
    JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # OpenAI settings
    OPENAI_API_KEY = os.getenv('OPENAI_API_KEY')
    
    # MongoDB settings
    MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
    MONGO_DB_NAME = 'restaurant_db'
    
    # File upload settings
    UPLOAD_FOLDER = 'uploads'
    MAX_CONTENT_LENGTH = 10 * 1024 * 1024  # 10MB
    ALLOWED_EXTENSIONS = {'txt', 'pdf'}
    
    # I18n settings
    I18N_PATH = 'config/i18n'
    I18N_FILENAME_FORMAT = '{locale}.{format}'
    I18N_FALLBACK = 'en'
    
    # Test account settings
    TEST_ACCOUNTS = {
        'kevinke0920': {
            '_id': 'test_admin_id',
            'username': 'kevinke0920',
            'password': 'Fuzhou12345',
            'email': 'kevinke0920@system.com',
            'phone': None,
            'user_type': 'admin',
            'created_at': datetime.utcnow()
        }
    }

    @classmethod
    def check_required_env_vars(cls):
        required_vars = {
            'OPENAI_API_KEY': '请设置 OPENAI_API_KEY 环境变量',
            'JWT_SECRET_KEY': '请设置 JWT_SECRET_KEY 环境变量',
            'MONGO_URI': '请设置 MONGO_URI 环境变量'
        }
        
        missing_vars = []
        for var, message in required_vars.items():
            if not getattr(cls, var):
                missing_vars.append(message)
        
        if missing_vars:
            raise EnvironmentError("\n".join(missing_vars))

settings = Settings() 