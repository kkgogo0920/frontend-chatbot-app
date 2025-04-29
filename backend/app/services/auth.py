from datetime import datetime
import jwt
from functools import wraps
from flask import request, jsonify

from app.core.config import settings
from app.models.user import User

def generate_token(user):
    """生成JWT令牌"""
    # 处理测试账号
    if isinstance(user, dict):
        payload = {
            'user_id': user.get('_id'),
            'username': user.get('username'),
            'email': user.get('email'),
            'phone': user.get('phone'),
            'user_type': user.get('user_type'),
            'exp': datetime.utcnow() + settings.JWT_ACCESS_TOKEN_EXPIRES
        }
    else:
        # 处理普通用户对象
        payload = {
            'user_id': str(user._id) if hasattr(user, '_id') else None,
            'email': user.email,
            'phone': user.phone,
            'user_type': user.user_type,
            'exp': datetime.utcnow() + settings.JWT_ACCESS_TOKEN_EXPIRES
        }
    
    return jwt.encode(
        payload,
        settings.JWT_SECRET_KEY,
        algorithm="HS256"
    )

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        print("\n=== Token Validation Start ===")
        
        # 获取token
        if 'Authorization' in request.headers:
            token = request.headers['Authorization'].split(" ")[1]
            print("Token received:", token)
        else:
            print("No Authorization header found")
            return jsonify({'error': '缺少认证令牌'}), 401
        
        try:
            print("Attempting to decode token...")
            data = jwt.decode(
                token,
                settings.JWT_SECRET_KEY,
                algorithms=["HS256"]
            )
            print("Decoded token data:", data)
            
            # 检查是否是测试账号
            if data.get('username') in settings.TEST_ACCOUNTS:
                print("Found test account:", data['username'])
                current_user = settings.TEST_ACCOUNTS[data['username']]
            else:
                print("Not a test account, checking database...")
                # 通过user_id查找用户
                if 'user_id' in data:
                    current_user = User.find_by_id(data['user_id'])
                    if not current_user:
                        print("No user found with id:", data['user_id'])
                        return jsonify({'error': '无效的用户令牌'}), 401
                else:
                    print("No user_id in token")
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