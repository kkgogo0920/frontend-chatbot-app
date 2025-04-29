import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Home from '../pages/Home';
import DocumentSummary from '../components/DocumentSummary';
import ProcurementFlow from '../pages/ProcurementFlow';
import Reviews from '../components/ProductReviewFeed';
import Login from '../components/Login';
import Register from '../components/Register';


// 需要布局的路由
const LayoutRoutes = () => (
  <MainLayout>
    <Routes>
      {/* Redirect root path to /home */}
      <Route path="/" element={<Navigate to="/home" replace />} />
      <Route path="/home" element={<Home />} />
      <Route path="/documents" element={<DocumentSummary />} />
      <Route path="/reviews" element={<Reviews />} />
      <Route path="/inventory" element={<ProcurementFlow />} />
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