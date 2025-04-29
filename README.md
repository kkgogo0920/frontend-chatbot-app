# Frontend Chatbot Application

This is a full-stack chatbot application with a React frontend and Flask backend.

## 🏗️ Project Structure

```
frontend-chatbot-app/
├── frontend/         # React frontend application
└── backend/         # Flask backend application
```

## 🚀 Getting Started

### Frontend Setup

The frontend is built with React and uses Arco Design for the UI components.

#### Features
- **Navigation System**:
  - Top navbar with logo and search functionality
  - Side menu for page navigation
  
- **Content Areas**:
  - Apps page with scrollable content
  - Documents page with scrollable content
  - Search functionality that filters and highlights matching text

- **Chatbot Interface**:
  - Floating button for easy access
  - Responsive design (400x600px on desktop, full-screen on mobile)
  - Conversation history with mock responses and store current message state in localstorage
  - Timer tracking chat session duration
  - Reset and close functionality

#### Installation and Running
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Backend Setup

The backend is built with Flask and provides the API endpoints for the chatbot functionality.

#### Installation and Running
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create, activate, and run a virtual environment:
   ```bash
   python3 -m venv venv
   source venv/bin/activate
   python3 app.py
   ```

3. Install dependencies:
   ```bash
   pip3 install -r requirements.txt
   ```


The backend server will start on `http://localhost:5000`

## 🔧 Development

To work on the full application:
1. Start the backend server first
2. Start the frontend development server
3. Make sure both servers are running simultaneously for full functionality

## 📝 License

This project is licensed under the MIT License.

# 中餐馆进货系统

这是一个基于 React + Flask 的中餐馆进货管理系统。

## 系统账号信息

### 超级管理员账号
```
用户名: kevinke0920
密码: Fuzhou12345
邮箱: kevinke0920@system.com
```

### 测试账号

#### 1. 测试供应商账号
```
用户名: test_supplier
密码: Test123!
邮箱: test_supplier@test.com
公司名称: 测试供应商公司
供应品类: 蔬菜,水果,肉类
```

#### 2. 测试餐厅客户账号
```
用户名: test_customer
密码: Test123!
邮箱: test_customer@test.com
餐厅名称: 测试餐厅
餐厅地址: 福州市台江区测试路123号
```

## 项目结构

```
frontend-chatbot-app/
├── frontend/         # 前端项目
│   ├── src/         # 源代码
│   └── ...
└── backend/         # 后端项目
    ├── app/        # 应用代码
    └── ...
```

## 开发环境设置

### 前端开发
```bash
cd frontend
pnpm install
pnpm dev
```

### 后端开发
```bash
cd backend
pip install -r requirements.txt
python app.py
```

## API 端点

### 认证相关
- POST `/api/auth/login` - 用户登录
- POST `/api/auth/register` - 用户注册

### 用户管理
- GET `/api/admin/users` - 获取所有用户（需要管理员权限）
- PUT `/api/admin/users/<user_id>/status` - 更新用户状态
- DELETE `/api/admin/users/<user_id>` - 删除用户

## 技术栈

### 前端
- React
- Arco Design
- Axios
- Vite

### 后端
- Flask
- MongoDB
- JWT 认证

## 注意事项

1. 首次运行时，系统会自动创建超级管理员账号
2. 测试账号会在系统初始化时自动创建（如果不存在）
3. 所有密码都需要满足以下要求：
   - 最少8位
   - 包含大小写字母和数字 # chef-ai-platform
