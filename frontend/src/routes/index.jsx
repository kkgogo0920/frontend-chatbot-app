import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../components/Home';
import Login from '../components/Login';
import Register from '../components/Register';
import Profile from '../components/Profile';
import DocumentSummarizer from '../components/DocumentSummarizer';
import PrivateRoute from '../components/PrivateRoute';

// 需要布局的路由
const LayoutRoutes = () => (
  <MainLayout>
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      <Route path="/summarize" element={<PrivateRoute><DocumentSummarizer /></PrivateRoute>} />
    </Routes>
  </MainLayout>
);

// 不需要布局的路由（登录、注册页面）
const AuthRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route path="/register" element={<Register />} />
  </Routes>
);

const AppRoutes = () => {
  const isAuthPage = window.location.pathname.match(/^\/login|^\/register/);

  return isAuthPage ? <AuthRoutes /> : <LayoutRoutes />;
};

export default AppRoutes; 