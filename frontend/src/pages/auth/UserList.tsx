import React, { useState, useEffect } from 'react';
import { Table, Button, Space, message } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { AuthGuard } from '../../components/AuthGuard';

interface User {
  id: number;
  username: string;
  email: string;
  role: string;
  status: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/users');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      message.error('获取用户列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '用户名',
      dataIndex: 'username',
      key: 'username',
    },
    {
      title: '邮箱',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: '角色',
      dataIndex: 'role',
      key: 'role',
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, _record: User) => (
        <Space size="middle">
          {hasPermission('user:edit') && (
            <Button type="link">编辑</Button>
          )}
          {hasPermission('user:delete') && (
            <Button type="link" danger>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <AuthGuard permissionCode="user:view">
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          {hasPermission('user:create') && (
            <Button type="primary">新建用户</Button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={users}
          loading={loading}
          rowKey="id"
        />
      </div>
    </AuthGuard>
  );
};

export default UserList;