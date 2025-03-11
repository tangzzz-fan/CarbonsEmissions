# 智能碳排放管理系统

## 项目介绍
智能碳排放管理系统是一个面向物流园区的碳排放预测与管理平台，通过智能算法实现碳排放数据的采集、分析、预测和管理，帮助物流园区实现碳排放的精细化管理和节能减排目标。

## 技术架构

### 前端技术栈
- 核心框架：React.js (基于函数组件 + Hooks)
- UI组件：Ant Design Pro
- 状态管理：Redux Toolkit / Zustand
- 数据可视化：ECharts / Ant Design Charts
- 构建工具：Vite
- 开发语言：TypeScript

### 后端技术栈
#### Node.js服务
- 框架：NestJS
- 数据库：PostgreSQL
- 缓存：Redis
- 认证：JWT + Redis会话管理
- API文档：Swagger

#### Python服务
- 框架：FastAPI
- 数据处理：Pandas, NumPy
- 机器学习：Scikit-learn
- 异步任务：Celery

### 部署环境
- 容器化：Docker + Docker Compose
- 反向代理：Nginx
- CI/CD：GitHub Actions/Jenkins

## 项目结构
```
├── frontend/           # React前端项目
├── backend-node/       # Node.js后端服务
├── backend-python/     # Python数据分析服务
├── docker-compose.yml  # 容器编排配置
└── Dockerfile          # 主Dockerfile
```

## 项目文档
- [后端Node.js服务架构说明](backend-node/README.md)

## 环境要求
- Node.js >= 16
- Python >= 3.8
- Docker >= 20.10
- Docker Compose >= 2.0
- PostgreSQL >= 13
- Redis >= 6

## 快速开始

### 使用Docker Compose（推荐）

1. 克隆项目
```bash
git clone <repository-url>
cd CarbonEmissions
```

2. 配置环境变量
```bash
# 复制环境变量模板
cp backend-node/.env.example backend-node/.env
```

3. 启动服务
```bash
docker-compose up -d
```

服务启动后可通过以下地址访问：
- 前端页面：http://localhost:3000
- Node.js API：http://localhost:3001
- Python API：http://localhost:8000
- Swagger文档：http://localhost:3001/api/docs

### 本地开发环境

1. 前端开发
```bash
cd frontend
npm install
npm run dev
```

2. Node.js后端开发
```bash
cd backend-node
npm install
npm run start:dev
```

3. Python后端开发
```bash
cd backend-python
python -m venv venv
source venv/bin/activate  # Windows使用: .\venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn app.main:app --reload
```

## 主要功能模块

### 1. 用户权限管理
- 用户认证与授权
- 基于RBAC的权限控制
- 动态菜单配置

### 2. 碳数据管理
- 数据采集与录入
- 历史数据查询
- 数据可视化展示

### 3. 智能预测分析
- 碳趋势预测
- 多维度数据分析
- 预警阈值设置

### 4. 实时监控
- 实时数据展示
- 异常情况告警
- 数据推送服务

## 开发规范
- 代码规范：ESLint + Prettier
- 提交规范：Conventional Commits
- 分支管理：Git Flow

## 测试
```bash
# 前端测试
cd frontend
npm run test

# Node.js后端测试
cd backend-node
npm run test

# Python后端测试
cd backend-python
python -m pytest
```

## 部署

### 生产环境部署
1. 构建镜像
```bash
docker-compose build
```

2. 启动服务
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### 扩展部署（可选）
- 使用Kubernetes进行容器编排
- 配置CI/CD自动化部署
- 设置监控和日志系统

## 贡献指南
1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 提交Pull Request

## 许可证
[MIT License](LICENSE)