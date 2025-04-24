from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

class User:
    def __init__(self, db):
        self.db = db
        self.collection = db.users
        self._setup_indexes()
        self._ensure_admin_exists()
    
    def _setup_indexes(self):
        """设置数据库索引"""
        try:
            # 删除现有的索引
            self.collection.drop_indexes()
            
            # 创建新的索引
            self.collection.create_index([('email', 1)], 
                                      unique=True, 
                                      sparse=True, 
                                      name='unique_email_index')
            self.collection.create_index([('username', 1)], 
                                      unique=True, 
                                      name='unique_username_index')
        except Exception as e:
            print(f"设置索引时出错: {str(e)}")
            raise

    def _ensure_admin_exists(self):
        """确保管理员账户存在"""
        admin = self.collection.find_one({'username': 'kevinke0920'})
        if not admin:
            admin_data = {
                'username': 'kevinke0920',
                'email': 'kevinke0920@system.com',
                'password_hash': generate_password_hash('Fuzhou12345'),
                'user_type': 'admin',
                'is_active': True,
                'created_at': datetime.utcnow()
            }
            self.collection.insert_one(admin_data)
            print("管理员账户已创建")

        # 创建测试供应商账号
        test_supplier = self.collection.find_one({'username': 'test_supplier'})
        if not test_supplier:
            supplier_data = {
                'username': 'test_supplier',
                'email': 'test_supplier@test.com',
                'password_hash': generate_password_hash('Test123!'),
                'user_type': 'supplier',
                'is_active': True,
                'created_at': datetime.utcnow(),
                'company_name': '测试供应商公司',
                'supply_categories': ['蔬菜', '水果', '肉类']
            }
            self.collection.insert_one(supplier_data)
            print("测试供应商账号已创建")

        # 创建测试客户账号
        test_customer = self.collection.find_one({'username': 'test_customer'})
        if not test_customer:
            customer_data = {
                'username': 'test_customer',
                'email': 'test_customer@test.com',
                'password_hash': generate_password_hash('Test123!'),
                'user_type': 'customer',
                'is_active': True,
                'created_at': datetime.utcnow(),
                'restaurant_name': '测试餐厅',
                'restaurant_address': '福州市台江区测试路123号'
            }
            self.collection.insert_one(customer_data)
            print("测试客户账号已创建")
    
    def create_user(self, user_data):
        """创建新用户"""
        # 防止通过普通注册创建管理员账户
        if user_data.get('user_type') == 'admin':
            raise ValueError('不允许创建管理员账户')
            
        # 检查邮箱是否已存在
        if self.collection.find_one({'email': user_data['email']}):
            raise ValueError('该邮箱已被注册')

        # 检查用户名是否已存在
        if self.collection.find_one({'username': user_data['username']}):
            raise ValueError('该用户名已被使用')

        new_user = {
            'username': user_data['username'],
            'email': user_data['email'],
            'password_hash': generate_password_hash(user_data['password']),
            'user_type': user_data['user_type'],
            'created_at': datetime.utcnow(),
            'is_active': True
        }
        
        if user_data['user_type'] == 'supplier':
            new_user.update({
                'company_name': user_data['company_name'],
                'supply_categories': user_data.get('supply_categories', [])
            })
        elif user_data['user_type'] == 'customer':
            new_user.update({
                'restaurant_name': user_data['restaurant_name'],
                'restaurant_address': user_data['restaurant_address']
            })
        
        result = self.collection.insert_one(new_user)
        new_user['_id'] = result.inserted_id
        return new_user
    
    def get_all_users(self, exclude_admin=True):
        """获取所有用户"""
        query = {'user_type': {'$ne': 'admin'}} if exclude_admin else {}
        return list(self.collection.find(query))
    
    def update_user_status(self, user_id, is_active):
        """更新用户状态"""
        result = self.collection.update_one(
            {'_id': ObjectId(user_id), 'user_type': {'$ne': 'admin'}},
            {'$set': {'is_active': is_active}}
        )
        return result.modified_count > 0
    
    def delete_user(self, user_id):
        """删除用户"""
        result = self.collection.delete_one(
            {'_id': ObjectId(user_id), 'user_type': {'$ne': 'admin'}}
        )
        return result.deleted_count > 0

    def find_by_username(self, username):
        """通过用户名查找用户"""
        return self.collection.find_one({'username': username})

    def find_by_email(self, email):
        """通过邮箱查找用户"""
        return self.collection.find_one({'email': email})
    
    def find_by_phone(self, phone):
        """通过手机号查找用户"""
        return self.collection.find_one({'phone': phone})
    
    def find_by_id(self, user_id):
        """通过ID查找用户"""
        return self.collection.find_one({'_id': ObjectId(user_id)})
    
    def verify_password(self, user, password):
        """验证密码"""
        return check_password_hash(user['password_hash'], password) 