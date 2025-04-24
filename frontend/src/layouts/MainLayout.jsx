import React, { useState } from 'react';
import { Layout } from '@arco-design/web-react';
import Navbar from '../components/Navbar.jsx';
import SideMenu from '../components/SideMenu.jsx';
import DocumentSummary from '../components/DocumentSummary.jsx';

const { Content, Sider } = Layout;

const MainLayout = ({ children }) => {
  const [selectedMenu, setSelectedMenu] = useState('apps');

  const handleMenuSelect = (key) => {
    setSelectedMenu(key);
  };

  const renderContent = () => {
    switch (selectedMenu) {
      case 'documents':
        return <DocumentSummary />;
      case 'apps':
      default:
        return children;
    }
  };

  return (
    <Layout className="app-container">
      <Navbar />
      <Layout>
        <Sider width={200}>
          <SideMenu onMenuSelect={handleMenuSelect} selectedKey={selectedMenu} />
        </Sider>
        <Content className="content-container">
          {renderContent()}
        </Content>
      </Layout>
    </Layout>
  );
};

export default MainLayout; 