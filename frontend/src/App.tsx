import React from 'react';
import { Layout } from 'antd';

const { Header, Content, Footer } = Layout;

const App: React.FC = () => {
  return (
    <Layout className="layout">
      <Header style={{ display: 'flex', alignItems: 'center' }}>
        <div className="logo" />
        <h1 style={{ color: '#fff', margin: 0 }}>智能碳排放管理系统</h1>
      </Header>
      <Content style={{ padding: '0 50px', minHeight: 'calc(100vh - 134px)' }}>
        <div className="site-layout-content" style={{ padding: 24, minHeight: 380 }}>
          {/* 路由内容将在这里渲染 */}
        </div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>
        智能碳排放管理系统 ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
};

export default App;