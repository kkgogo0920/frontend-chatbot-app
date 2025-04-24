import { API_URL } from '../constants/config';
import AuthService from './auth';

class AdminService {
    static async getAllUsers() {
        const response = await fetch(`${API_URL}/admin/users`, {
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || '获取用户列表失败');
        }

        return data;
    }

    static async updateUserStatus(userId, isActive) {
        const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
            method: 'PUT',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ is_active: isActive })
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || '更新用户状态失败');
        }

        return data;
    }

    static async deleteUser(userId) {
        const response = await fetch(`${API_URL}/admin/users/${userId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${AuthService.getToken()}`
            }
        });

        const data = await response.json();
        if (!response.ok) {
            throw new Error(data.error || '删除用户失败');
        }

        return data;
    }
}

export default AdminService; 