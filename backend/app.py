from flask import Flask, request, jsonify
from flask_cors import CORS
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
from functools import wraps
import jwt
import os
import yaml
from pymongo import MongoClient, ASCENDING
from pymongo.errors import OperationFailure
from bson import ObjectId
import re
from dotenv import load_dotenv
from openai import OpenAI
from werkzeug.utils import secure_filename
from langchain.prompts import PromptTemplate
from langchain_openai import ChatOpenAI
from langchain.chains import LLMChain
from langdetect import detect
import i18n

# Load environment variables from .env file
load_dotenv()

# Setup i18n configuration
i18n.load_path.append('config/i18n')
i18n.set('filename_format', '{locale}.{format}')
i18n.set('skip_locale_root_data', True)
i18n.set('fallback', 'en')

# Load prompts configuration
with open('config/i18n/prompts.yml', 'r', encoding='utf-8') as file:
    PROMPTS = yaml.safe_load(file)

# Check for required environment variables
REQUIRED_ENV_VARS = {
    'OPENAI_API_KEY': '请设置 OPENAI_API_KEY 环境变量',
    'JWT_SECRET_KEY': '请设置 JWT_SECRET_KEY 环境变量',
    'MONGO_URI': '请设置 MONGO_URI 环境变量'
}

missing_vars = []
for var, message in REQUIRED_ENV_VARS.items():
    if not os.getenv(var):
        missing_vars.append(message)

if missing_vars:
    print("错误: 缺少必要的环境变量:")
    for msg in missing_vars:
        print(f"- {msg}")
    print("\n请创建 .env 文件并设置必要的环境变量")
    exit(1)

app = Flask(__name__)
CORS(app, supports_credentials=True)  # 添加CORS支持

# JWT配置
app.config['JWT_SECRET_KEY'] = os.getenv('JWT_SECRET_KEY', 'your-secret-key')
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(hours=1)

# OpenAI配置
openai_client = OpenAI(
    api_key=os.getenv('OPENAI_API_KEY')
)

# MongoDB配置
MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/')
mongo_client = MongoClient(MONGO_URI)
db = mongo_client['restaurant_db']
users_collection = db['users']

# 文件上传配置
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'txt', 'pdf'}
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 10 * 1024 * 1024  # 10MB limit

# 测试账号配置
TEST_ACCOUNTS = {
    'kevinke0920': {
        'username': 'kevinke0920',
        'password': 'Fuzhou12345',
        'email': 'kevinke0920@system.com',
        'user_type': 'admin'
    }
}

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

def setup_indexes():
    """设置数据库索引"""
    try:
        # 删除现有的索引
        users_collection.drop_indexes()
        
        # 创建新的索引
        users_collection.create_index([('email', ASCENDING)], 
                                   unique=True, 
                                   sparse=True, 
                                   name='unique_email_index')
        users_collection.create_index([('phone', ASCENDING)], 
                                   unique=True, 
                                   sparse=True, 
                                   name='unique_phone_index')
        print("数据库索引设置成功")
    except Exception as e:
        print(f"设置索引时出错: {str(e)}")
        raise

def validate_phone(phone):
    """验证美国电话号码格式"""
    phone_pattern = re.compile(r'^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')
    return bool(phone_pattern.match(phone))

