import React from 'react';
import { Menu } from '@arco-design/web-react';
import { IconApps, IconFile } from '@arco-design/web-react/icon';
import '../styles/SideMenu.css';

const MenuItem = Menu.Item;

const SideMenu = ({ onMenuSelect, selectedKey = 'apps' }) => {
    const handleMenuSelect = (key) => {
        if (onMenuSelect) {
            onMenuSelect(key);
        }
    };

    return (
        <div className="side-menu">
            <Menu 
                selectedKeys={[selectedKey]}
                onClickMenuItem={handleMenuSelect}
            >
                <MenuItem key="apps">
                    <IconApps className="menu-icon" />
                    Apps
                </MenuItem>
                <MenuItem key="documents">
                    <IconFile className="menu-icon" />
                    Documents
                </MenuItem>
            </Menu>
        </div>
    );
};

export default SideMenu;