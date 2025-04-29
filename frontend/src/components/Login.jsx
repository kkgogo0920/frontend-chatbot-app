import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Card, Form, Input, Button, Radio, Message } from '@arco-design/web-react';
import AuthService from '../services/auth';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Login = () => {
  const [form] = Form.useForm();
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState('customer');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  React.useEffect(() => {
    // Switch between login/register based on route
    if (location.pathname === '/register') {
      setIsLogin(false);
    } else {
      setIsLogin(true);
    }
  }, [location.pathname]);

  const validateEmail = (value, callback) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!value) return callback('Please enter your email');
    if (!emailRegex.test(value)) return callback('Please enter a valid email address');
    callback();
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validate();
      if (isLogin) {
        // Login
        const data = await AuthService.login(values.username, values.password);
        Message.success('Login successful');
        navigate('/home');
      } else {
        // Register
        const userData = { ...values, user_type: userType };
        await AuthService.register(userData);
        Message.success('Registration successful');
        navigate('/login');
      }
      form.resetFields();
    } catch (error) {
      Message.error(error.message || 'Operation failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f6f8fa' }}>
      <Card style={{ width: 400, borderRadius: 16 }} bodyStyle={{ padding: 32 }}>
        <h2 style={{ textAlign: 'center', marginBottom: 24 }}>{isLogin ? 'User Login' : 'User Registration'}</h2>
        <Form form={form} layout="vertical">
          {!isLogin && (
            <FormItem label="User Type" field="user_type" initialValue={userType}>
              <RadioGroup onChange={setUserType} value={userType}>
                <Radio value="customer">Restaurant Customer</Radio>
                <Radio value="supplier">Supplier</Radio>
              </RadioGroup>
            </FormItem>
          )}
          <FormItem
            label="Username"
            field="username"
            rules={[{ required: true, message: 'Please enter your username' }]}
          >
            <Input placeholder="Please enter your username" autoComplete="username" />
          </FormItem>
          {!isLogin && (
            <FormItem
              label="Email"
              field="email"
              rules={[{ required: true, validator: validateEmail }]}
            >
              <Input placeholder="Please enter your email" autoComplete="email" />
            </FormItem>
          )}
          <FormItem
            label="Password"
            field="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
          >
            <Input.Password placeholder="Please enter your password" autoComplete="current-password" />
          </FormItem>
          <Button type="primary" long loading={loading} onClick={handleSubmit} style={{ marginTop: 8 }}>
            {isLogin ? 'Login' : 'Register'}
          </Button>
        </Form>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <Button type="text" onClick={() => navigate('/register')}>
                Register
              </Button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <Button type="text" onClick={() => navigate('/login')}>
                Login
              </Button>
            </>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Login; 