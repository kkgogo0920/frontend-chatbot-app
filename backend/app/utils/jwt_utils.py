from functools import wraps
from flask import current_app, request, jsonify
import jwt
from datetime import datetime
from bson import ObjectId
import os

# 获取JWT密钥
JWT_SECRET_KEY = os.getenv('JWT_SECRET_KEY', 'jwt_restaurant_app_secret_key_2024')

def generate_token(user):
    """生成JWT令牌"""
    token = jwt.encode({
        'user_id': str(user['_id']),
        'email': user.get('email'),
        'phone': user.get('phone'),
        'user_type': user['user_type'],
        'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES']
    }, JWT_SECRET_KEY, algorithm="HS256")
    return token

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            if not auth_header.startswith('Bearer '):
                return jsonify({'error': '无效的认证头格式'}), 401
            token = auth_header.split(" ")[1]
            print("Received token:", token)  # 调试日志
        
        if not token:
            return jsonify({'error': '缺少认证令牌'}), 401
        
        try:
            print("Using JWT Secret Key:", JWT_SECRET_KEY)  # 调试日志
            data = jwt.decode(token, JWT_SECRET_KEY, algorithms=["HS256"])
            print("Decoded token data:", data)  # 调试日志
            
            # 尝试获取用户ID
            user_id = data.get('user_id')
            print("Extracted user_id:", user_id)  # 调试日志
            
            if not user_id:
                return jsonify({'error': '令牌中缺少用户ID'}), 401
            
            # 检查是否是测试账号或超级管理员
            if isinstance(user_id, str) and (user_id.startswith('test_account_') or user_id == 'super_admin_id'):
                # 测试账号或超级管理员处理
                from ..config.admin import TEST_ACCOUNTS, SUPER_ADMIN, get_test_account
                
                if user_id == 'super_admin_id':
                    current_user = SUPER_ADMIN
                else:
                    username = user_id.replace('test_account_', '')
                    print("Test account username:", username)  # 调试日志
                    current_user = get_test_account(username)
                
                if not current_user:
                    return jsonify({'error': '无效的测试账号令牌'}), 401
                # 确保账号有_id字段
                current_user['_id'] = user_id
            else:
                # 数据库用户处理
                try:
                    current_user = current_app.db.users.find_one({'_id': ObjectId(user_id)})
                except Exception as e:
                    print("Error finding user in database:", str(e))  # 调试日志
                    return jsonify({'error': '无效的用户ID格式'}), 401
                    
                if not current_user:
                    return jsonify({'error': '无效的用户令牌'}), 401
                    
        except jwt.ExpiredSignatureError:
            return jsonify({'error': '令牌已过期'}), 401
        except jwt.InvalidTokenError as e:
            print("Invalid token error:", str(e))  # 调试日志
            return jsonify({'error': '无效的令牌'}), 401
        except Exception as e:
            print("Token validation error:", str(e))  # 调试日志
            return jsonify({'error': '令牌验证失败'}), 401
        
        return f(current_user, *args, **kwargs)
    
    return decorated 