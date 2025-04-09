import React from 'react';
import { Menu } from '@arco-design/web-react';
import { IconApps, IconFile } from '@arco-design/web-react/icon';
import '../styles/SideMenu.css';

const MenuItem = Menu.Item;

function SideMenu({ activePage, onMenuClick }) {
  return (
    <div className="side-menu-container">
      <Menu
        className="side-menu"
        defaultSelectedKeys={[activePage || '0']}
        selectedKeys={[activePage || '0']}
        onClickMenuItem={onMenuClick}
      >
        <MenuItem key="0">
          <IconApps className="menu-icon" />
          Apps
        </MenuItem>
        <MenuItem key="1">
          <IconFile className="menu-icon" />
          Documents
        </MenuItem>
      </Menu>
    </div>
  );
}

export default SideMenu;