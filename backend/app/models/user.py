from datetime import datetime
from werkzeug.security import generate_password_hash, check_password_hash
from bson import ObjectId

from app.core.database import db
from app.utils.validators import validate_email, validate_phone

class User:
    collection = db.get_collection('users')
    
    def __init__(self, **kwargs):
        self.email = kwargs.get('email')
        self.phone = kwargs.get('phone')
        self.password_hash = kwargs.get('password_hash')
        self.user_type = kwargs.get('user_type')
        self.created_at = kwargs.get('created_at', datetime.utcnow())
        
        # 供应商特定字段
        if self.user_type == 'supplier':
            self.company_name = kwargs.get('company_name')
            self.business_license = kwargs.get('business_license')
            self.supply_categories = kwargs.get('supply_categories', [])
            
        # 客户特定字段
        elif self.user_type == 'customer':
            self.restaurant_name = kwargs.get('restaurant_name')
            self.restaurant_address = kwargs.get('restaurant_address')
    
    @classmethod
    def create(cls, data):
        """创建新用户"""
        # 验证必填字段
        if not data.get('password'):
            raise ValueError('密码是必填项')
            
        if not data.get('user_type') in ['customer', 'supplier']:
            raise ValueError('无效的用户类型')
            
        # 验证邮箱或手机号
        email = data.get('email')
        phone = data.get('phone')
        
        if not email and not phone:
            raise ValueError('邮箱或手机号至少需要提供一个')
            
        if email and not validate_email(email):
            raise ValueError('邮箱格式无效')
            
        if phone and not validate_phone(phone):
            raise ValueError('手机号格式无效')
            
        # 检查邮箱或手机号是否已存在
        if email and cls.collection.find_one({'email': email}):
            raise ValueError('该邮箱已被注册')
        if phone and cls.collection.find_one({'phone': phone}):
            raise ValueError('该手机号已被注册')
            
        # 创建用户文档
        user_doc = {
            'email': email,
            'phone': phone,
            'password_hash': generate_password_hash(data['password']),
            'user_type': data['user_type'],
            'created_at': datetime.utcnow()
        }
        
        # 添加用户类型特定字段
        if data['user_type'] == 'supplier':
            if not all(field in data for field in ['company_name', 'business_license']):
                raise ValueError('缺少供应商必填信息')
            user_doc.update({
                'company_name': data['company_name'],
                'business_license': data['business_license'],
                'supply_categories': data.get('supply_categories', [])
            })
        elif data['user_type'] == 'customer':
            if not all(field in data for field in ['restaurant_name', 'restaurant_address']):
                raise ValueError('缺少餐厅必填信息')
            user_doc.update({
                'restaurant_name': data['restaurant_name'],
                'restaurant_address': data['restaurant_address']
            })
            
        # 插入数据库
        result = cls.collection.insert_one(user_doc)
        user_doc['_id'] = result.inserted_id
        return cls(**user_doc)
    
    @classmethod
    def find_by_credentials(cls, username, password):
        """通过用户名和密码查找用户"""
        # 尝试通过邮箱查找
        user = cls.collection.find_one({'email': username})
        if not user:
            # 尝试通过手机号查找
            user = cls.collection.find_one({'phone': username})
            
        if user and check_password_hash(user['password_hash'], password):
            return cls(**user)
        return None
    
    @classmethod
    def find_by_id(cls, user_id):
        """通过ID查找用户"""
        user = cls.collection.find_one({'_id': ObjectId(user_id)})
        return cls(**user) if user else None
    
    def to_dict(self):
        """将用户对象转换为字典"""
        user_dict = {
            'email': self.email,
            'phone': self.phone,
            'user_type': self.user_type,
            'created_at': self.created_at
        }
        
        if self.user_type == 'supplier':
            user_dict.update({
                'company_name': self.company_name,
                'business_license': self.business_license,
                'supply_categories': self.supply_categories
            })
        elif self.user_type == 'customer':
            user_dict.update({
                'restaurant_name': self.restaurant_name,
                'restaurant_address': self.restaurant_address
            })
            
        return user_dict

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
    
    def verify_password(self, user, password):
        """验证密码"""
        return check_password_hash(user['password_hash'], password) 