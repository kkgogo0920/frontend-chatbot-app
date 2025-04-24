import React, { useState, useEffect } from 'react';
import { Layout, Input, Space, Button, Dropdown, Menu, Modal, Form, Input as ArcoInput, Message, Radio } from '@arco-design/web-react';
import { IconSearch, IconNotification, IconUser }from '@arco-design/web-react/icon';
import AuthService from '../services/auth';
import companyLogo from '../assets/company-logo.png';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

const { Header } = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Navbar = () => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer');
  const [currentUser, setCurrentUser] = useState(null);
  const [loginType, setLoginType] = useState('email');
  const navigate = useNavigate();
  const isAuthenticated = !!localStorage.getItem('token');

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }
  }, []);

  const handleSearch = (value) => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  const handleLoginTypeChange = (value) => {
    setLoginType(value);
    form.clearFields(['email', 'phone']); // Clear email and phone fields
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validate();
      
      if (isLogin) {
        try {
          const data = await AuthService.login(values.username, values.password);
          setCurrentUser({ 
            token: data.token,
            username: data.username,
            user_type: data.user_type
          });
          Message.success('登录成功');
          setVisible(false);
          form.resetFields();
        } catch (error) {
          Message.error(error.message || '登录失败');
        }
      } else {
        // Handle registration
        const userData = {
          ...values,
          user_type: userType
        };

        try {
          await AuthService.register(userData);
          const user = AuthService.getCurrentUser();
          setCurrentUser(user);
          Message.success('注册成功');
          setVisible(false);
          form.resetFields();
        } catch (error) {
          Message.error(error.message);
        }
      }
    } catch (error) {
      console.error('Form validation error:', error);
      Message.error('请检查输入信息是否完整');
    }
  };

  const handleModalCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    Message.success('已退出登录');
    navigate('/');
  };

  // Validate US phone number
  const validateUSPhone = (value) => {
    const phoneRegex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!value) return false;
    return phoneRegex.test(value);
  };

  // Validate email
  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!value) return false;
    return emailRegex.test(value);
  };

  const dropList = currentUser ? (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>个人信息</Menu.Item>
      <Menu.Item key="summarize" onClick={() => navigate('/summarize')}>文档摘要</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>退出登录</Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item key="login" onClick={() => { setIsLogin(true); setVisible(true); }}>登录</Menu.Item>
      <Menu.Item key="register" onClick={() => { setIsLogin(false); setVisible(true); }}>注册</Menu.Item>
    </Menu>
  );

  return (
    <>
      <Header className="navbar">
        <div className="logo" onClick={() => navigate('/')}>
          <img src={companyLogo} alt="公司logo" className="company-logo" />
        </div>
        <div className="nav-controls">
          <Space size="large">
            <div className="search-container">
              <Input
                placeholder="搜索库存/供应商..."
                prefix={<IconSearch />}
                onChange={handleSearch}
                allowClear
              />
            </div>
            <Button type="text" icon={<IconNotification />}>
              <span className="notification-badge">2</span>
            </Button>
            <Dropdown droplist={dropList} position="br">
              <Button type="text" icon={<IconUser />}>
                {currentUser ? currentUser.email : '用户'}
              </Button>
            </Dropdown>
          </Space>
        </div>
      </Header>

      <Modal
        title={isLogin ? "用户登录" : "用户注册"}
        visible={visible}
        onOk={handleModalOk}
        onCancel={handleModalCancel}
        autoFocus={false}
        focusLock={true}
      >
        <Form
          form={form}
          layout="vertical"
          style={{ width: '100%' }}
        >
          {!isLogin && (
            <FormItem label="用户类型" field="user_type" initialValue={userType}>
              <RadioGroup onChange={setUserType} value={userType}>
                <Radio value="customer">餐厅客户</Radio>
                <Radio value="supplier">供应商</Radio>
              </RadioGroup>
            </FormItem>
          )}

          {isLogin ? (
            <FormItem
              label="用户名"
              field="username"
              rules={[{ required: true, message: '请输入用户名' }]}
            >
              <ArcoInput placeholder="请输入用户名" />
            </FormItem>
          ) : (
            <>
              <FormItem
                label="用户名"
                field="username"
                rules={[
                  { required: true, message: '请输入用户名' },
                  { minLength: 3, message: '用户名长度至少为3位' }
                ]}
              >
                <ArcoInput placeholder="请输入用户名" />
              </FormItem>
              <FormItem
                label="邮箱"
                field="email"
                rules={[
                  { required: true, message: '请输入邮箱' },
                  {
                    validator: (value, callback) => {
                      if (!validateEmail(value)) {
                        callback('请输入有效的邮箱地址');
                      }
                      callback();
                    }
                  }
                ]}
              >
                <ArcoInput placeholder="请输入邮箱" />
              </FormItem>
            </>
          )}

          {!isLogin && userType === 'supplier' && (
            <>
              <FormItem
                label="公司名称"
                field="company_name"
                rules={[{ required: true, message: '请输入公司名称' }]}
              >
                <ArcoInput placeholder="请输入公司名称" />
              </FormItem>
              <FormItem
                label="供应品类"
                field="supply_categories"
                rules={[{ required: true, message: '请输入供应品类' }]}
              >
                <ArcoInput placeholder="请输入供应品类，多个品类用逗号分隔" />
              </FormItem>
            </>
          )}

          {!isLogin && userType === 'customer' && (
            <>
              <FormItem
                label="餐厅名称"
                field="restaurant_name"
                rules={[{ required: true, message: '请输入餐厅名称' }]}
              >
                <ArcoInput placeholder="请输入餐厅名称" />
              </FormItem>
              <FormItem
                label="餐厅地址"
                field="restaurant_address"
                rules={[{ required: true, message: '请输入餐厅地址' }]}
              >
                <ArcoInput placeholder="请输入餐厅地址" />
              </FormItem>
            </>
          )}

          <FormItem
            label="密码"
            field="password"
            rules={[
              { required: true, message: '请输入密码' },
              { minLength: 8, message: '密码长度至少为8位' },
              {
                validator: (value, callback) => {
                  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    callback('密码必须包含大小写字母和数字');
                  }
                  callback();
                }
              }
            ]}
          >
            <ArcoInput.Password placeholder="请输入密码" />
          </FormItem>

          {!isLogin && (
            <FormItem
              label="确认密码"
              field="confirmPassword"
              rules={[
                { required: true, message: '请确认密码' },
                {
                  validator: (value, callback) => {
                    if (value !== form.getFieldValue('password')) {
                      callback('两次输入的密码不一致');
                    }
                    callback();
                  },
                },
              ]}
            >
              <ArcoInput.Password placeholder="请再次输入密码" />
            </FormItem>
          )}
        </Form>
      </Modal>
    </>
  );
};

export default Navbar;