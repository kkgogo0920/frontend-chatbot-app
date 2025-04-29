import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import Navbar from '../components/Navbar.jsx';
import SideMenu from '../components/SideMenu.jsx';
import DocumentSummary from '../components/DocumentSummary.jsx';
import Home from '../pages/Home';
import ProcurementFlow from '../pages/ProcurementFlow';
import { IconMenu } from '@arco-design/web-react/icon';
import '../styles/MainLayout.css';

const { Sider, Content } = Layout;

// MainLayout 负责整体布局和左侧菜单内容切换
const MainLayout = ({ children }) => {
  // 当前选中的菜单项
  const [selectedMenu, setSelectedMenu] = useState('apps');
  // 侧边栏是否收起
  const [collapsed, setCollapsed] = useState(false); // 默认展开

  // 菜单选择回调
  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
  };

  // 根据菜单选择渲染不同页面内容
  const renderContent = () => {
    switch (selectedMenu) {
      case 'documents':
        return <DocumentSummary />;
      case 'apps':
        return <Home />;
      case 'procurement-flow':
        return <ProcurementFlow />;
      default:
        return <Home />;
    }
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
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 