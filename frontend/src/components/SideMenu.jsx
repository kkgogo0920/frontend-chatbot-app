import React from 'react';
import { Menu } from '@arco-design/web-react';
import { IconApps, IconFile, IconMenu } from '@arco-design/web-react/icon';
import '../styles/SideMenu.css';

const MenuItem = Menu.Item;

// Sidebar menu component, responsible for rendering and selection
const SideMenu = ({ onMenuSelect, selectedKey = 'apps', collapsed }) => {
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
                  key="apps"
                  className={selectedKey === 'apps' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
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
                {/* Procurement Flow menu */}
                <MenuItem
                  key="procurement-flow"
                  className={selectedKey === 'procurement-flow' ? 'arco-menu-item arco-menu-selected' : 'arco-menu-item'}
                  style={{ margin: '12px 16px', borderRadius: 12, fontSize: 16 }}
                >
                    <IconMenu className="menu-icon" />
                    {!collapsed && 'Procurement Flow'}
                </MenuItem>
            </Menu>
        </div>
    );
};

export default SideMenu;