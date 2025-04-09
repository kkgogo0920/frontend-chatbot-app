import React from 'react';
import { Layout, Input } from '@arco-design/web-react';
import { IconSearch, IconCodepen } from '@arco-design/web-react/icon';
import '../styles/Navbar.css';

const { Header } = Layout;

const Navbar = ({ onSearch }) => {
  const handleSearch = (value) => {
    if (onSearch && typeof onSearch === 'function') {
      onSearch(value);
    }
  };

  return (
    <Header className="navbar">
      <div className="logo">
        <IconCodepen className="logo-icon" />
        <h1>ChatBot</h1>
      </div>
      <div className="search-container">
        <Input
          placeholder="Search..."
          prefix={<IconSearch />}
          onChange={handleSearch}
          allowClear
        />
      </div>
    </Header>
  );
}

export default Navbar;