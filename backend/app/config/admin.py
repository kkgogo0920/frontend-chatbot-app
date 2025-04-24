import os

# 超级管理员配置
SUPER_ADMIN = {
    "username": os.getenv('SUPER_ADMIN_USERNAME', 'kevinke0920'),
    "password": os.getenv('SUPER_ADMIN_PASSWORD', 'Fuzhou12345'),
    "email": os.getenv('SUPER_ADMIN_EMAIL', 'kevinke0920@system.com'),
    "_id": "super_admin_id",
    "user_type": "super_admin",
    "is_active": True,
    "created_at": "2024-01-01T00:00:00"
}

# 测试账户配置
TEST_ACCOUNTS = {
    "test_customer": {
        "username": "test_customer",
        "password": "Test123456",
        "email": "test_customer@test.com",
        "_id": "test_customer_id",
        "user_type": "customer",
        "is_active": True,
        "restaurant_name": "测试餐厅",
        "restaurant_address": "测试地址",
        "created_at": "2024-01-01T00:00:00"
    },
    "test_supplier": {
        "username": "test_supplier",
        "password": "Test123456",
        "email": "test_supplier@test.com",
        "_id": "test_supplier_id",
        "user_type": "supplier",
        "is_active": True,
        "company_name": "测试供应商",
        "supply_categories": ["蔬菜", "肉类"],
        "created_at": "2024-01-01T00:00:00"
    }
}

def is_test_account(username):
    """检查是否为测试账户"""
    return username in [SUPER_ADMIN["username"]] + list(TEST_ACCOUNTS.keys())

def get_test_account(username):
    """获取测试账户信息"""
    if username == SUPER_ADMIN["username"]:
        return SUPER_ADMIN
    return TEST_ACCOUNTS.get(username) 