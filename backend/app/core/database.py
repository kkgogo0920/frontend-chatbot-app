from pymongo import MongoClient, ASCENDING
from pymongo.errors import OperationFailure

from app.core.config import settings

class Database:
    client = None
    db = None
    
    @classmethod
    def connect(cls):
        """连接到MongoDB数据库"""
        if not cls.client:
            cls.client = MongoClient(settings.MONGO_URI)
            cls.db = cls.client[settings.MONGO_DB_NAME]
    
    @classmethod
    def setup_indexes(cls):
        """设置数据库索引"""
        try:
            # 获取users集合
            users = cls.db.users
            
            # 删除现有的索引
            users.drop_indexes()
            
            # 创建新的索引
            users.create_index([('email', ASCENDING)], 
                             unique=True, 
                             sparse=True, 
                             name='unique_email_index')
            users.create_index([('phone', ASCENDING)], 
                             unique=True, 
                             sparse=True, 
                             name='unique_phone_index')
            print("数据库索引设置成功")
        except Exception as e:
            print(f"设置索引时出错: {str(e)}")
            raise
    
    @classmethod
    def get_collection(cls, collection_name):
        """获取指定的集合"""
        if not cls.db:
            cls.connect()
        return cls.db[collection_name]

# 初始化数据库连接
db = Database() 