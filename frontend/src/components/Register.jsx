import React from 'react';
import { Form, Radio, Input, Button, Space } from '@arco-design/web-react';
import '../styles/Register.css';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const Register = () => {
  const [form] = Form.useForm();

  const handleSubmit = async (values) => {
    console.log('form values:', values);
    // TODO: 实现注册逻辑
  };

  return (
    <div className="register-container">
      <Form
        form={form}
        style={{ width: 600 }}
        onSubmit={handleSubmit}
        autoComplete="off"
      >
        <h2>用户注册</h2>
        
        <FormItem label="用户类型">
          <RadioGroup defaultValue="restaurant">
            <Radio value="restaurant">餐厅客户</Radio>
            <Radio value="supplier">供应商</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem label="注册方式">
          <RadioGroup defaultValue="email">
            <Radio value="email">邮箱</Radio>
            <Radio value="phone">手机号</Radio>
          </RadioGroup>
        </FormItem>

        <FormItem 
          label="邮箱" 
          field="email"
          rules={[
            { required: true, message: '请输入邮箱' },
            { type: 'email', message: '请输入有效的邮箱地址' }
          ]}
        >
          <Input placeholder="请输入邮箱地址" />
        </FormItem>

        <FormItem 
          label="餐厅名称" 
          field="restaurantName"
          rules={[{ required: true, message: '请输入餐厅名称' }]}
        >
          <Input placeholder="请输入餐厅名称" />
        </FormItem>

        <FormItem 
          label="餐厅地址" 
          field="address"
          rules={[{ required: true, message: '请输入餐厅地址' }]}
        >
          <Input placeholder="请输入餐厅地址" />
        </FormItem>

        <FormItem
          label="密码"
          field="password"
          rules={[{ required: true, message: '请输入密码' }]}
        >
          <Input.Password placeholder="请输入密码" />
        </FormItem>

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
              },
            },
          ]}
        >
          <Input.Password placeholder="请再次输入密码" />
        </FormItem>

        <FormItem>
          <Space size="large">
            <Button type="secondary">取消</Button>
            <Button type="primary" htmlType="submit">确定</Button>
          </Space>
        </FormItem>
      </Form>
    </div>
  );
};

export default Register; 