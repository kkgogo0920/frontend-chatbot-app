import React, { useState, useEffect } from 'react';
import { Layout, Input, Space, Button, Dropdown, Menu, Modal, Form, Input as ArcoInput, Message, Radio, Avatar, Card } from '@arco-design/web-react';
import { IconSearch, IconNotification, IconUser, IconMenu } from '@arco-design/web-react/icon';
import AuthService from '../services/auth';
import companyLogo from '../assets/company-logo.png';
import '../styles/Navbar.css';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../constants/config';

const { Header } = Layout;
const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Navbar = ({ collapsed, onCollapse }) => {
  const [form] = Form.useForm();
  const [visible, setVisible] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setCurrentUser({ token });
    }
  }, []);

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
          Message.success('Login successful');
          setVisible(false);
          form.resetFields();
        } catch (error) {
          Message.error(error.message || 'Login failed');
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
          Message.success('Registration successful');
          setVisible(false);
          form.resetFields();
        } catch (error) {
          Message.error(error.message);
        }
      }
    } catch (error) {
      console.error('Form validation error:', error);
      Message.error('Please check if all input information is complete');
    }
  };

  const handleModalCancel = () => {
    setVisible(false);
    form.resetFields();
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
    Message.success('Logged out successfully');
    navigate('/');
  };

  // Validate email
  const validateEmail = (value) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!value) return false;
    return emailRegex.test(value);
  };

  const dropList = currentUser ? (
    <Menu>
      <Menu.Item key="profile" onClick={() => navigate('/profile')}>Personal Information</Menu.Item>
      <Menu.Item key="summarize" onClick={() => navigate('/summarize')}>Document Summary</Menu.Item>
      <Menu.Item key="logout" onClick={handleLogout}>Logout</Menu.Item>
    </Menu>
  ) : (
    <Menu>
      <Menu.Item key="login" onClick={() => { setIsLogin(true); setVisible(true); }}>Login</Menu.Item>
      <Menu.Item key="register" onClick={() => { setIsLogin(false); setVisible(true); }}>Register</Menu.Item>
    </Menu>
  );

  return (
    <Header style={{ background: 'transparent', padding: 0, marginBottom: 24 }}>
      <Card
        style={{
          boxShadow: '0 2px 12px 0 rgba(36,104,242,0.06)',
          background: '#fff',
          padding: '0 32px',
          height: 64,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
        bordered={false}
        bodyStyle={{ padding: 0, height: 64, display: 'flex', alignItems: 'center', width: '100%' }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Button
            icon={<IconMenu />}
            shape="circle"
            size="large"
            style={{ background: 'none', border: 'none' }}
            onClick={onCollapse}
          />
          <img src={companyLogo} alt="logo" style={{ height: 36 }} />
        </div>
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
          <Input
            style={{ width: 320, borderRadius: 24, background: '#f6f8fa' }}
            prefix={<IconSearch />}
            placeholder="Search inventory/supplier..."
            allowClear
          />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <Dropdown droplist={dropList} position="br">
            <Avatar style={{ background: '#2468f2', cursor: 'pointer' }} icon={<IconUser />} />
          </Dropdown>
        </div>
      </Card>

      <Modal
        title={isLogin ? "User Login" : "User Registration"}
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
            <FormItem label="User Type" field="user_type" initialValue={userType}>
              <RadioGroup onChange={setUserType} value={userType}>
                <Radio value="customer">Restaurant Customer</Radio>
                <Radio value="supplier">Supplier</Radio>
              </RadioGroup>
            </FormItem>
          )}

          {isLogin ? (
            <FormItem
              label="Username"
              field="username"
              rules={[{ required: true, message: 'Please enter your username' }]}
            >
              <ArcoInput placeholder="Please enter your username" />
            </FormItem>
          ) : (
            <>
              <FormItem
                label="Username"
                field="username"
                rules={[
                  { required: true, message: 'Please enter your username' },
                  { minLength: 3, message: 'Username must be at least 3 characters' }
                ]}
              >
                <ArcoInput placeholder="Please enter your username" />
              </FormItem>
              <FormItem
                label="Email"
                field="email"
                rules={[
                  { required: true, message: 'Please enter your email' },
                  {
                    validator: (value, callback) => {
                      if (!validateEmail(value)) {
                        callback('Please enter a valid email address');
                      }
                      callback();
                    }
                  }
                ]}
              >
                <ArcoInput placeholder="Please enter your email" />
              </FormItem>
            </>
          )}

          {!isLogin && userType === 'supplier' && (
            <>
              <FormItem
                label="Company Name"
                field="company_name"
                rules={[{ required: true, message: 'Please enter your company name' }]}
              >
                <ArcoInput placeholder="Please enter your company name" />
              </FormItem>
              <FormItem
                label="Supply Categories"
                field="supply_categories"
                rules={[{ required: true, message: 'Please enter supply categories' }]}
              >
                <ArcoInput placeholder="Please enter supply categories, separated by commas" />
              </FormItem>
            </>
          )}

          {!isLogin && userType === 'customer' && (
            <>
              <FormItem
                label="Restaurant Name"
                field="restaurant_name"
                rules={[{ required: true, message: 'Please enter your restaurant name' }]}
              >
                <ArcoInput placeholder="Please enter your restaurant name" />
              </FormItem>
              <FormItem
                label="Restaurant Address"
                field="restaurant_address"
                rules={[{ required: true, message: 'Please enter your restaurant address' }]}
              >
                <ArcoInput placeholder="Please enter your restaurant address" />
              </FormItem>
            </>
          )}

          <FormItem
            label="Password"
            field="password"
            rules={[
              { required: true, message: 'Please enter your password' },
              { minLength: 8, message: 'Password must be at least 8 characters' },
              {
                validator: (value, callback) => {
                  if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
                    callback('Password must contain uppercase, lowercase letters, and numbers');
                  }
                  callback();
                }
              }
            ]}
          >
            <ArcoInput.Password placeholder="Please enter your password" />
          </FormItem>

          {!isLogin && (
            <FormItem
              label="Confirm Password"
              field="confirmPassword"
              rules={[
                { required: true, message: 'Please confirm your password' },
                {
                  validator: (value, callback) => {
                    if (value !== form.getFieldValue('password')) {
                      callback('The two passwords entered do not match');
                    }
                    callback();
                  },
                },
              ]}
            >
              <ArcoInput.Password placeholder="Please enter your password again" />
            </FormItem>
          )}
        </Form>
      </Modal>
    </Header>
  );
};

export default Navbar;