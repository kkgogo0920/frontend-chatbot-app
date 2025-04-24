import re

def validate_phone(phone):
    """验证美国电话号码格式"""
    phone_pattern = re.compile(r'^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$')
    return bool(phone_pattern.match(phone))

def validate_email(email):
    """验证邮箱格式"""
    email_pattern = re.compile(r'^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$')
    return bool(email_pattern.match(email))

def validate_password(password):
    """验证密码强度"""
    if len(password) < 8:
        return False
    if not re.search(r'[A-Z]', password):
        return False
    if not re.search(r'[a-z]', password):
        return False
    if not re.search(r'\d', password):
        return False
    return True 