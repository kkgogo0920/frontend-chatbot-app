import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { USER_TYPES } from '../constants/config';
import AdminUserManagement from '../pages/AdminUserManagement';
import ProcurementFlow from './ProcurementFlow';
import DocumentSummary from './DocumentSummary';
import '../styles/ContentArea.css';

const ContentArea = ({ activePage, searchQuery }) => {
    const { currentUser } = useAuth();

    const renderContent = () => {
        switch (activePage) {
            case '0':
                return <ProcurementFlow />;
            case '1':
                return (
                    <div className="content-section">
                        <h2>Documents</h2>
                        <DocumentSummary />
                        {searchQuery && (
                            <div style={{ marginTop: '20px' }}>
                                <h3>Search Results for: {searchQuery}</h3>
                            </div>
                        )}
                    </div>
                );
            case 'admin-users':
                if (currentUser?.user_type === USER_TYPES.ADMIN) {
                    return <AdminUserManagement />;
                }
                return <div>无权访问此页面</div>;
            default:
                return <ProcurementFlow />;
        }
    };

    return (
        <div className="content-container">
            {renderContent()}
        </div>
    );
};

export default ContentArea;