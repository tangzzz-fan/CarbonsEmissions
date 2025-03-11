import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Form, Input } from 'antd';
import { useAuth } from '../../hooks/useAuth';
import { AuthGuard } from '../../components/AuthGuard';

interface Permission {
  id: number;
  code: string;
  name: string;
  description: string;
}

const PermissionList: React.FC = () => {
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingPermission, setEditingPermission] = useState<Permission | null>(null);
  const { hasPermission } = useAuth();

  useEffect(() => {
    fetchPermissions();
  }, []);

  const fetchPermissions = async () => {
    setLoading(true);
    try {
      // TODO: 替换为实际的API调用
      const response = await fetch('/api/permissions');
      const data = await response.json();
      setPermissions(data);
    } catch (error) {
      message.error('获取权限列表失败');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: '权限代码',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: '权限名称',
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
      render: (_: any, record: Permission) => (
        <Space size="middle">
          {hasPermission('permission:edit') && (
            <Button type="link" onClick={() => handleEdit(record)}>编辑</Button>
          )}
          {hasPermission('permission:delete') && (
            <Button type="link" danger onClick={() => handleDelete(record)}>删除</Button>
          )}
        </Space>
      ),
    },
  ];

  const handleEdit = (permission: Permission) => {
    setEditingPermission(permission);
    form.setFieldsValue(permission);
    setModalVisible(true);
  };

  const handleDelete = (permission: Permission) => {
    Modal.confirm({
      title: '确认删除',
      content: `确定要删除权限 ${permission.name} 吗？`,
      onOk: async () => {
        try {
          // TODO: 替换为实际的API调用
          await fetch(`/api/permissions/${permission.id}`, { method: 'DELETE' });
          message.success('删除成功');
          fetchPermissions();
        } catch (error) {
          message.error('删除失败');
        }
      },
    });
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      const isEditing = editingPermission !== null;
      const url = isEditing ? `/api/permissions/${editingPermission.id}` : '/api/permissions';
      const method = isEditing ? 'PUT' : 'POST';

      // TODO: 替换为实际的API调用
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      message.success(isEditing ? '更新成功' : '创建成功');
      setModalVisible(false);
      form.resetFields();
      setEditingPermission(null);
      fetchPermissions();
    } catch (error) {
      if (error instanceof Error) {
        message.error('表单验证失败');
      } else {
        message.error(editingPermission ? '更新失败' : '创建失败');
      }
    }
  };

  const handleModalCancel = () => {
    setModalVisible(false);
    form.resetFields();
    setEditingPermission(null);
  };

  return (
    <AuthGuard permissionCode="permission:view">
      <div style={{ padding: '24px' }}>
        <div style={{ marginBottom: '16px' }}>
          {hasPermission('permission:create') && (
            <Button type="primary" onClick={() => setModalVisible(true)}>新建权限</Button>
          )}
        </div>
        <Table
          columns={columns}
          dataSource={permissions}
          loading={loading}
          rowKey="id"
        />

        <Modal
          title={editingPermission ? '编辑权限' : '新建权限'}
          visible={modalVisible}
          onOk={handleModalOk}
          onCancel={handleModalCancel}
          destroyOnClose
        >
          <Form
            form={form}
            layout="vertical"
          >
            <Form.Item
              name="code"
              label="权限代码"
              rules={[{ required: true, message: '请输入权限代码' }]}
            >
              <Input placeholder="请输入权限代码" />
            </Form.Item>
            <Form.Item
              name="name"
              label="权限名称"
              rules={[{ required: true, message: '请输入权限名称' }]}
            >
              <Input placeholder="请输入权限名称" />
            </Form.Item>
            <Form.Item
              name="description"
              label="描述"
            >
              <Input.TextArea placeholder="请输入权限描述" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </AuthGuard>
  );
};

export default PermissionList;