import React, { useState, useEffect } from 'react';
import { Table, Button, Message, Popconfirm } from '@arco-design/web-react';
import { useAuth } from '../contexts/AuthContext';
import AdminService from '../services/admin';
import { USER_TYPES } from '../constants/config';

const AdminUserManagement = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();

    const fetchUsers = async () => {
        try {
            const data = await AdminService.getAllUsers();
            setUsers(data);
        } catch (error) {
            Message.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleStatusChange = async (userId, isActive) => {
        try {
            await AdminService.updateUserStatus(userId, isActive);
            Message.success('用户状态已更新');
            fetchUsers();
        } catch (error) {
            Message.error(error.message);
        }
    };

    const handleDeleteUser = async (userId) => {
        try {
            await AdminService.deleteUser(userId);
            Message.success('用户已删除');
            fetchUsers();
        } catch (error) {
            Message.error(error.message);
        }
    };

    const columns = [
        {
            title: '邮箱/手机',
            render: (_, record) => record.email || record.phone || '-'
        },
        {
            title: '用户类型',
            dataIndex: 'user_type',
            render: (type) => {
                switch (type) {
                    case USER_TYPES.CUSTOMER:
                        return '餐厅客户';
                    case USER_TYPES.SUPPLIER:
                        return '供应商';
                    default:
                        return type;
                }
            }
        },
        {
            title: '注册时间',
            dataIndex: 'created_at',
            render: (date) => new Date(date).toLocaleString()
        },
        {
            title: '状态',
            dataIndex: 'is_active',
            render: (isActive) => isActive ? '启用' : '禁用'
        },
        {
            title: '操作',
            render: (_, record) => (
                <>
                    <Button
                        type="text"
                        onClick={() => handleStatusChange(record.id, !record.is_active)}
                        style={{ marginRight: 16 }}
                    >
                        {record.is_active ? '禁用' : '启用'}
                    </Button>
                    <Popconfirm
                        title="确定要删除该用户吗？"
                        onOk={() => handleDeleteUser(record.id)}
                    >
                        <Button type="text" status="danger">
                            删除
                        </Button>
                    </Popconfirm>
                </>
            )
        }
    ];

    if (currentUser?.user_type !== USER_TYPES.ADMIN) {
        return <div>无权访问此页面</div>;
    }

    return (
        <div style={{ padding: 20 }}>
            <h2>用户管理</h2>
            <Table
                loading={loading}
                columns={columns}
                data={users}
                rowKey="id"
                pagination={{
                    pageSize: 10,
                    showTotal: true,
                    showJumper: true,
                    showPageSize: true,
                }}
            />
        </div>
    );
};

export default AdminUserManagement; 