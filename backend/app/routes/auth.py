from flask import Blueprint, request, jsonify, current_app
from werkzeug.security import check_password_hash
from datetime import datetime, timedelta
import jwt
from functools import wraps
from ..models.user import User
from ..utils.validators import validate_email, validate_phone, validate_password
from ..config.admin import SUPER_ADMIN, TEST_ACCOUNTS, is_test_account, get_test_account

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return jsonify({'error': '请提供用户名和密码'}), 400
        
        # 检查是否为测试账户或超级管理员
        if is_test_account(username):
            test_account = get_test_account(username)
            if test_account and password == test_account["password"]:
                # 生成JWT令牌
                token = create_token(test_account)
                
                # 返回用户信息和令牌
                return jsonify({
                    'token': token,
                    'user': {
                        'id': test_account['_id'],
                        'username': test_account['username'],
                        'email': test_account['email'],
                        'user_type': test_account['user_type']
                    }
                })
            else:
                return jsonify({'error': '密码错误'}), 401
        
        # 常规用户验证逻辑
        user_model = User(current_app.db)
        user = user_model.find_by_username(username)
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
            
        if not user.get('is_active', True):
            return jsonify({'error': '账号已被禁用'}), 403
            
        if not check_password_hash(user['password_hash'], password):
            return jsonify({'error': '密码错误'}), 401
            
        # 生成JWT令牌
        token = create_token(user)
        
        # 返回用户信息和令牌
        return jsonify({
            'token': token,
            'user': {
                'id': str(user['_id']),
                'username': user['username'],
                'email': user['email'],
                'user_type': user['user_type'],
                'company_name': user.get('company_name'),
                'restaurant_name': user.get('restaurant_name'),
                'supply_categories': user.get('supply_categories', []),
                'restaurant_address': user.get('restaurant_address')
            }
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

def create_token(user):
    """创建JWT令牌"""
    # 处理特殊的ID
    user_id = user['_id']
    if isinstance(user_id, str) and user_id in ['super_admin_id', 'test_customer_id', 'test_supplier_id']:
        # 特殊账户处理
        payload = {
            'user_id': user_id,
            'username': user['username'],
            'user_type': user['user_type'],
            'exp': datetime.utcnow() + timedelta(days=1)  # 令牌有效期1天
        }
    else:
        # 常规用户处理
        payload = {
            'user_id': str(user['_id']),
            'username': user['username'],
            'user_type': user.get('user_type', 'customer'),
            'exp': datetime.utcnow() + timedelta(days=1)  # 令牌有效期1天
        }
    
    # 使用密钥签名生成令牌
    token = jwt.encode(payload, current_app.config['JWT_SECRET_KEY'], algorithm='HS256')
    return token

def admin_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        token = None
        
        # 从请求头中获取令牌
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if auth_header.startswith('Bearer '):
                token = auth_header[7:]  # 移除"Bearer "前缀
        
        if not token:
            return jsonify({'error': '缺少认证令牌'}), 401
            
        try:
            # 解码令牌
            payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
            user_id = payload['user_id']
            user_type = payload.get('user_type')
            
            # 检查是否为超级管理员
            if user_id == 'super_admin_id' and user_type == 'super_admin':
                return f(*args, **kwargs)
            
            # 检查是否为测试管理员
            if user_id in ['test_customer_id', 'test_supplier_id']:
                test_account = next(
                    (acc for acc in TEST_ACCOUNTS.values() if acc['_id'] == user_id),
                    None
                )
                if test_account and test_account['user_type'] == 'admin':
                    return f(*args, **kwargs)
            
            # 验证数据库中的普通管理员用户
            user_model = User(current_app.db)
            user = user_model.find_by_id(user_id)
            
            if not user or user.get('user_type') != 'admin':
                return jsonify({'error': '需要管理员权限'}), 403
            
            return f(*args, **kwargs)
            
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'error': '无效的令牌'}), 401
            
    return decorated_function

@auth_bp.route('/auth/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        user_data = request.get_json()
        
        # 检查是否尝试注册测试账户用户名
        if is_test_account(user_data.get('username')):
            return jsonify({'error': '该用户名已被保留'}), 400
        
        required_fields = ['username', 'email', 'password', 'user_type']
        
        # 检查必填字段
        for field in required_fields:
            if not user_data.get(field):
                return jsonify({'error': f'请提供{field}'}), 400
        
        # 根据用户类型检查额外必填字段
        if user_data['user_type'] == 'supplier':
            if not user_data.get('company_name'):
                return jsonify({'error': '请提供公司名称'}), 400
            if not user_data.get('supply_categories'):
                return jsonify({'error': '请提供供应品类'}), 400
        elif user_data['user_type'] == 'customer':
            if not user_data.get('restaurant_name'):
                return jsonify({'error': '请提供餐厅名称'}), 400
            if not user_data.get('restaurant_address'):
                return jsonify({'error': '请提供餐厅地址'}), 400
        
        user_model = User(current_app.db)
        new_user = user_model.create_user(user_data)
        
        # 生成JWT令牌
        token = create_token(new_user)
        
        # 返回用户信息和令牌
        return jsonify({
            'token': token,
            'user': {
                'id': str(new_user['_id']),
                'username': new_user['username'],
                'email': new_user['email'],
                'user_type': new_user['user_type'],
                'company_name': new_user.get('company_name'),
                'restaurant_name': new_user.get('restaurant_name'),
                'supply_categories': new_user.get('supply_categories', []),
                'restaurant_address': new_user.get('restaurant_address')
            }
        }), 201
        
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500 