import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Transfer } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { AuthGuard } from '../../components/AuthGuard';

interface Role {
  id: number;
  name: string;
  description: string;
  permissions: string[];
}

interface Permission {
  key: string;
  title: string;
}

const RoleList: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [permissionModalVisible, setPermissionModalVisible] = useState(false);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchRoles();
    fetchPermissions();
  }, []);

  const fetchRoles = async () => {
    setLoading(true);
    try {
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/roles');
      const data = await response.json();
      setRoles(data);
    } catch (error) {
      message.error('获取角色列表失败');
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async () => {
    try {
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/permissions');
      const data = await response.json();
      setPermissions(data.map((p: any) => ({ key: p.code, title: p.name })));
    } catch (error) {
      message.error('获取权限列表失败');
    }
  };

  const columns = [
    {
      title: '角色名称',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: '描述',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: '操作',
      key: 'action',
      render: (_: any, record: Role) => (
        <Space size="middle">
          {hasPermission('role:edit') && (
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          )}
          {hasPermission('role:permission') && (
            <Button type="link" onClick={() => handlePermission(record)}>权限配置</Button>
          )}
          {hasPermission('role:delete') && (
            <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (role: Role) => {
    // TODO: 实现编辑角色功能
    console.log('Edit role:', role);
  };

  const handlePermission = (role: Role) => {
    setSelectedRole(role);
    setSelectedPermissions(role.permissions);
    setPermissionModalVisible(true);
  };

  const handleDelete = (role: Role) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除角色 ${role.name} 吗？`,
      onOk: async () => {
        try {
          // TODO: 替换为实际的API调用
          await fetch(`/api/roles/${role.id}`, { method: 'DELETE' });
          message.success('删除成功');
          fetchRoles();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handlePermissionSave = async () => {
    if (!selectedRole) return;
    try {
      // TODO: 替换为实际的API调用
      await fetch(`/api/roles/${selectedRole.id}/permissions`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ permissions: selectedPermissions }),
      });
      message.success('权限配置保存成功');
      setPermissionModalVisible(false);
      fetchRoles();
    } catch (error) {
      message.error('权限配置保存失败');
    }
  };

  return (
    <AuthGuard permissionCode="role:view">
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          {hasPermission('role:create') && (
            <Button type="primary">新建角色</Button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={roles}
          loading={loading}
          rowKey="id"
        />

        <Modal
          title="权限配置"
          visible={permissionModalVisible}
          onOk={handlePermissionSave}
          onCancel={() => setPermissionModalVisible(false)}
          width={720}
        >
          <Transfer
            dataSource={permissions}
            titles={['可选权限', '已选权限']}
            targetKeys={selectedPermissions}
            onChange={setSelectedPermissions}
            render={item => item.title}
          />
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default RoleList;