def validate_email(email):
    """验证邮箱格式"""
    email_pattern = re.compile(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')
    return bool(email_pattern.match(email))

# JWT验证装饰器
def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print("\n=== Token Validation Start ===")
        
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            print("Token received:", token)
        else:
            print("No Authorization header found")
            return jsonify({'error': '缺少认证令牌'}), 401
        
        try:
            print("Attempting to decode token...")
            data = jwt.decode(token, app.config['JWT_SECRET_KEY'], algorithms=["HS256"])
            print("Decoded token data:", data)
            
            # 首先检查是否是测试账号
            if data.get('username') in TEST_ACCOUNTS:
                print("Found test account:", data['username'])
                current_user = TEST_ACCOUNTS[data['username']]
            else:
                print("Not a test account, checking database...")
                # 尝试通过 _id 查找
                if 'user_id' in data:
                    print("Looking up by user_id:", data['user_id'])
                    current_user = users_collection.find_one({'_id': ObjectId(data['user_id'])})
                # 如果 _id 不存在，尝试通过 username 查找
                elif 'username' in data:
                    print("Looking up by username:", data['username'])
                    current_user = users_collection.find_one({'username': data['username']})
                else:
                    print("No user_id or username in token")
                    return jsonify({'error': '无效的用户令牌'}), 401
                    
            if not current_user:
                print("No user found in database")
                return jsonify({'error': '无效的用户令牌'}), 401
                
            print("User found:", current_user)
        except jwt.ExpiredSignatureError:
            print("Token expired")
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError as e:
            print("Invalid token:", str(e))
            return jsonify({'error': '无效的令牌'}), 401
        except Exception as e:
            print("Unexpected error:", str(e))
            return jsonify({'error': '令牌验证失败'}), 401
        
        print("=== Token Validation End ===\n")
        return f(current_user, *args, **kwargs)
    
    return decorated

def generate_token(user):
    """生成JWT令牌"""
    # 对于测试账号，使用 username 作为 user_id
    user_id = str(user.get('_id')) if user.get('_id') else user.get('username')
    if not user_id:
        raise ValueError("无法生成令牌：用户缺少必要的标识信息")
        
    token = jwt.encode({
        'user_id': user_id,
        'email': user.get('email'),
        'phone': user.get('phone'),
        'user_type': user['user_type'],
        'exp': datetime.utcnow() + app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, app.config['JWT_SECRET_KEY'], algorithm="HS256")
    return token

@app.route('/api/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # 验证必填字段
    if not data.get('password'):
        return jsonify({'error': '密码是必填项'}), 400
    
    if not data.get('user_type') in ['customer', 'supplier']:
        return jsonify({'error': '无效的用户类型'}), 400

    # 验证至少有邮箱或手机号之一
    email = data.get('email')
    phone = data.get('phone')
    
    if not email and not phone:
        return jsonify({'error': '邮箱或手机号至少需要提供一个'}), 400
    
    # 验证邮箱格式（如果提供）
    if email and not validate_email(email):
        return jsonify({'error': '邮箱格式无效'}), 400
        
    # 验证手机号格式（如果提供）
    if phone and not validate_phone(phone):
        return jsonify({'error': '手机号格式无效'}), 400
    
    # 检查邮箱或手机号是否已存在
    if email and users_collection.find_one({'email': email}):
        return jsonify({'error': '该邮箱已被注册'}), 400
    if phone and users_collection.find_one({'phone': phone}):
        return jsonify({'error': '该手机号已被注册'}), 400
    
    # 创建新用户文档
    new_user = {
        'email': email,
        'phone': phone,
        'password_hash': generate_password_hash(data['password']),
        'user_type': data['user_type'],
        'created_at': datetime.utcnow()
    }
    
    # 根据用户类型添加额外字段
    if data['user_type'] == 'supplier':
        if not all(field in data for field in ['company_name', 'business_license']):
            return jsonify({'error': '缺少供应商必填信息'}), 400
        new_user.update({
            'company_name': data['company_name'],
            'business_license': data['business_license'],
            'supply_categories': data.get('supply_categories', [])
        })
    
    elif data['user_type'] == 'customer':
        if not all(field in data for field in ['restaurant_name', 'restaurant_address']):
            return jsonify({'error': '缺少餐厅必填信息'}), 400
        new_user.update({
            'restaurant_name': data['restaurant_name'],
            'restaurant_address': data['restaurant_address']
        })
    
    try:
        result = users_collection.insert_one(new_user)
        new_user['_id'] = result.inserted_id
        
        # 生成JWT令牌
        token = generate_token(new_user)
        
        return jsonify({
            'message': '注册成功',
            'token': token,
            'user_type': new_user['user_type'],
            'email': new_user.get('email'),
            'phone': new_user.get('phone')
        }), 201
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/login', methods=['POST'])
def login():
    print("\n=== Login Start ===")
    data = request.get_json()
    print("Login request data:", data)
    
    username = data.get('username')
    password = data.get('password')
    
    if not password:
        print("No password provided")
        return jsonify({'error': '请提供密码'}), 400
        
    # 检查是否是测试账号
    if username in TEST_ACCOUNTS:
        print("Found test account:", username)
        test_account = TEST_ACCOUNTS[username]
        if password == test_account['password']:
            print("Test account password verified")
            # 为测试账号生成一个虚拟的 _id
            test_account['_id'] = 'test_account_' + username
            token = generate_token(test_account)
            print("Generated token for test account")
            
            return jsonify({
                'message': '登录成功',
                'token': token,
                'user_type': test_account['user_type'],
                'username': username,
                'user_id': test_account['_id']
            }), 200
        else:
            print("Test account password incorrect")
            return jsonify({'error': '密码错误'}), 401
    
    # 如果不是测试账号，查找数据库
    if not username:
        print("No username provided")
        return jsonify({'error': '请提供用户名'}), 400
        
    print("Looking up user in database:", username)
    user = users_collection.find_one({'username': username})
    
    if user and check_password_hash(user['password_hash'], password):
        print("User found and password verified")
        token = generate_token(user)
        print("Generated token for database user")
        
        return jsonify({
            'message': '登录成功',
            'token': token,
            'user_type': user['user_type'],
            'username': user['username'],
            'user_id': str(user['_id'])
        }), 200
    
    print("Login failed - invalid credentials")
    return jsonify({'error': '用户名或密码错误'}), 401

@app.route('/api/user/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """获取用户信息的示例保护路由"""
    user_data = {
        'email': current_user['email'],
        'phone': current_user['phone'],
        'user_type': current_user['user_type'],
        'created_at': current_user['created_at'].isoformat()
    }
    
    if current_user['user_type'] == 'supplier':
        user_data.update({
            'company_name': current_user['company_name'],
            'business_license': current_user['business_license'],
            'supply_categories': current_user['supply_categories']
        })
    else:
        user_data.update({
            'restaurant_name': current_user['restaurant_name'],
            'restaurant_address': current_user['restaurant_address'],
            'restaurant_license': current_user['restaurant_license']
        })
    
    return jsonify(user_data)

@app.route('/api/refresh-token', methods=['POST'])
@token_required
def refresh_token(current_user):
    """刷新JWT令牌"""
    new_token = generate_token(current_user)
    return jsonify({'token': new_token})

def detect_language(text):
    """
    检测文本语言并返回对应的语言代码
    支持的语言：英语(en)、中文(zh)、日语(ja)、韩语(ko)
    """
    try:
        lang = detect(text)
        if lang == 'zh-cn' or lang == 'zh-tw':
            return 'zh'
        elif lang in ['en', 'ja', 'ko']:
            return lang
        return 'en'  # 默认使用英语
    except:
        return 'en'  # 检测失败时默认使用英语

def get_prompt_by_language(text):
    """
    根据文本语言获取对应的提示模板
    """
    lang = detect_language(text)
    prompts = PROMPTS.get(lang, PROMPTS['en'])
    
    system_prompt = prompts['system_prompt']['base']
    user_prompt = prompts['system_prompt']['user_prompt']
    
    return system_prompt, user_prompt

def get_ai_response(text, length):
    """使用 LangChain 处理 AI 响应"""
    # 检测语言并获取对应的提示
    lang = detect_language(text)
    system_prompt, user_prompt_template = get_prompt_by_language(text)
    
    # 强制使用英语回复
    force_english = "Please analyze the following text and provide a response in English, regardless of the input language. Break down the key points and provide a comprehensive summary in English."
    
    # 将语言指令添加到系统提示中
    system_prompt = system_prompt + "\n" + force_english
    
    llm = ChatOpenAI(
        api_key=os.getenv('OPENAI_API_KEY'),
        model="gpt-3.5-turbo",
        temperature=0.7,
        max_tokens={
            'short': 150,
            'medium': 300,
            'long': 600
        }[length]
    )
    
    # 创建提示模板
    prompt = PromptTemplate(
        template=user_prompt_template,
        input_variables=["text"]
    )
    
    # 创建链
    chain = LLMChain(
        llm=llm,
        prompt=prompt
    )
    
    # 获取响应
    response = chain.run(text=text)
    return response.strip()

@app.route('/api/ai/summarize', methods=['POST'])
@token_required
def summarize_document(current_user):
    """AI 回答接口
    处理用户输入的文本，使用 OpenAI API 生成回答
    """
    try:
        # 1. 验证请求格式
        if not request.is_json:
            return jsonify({'error': '请求必须是 JSON 格式'}), 400

        # 2. 获取并验证输入参数
        data = request.json
        text = data.get('text', '').strip()
        length = data.get('length', 'medium')

        if not text:
            return jsonify({'error': '文本内容不能为空'}), 400

        if length not in ['short', 'medium', 'long']:
            return jsonify({'error': '无效的长度参数，必须是 short、medium 或 long'}), 400

        # 3. 处理文本
        if len(text) > 2000:
            text = text[:2000] + "..."

        try:
            # 4. 获取 AI 响应
            summary = get_ai_response(text, length)
            
            if not summary:
                raise Exception("生成的回答为空")

            # 5. 返回结果
            return jsonify({
                'summary': summary,
                'length': length,
                'language': detect_language(text)
            })

        except Exception as e:
            print(f"AI Service error: {str(e)}")
            return jsonify({'error': f'AI服务暂时不可用，请稍后再试。错误详情：{str(e)}'}), 503

    except Exception as e:
        print(f"General error: {str(e)}")
        return jsonify({'error': str(e)}), 500

@app.route('/api/ai/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    try:
        # 测试OpenAI API连接
        completion = openai_client.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": "test"}],
            max_tokens=5
        )
        return jsonify({'status': 'healthy', 'message': 'OpenAI API连接正常'})
    except Exception as e:
        return jsonify({'status': 'unhealthy', 'error': str(e)}), 500

if __name__ == '__main__':
    # 设置数据库索引
    setup_indexes()
    app.run(debug=True, host='0.0.0.0', port=5000) 