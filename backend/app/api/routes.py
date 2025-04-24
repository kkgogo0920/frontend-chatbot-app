from flask import Blueprint, request, jsonify

from app.models.user import User
from app.services.auth import token_required, generate_token
from app.services.ai import ai_service
from app.core.config import settings

# 创建蓝图
api = Blueprint('api', __name__)

@api.route('/register', methods=['POST'])
def register():
    """用户注册接口"""
    try:
        data = request.get_json()
        user = User.create(data)
        token = generate_token(user)
        
        return jsonify({
            'message': '注册成功',
            'token': token,
            'user_type': user.user_type,
            'email': user.email,
            'phone': user.phone
        }), 201
    except ValueError as e:
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/login', methods=['POST'])
def login():
    """用户登录接口"""
    print("\n=== Login Start ===")
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')
        
        if not password:
            return jsonify({'error': '请提供密码'}), 400
            
        # 检查是否是测试账号
        if username in settings.TEST_ACCOUNTS:
            test_account = settings.TEST_ACCOUNTS[username]
            if password == test_account['password']:
                token = generate_token(test_account)
                return jsonify({
                    'message': '登录成功',
                    'token': token,
                    'user_type': test_account['user_type'],
                    'username': username
                }), 200
            return jsonify({'error': '密码错误'}), 401
        
        # 验证用户凭据
        user = User.find_by_credentials(username, password)
        if not user:
            return jsonify({'error': '用户名或密码错误'}), 401
            
        token = generate_token(user)
        return jsonify({
            'message': '登录成功',
            'token': token,
            'user_type': user.user_type,
            'email': user.email,
            'phone': user.phone
        }), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/user/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """获取用户信息"""
    return jsonify(current_user.to_dict())

@api.route('/refresh-token', methods=['POST'])
@token_required
def refresh_token(current_user):
    """刷新JWT令牌"""
    new_token = generate_token(current_user)
    return jsonify({'token': new_token})

@api.route('/ai/summarize', methods=['POST'])
@token_required
def summarize_document(current_user):
    """AI文本分析接口"""
    try:
        # 验证请求格式
        if not request.is_json:
            return jsonify({'error': '请求必须是JSON格式'}), 400
            
        # 获取并验证输入参数
        data = request.json
        text = data.get('text', '').strip()
        length = data.get('length', 'medium')
        force_language = data.get('force_language')  # 可选参数
        
        if not text:
            return jsonify({'error': '文本内容不能为空'}), 400
            
        if length not in ['short', 'medium', 'long']:
            return jsonify({'error': '无效的长度参数'}), 400
            
        # 处理文本
        if len(text) > 2000:
            text = text[:2000] + "..."
            
        try:
            # 获取AI响应
            summary = ai_service.get_response(
                text,
                length=length,
                force_language=force_language
            )
            
            if not summary:
                raise Exception("生成的回答为空")
                
            return jsonify({
                'summary': summary,
                'length': length,
                'language': ai_service.detect_language(text)
            })
        except Exception as e:
            return jsonify({
                'error': f'AI服务暂时不可用，请稍后再试。错误详情：{str(e)}'
            }), 503
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@api.route('/ai/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    try:
        # 测试AI服务
        test_response = ai_service.get_response(
            "test",
            length='short',
            force_language='en'
        )
        return jsonify({
            'status': 'healthy',
            'message': 'AI服务连接正常'
        })
    except Exception as e:
        return jsonify({
            'status': 'unhealthy',
            'error': str(e)
        }), 500 