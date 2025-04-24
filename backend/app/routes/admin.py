from flask import Blueprint, jsonify, current_app, request
from ..models.user import User
from ..routes.auth import admin_required

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/users', methods=['GET'])
@admin_required
def get_all_users():
    """获取所有用户列表"""
    try:
        user_model = User(current_app.db)
        users = user_model.get_all_users()
        # 确保每个用户对象都包含ID
        for user in users:
            user['id'] = str(user.pop('_id', ''))
        return jsonify(users)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>/status', methods=['PUT'])
@admin_required
def update_user_status(user_id):
    """更新用户状态"""
    try:
        data = request.get_json()
        is_active = data.get('is_active')
        
        if is_active is None:
            return jsonify({'error': '请提供用户状态'}), 400
            
        user_model = User(current_app.db)
        user = user_model.update_user_status(user_id, is_active)
        
        if user:
            # 确保返回的用户对象包含ID
            user['id'] = str(user.pop('_id', ''))
            return jsonify({'message': '用户状态已更新', 'user': user})
        return jsonify({'error': '用户不存在'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@admin_bp.route('/users/<user_id>', methods=['DELETE'])
@admin_required
def delete_user(user_id):
    """删除用户"""
    try:
        user_model = User(current_app.db)
        result = user_model.delete_user(user_id)
        
        if result:
            return jsonify({'message': '用户已删除', 'user_id': user_id})
        return jsonify({'error': '用户不存在'}), 404
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500 