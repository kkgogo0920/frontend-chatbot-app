// API配置
export const API_URL = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:5000/api'
    : '/api';

// 用户类型
export const USER_TYPES = {
    ADMIN: 'admin',
    CUSTOMER: 'customer',
    SUPPLIER: 'supplier'
};

// 登录类型
export const LOGIN_TYPES = {
    EMAIL: 'email',
    PHONE: 'phone'
};

// 路由配置
export const ROUTES = {
    HOME: '/',
    LOGIN: '/login',
    REGISTER: '/register',
    PROFILE: '/profile',
    APPS: '/apps',
    DOCUMENTS: '/documents',
    ADMIN: {
        USERS: '/admin/users',
        USER_MANAGEMENT: '/admin/user-management'
    }
}; 