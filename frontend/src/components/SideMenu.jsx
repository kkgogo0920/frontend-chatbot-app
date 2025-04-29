import React from 'react';
import { Menu } from '@arco-design/web-react';
import { IconApps, IconFile, IconMenu } from '@arco-design/web-react/icon';
import { Link } from 'react-router-dom';
import '../styles/SideMenu.css';

const MenuItem = Menu.Item;

// Sidebar menu component, responsible for rendering and selection
const SideMenu = ({ onMenuSelect, selectedKey = 'home', collapsed }) => {
    // Menu click callback
    const handleMenuSelect = (key) => {
        if (onMenuSelect) {
            onMenuSelect(key);
        }
    };

    return (
        <div className="side-menu-container" style={{ padding: '0', height: '100%' }}>
            <Menu 
                selectedKeys={[selectedKey]}
                onClickMenuItem={handleMenuSelect}
                style={{ border: 'none', background: 'transparent', marginTop: 16 }}
            >
                {/* Home menu */}
                <MenuItem
                  key="home"
                  className={selectedKey === 'home' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
                  style={{ margin: '12px 16px', borderRadius: 12, fontSize: 16 }}
                >
                    <IconApps className="menu-icon" />
                    {!collapsed && 'Home'}
                </MenuItem>
                {/* Documents menu */}
                <MenuItem
                  key="documents"
                  className={selectedKey === 'documents' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
                  style={{ margin: '12px 16px', borderRadius: 12, fontSize: 16 }}
                >
                    <IconFile className="menu-icon" />
                    {!collapsed && 'Documents'}
                </MenuItem>
                {/* Reviews menu */}
                <MenuItem
                  key="reviews"
                  className={selectedKey === 'reviews' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
                  style={{ margin: '12px 16px', borderRadius: 12, fontSize: 16 }}
                >
                    <IconFile className="menu-icon" />
                    {!collapsed && 'Reviews'}
                </MenuItem>
                {/* Inventory menu */}
                <MenuItem
                  key="inventory"
                  className={selectedKey === 'inventory' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
                  style={{ margin: '12px 16px', borderRadius: 12, fontSize: 16 }}
                >
                    <IconMenu className="menu-icon" />
                    {!collapsed && 'Inventory'}
                </MenuItem>
            </Menu>
        </div>
    );
};

export default SideMenu;