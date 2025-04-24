from flask import Blueprint, jsonify
from ..utils.jwt_utils import token_required

user_bp = Blueprint('user', __name__)

@user_bp.route('/user/profile', methods=['GET'])
@token_required
def get_user_profile(current_user):
    """获取用户信息"""
    user_data = {
        'email': current_user.get('email'),
        'phone': current_user.get('phone'),
        'user_type': current_user['user_type'],
        'created_at': current_user['created_at'].isoformat()
    }
    
    if current_user['user_type'] == 'supplier':
        user_data.update({
            'company_name': current_user['company_name'],
            'business_license': current_user['business_license'],
            'supply_categories': current_user.get('supply_categories', [])
        })
    else:
        user_data.update({
            'restaurant_name': current_user['restaurant_name'],
            'restaurant_address': current_user['restaurant_address']
        })
    
    return jsonify(user_data)

@user_bp.route('/refresh-token', methods=['POST'])
@token_required
def refresh_token(current_user):
    """刷新JWT令牌"""
    from ..utils.jwt_utils import generate_token
    new_token = generate_token(current_user)
    return jsonify({'token': new_token}) 