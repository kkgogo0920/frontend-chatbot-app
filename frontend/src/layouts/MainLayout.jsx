import React, { useState, useEffect } from 'react';
import { Layout } from '@arco-design/web-react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from '../pages/Navbar.jsx';
import SideMenu from '../components/SideMenu.jsx';
import Reviews from '../components/ProductReviewFeed.jsx';
import '../styles/MainLayout.css';

const { Sider, Content } = Layout;

// MainLayout 负责整体布局和左侧菜单内容切换
const MainLayout = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the current path without leading slash
  const currentPath = location.pathname.substring(1) || 'home';
  
  // 当前选中的菜单项 - based on current URL path
  const [selectedMenu, setSelectedMenu] = useState(currentPath);
  // 侧边栏是否收起
  const [collapsed, setCollapsed] = useState(false); // 默认展开

  // Update selectedMenu when URL changes
  useEffect(() => {
    const path = location.pathname.substring(1) || 'home';
    setSelectedMenu(path);
  }, [location]);

  // 菜单选择回调
  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
    navigate(`/${key}`);
  };

  return (
    <Layout className="main-layout" style={{ minHeight: '100vh', background: '#f6f8fa' }}>
      {/* 侧边栏菜单 */}
      {!collapsed && (
        <Sider
          width={220}
          style={{ background: '#f6f8fa', boxShadow: '2px 0 8px #f0f1f2' }}
        >
          <SideMenu onMenuSelect={handleMenuSelect} selectedKey={selectedMenu} collapsed={collapsed} />
        </Sider>
      )}
      <Layout>
        {/* 顶部导航栏 */}
        <Navbar collapsed={collapsed} onCollapse={() => setCollapsed(!collapsed)} />
        {/* 主内容区 */}
        <Content className="main-content" style={{ padding: 32, background: '#f6f8fa' }}>
          {children}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout;