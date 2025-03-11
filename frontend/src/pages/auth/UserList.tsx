import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { AuthGuard } from '../../components/AuthGuard';

interface User {
  id: number;
  username: string;
  email: string;
  roles: string[];
  status: 'active' | 'inactive';
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
      dataIndex: 'roles',
      key: 'roles',
      render: (roles: string[]) => roles.join(', '),
    },
    {
      title: '状态',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span style={{ color: status === 'active' ? 'green' : 'red' }}>
          {status === 'active' ? '启用' : '禁用'}
        </span>
      ),
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          {hasPermission('user:edit') && (
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          )}
          {hasPermission('user:delete') && (
            <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (user: User) => {
    // TODO: 实现编辑用户功能
    console.log('Edit user:', user);
  };

  const handleDelete = (user: User) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除用户 ${user.username} 吗？`,
      onOk: async () => {
        try {
          // TODO: 替换为实际的API调用
          await fetch(`/api/users/${user.id}`, { method: 'DELETE' });
          message.success('删除成功');
          fetchUsers();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

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