FROM node:18-alpine

WORKDIR /app

# 安装 python 和其他构建依赖
RUN apk add --no-cache python3 make g++ 

# 复制 package 文件
COPY package*.json ./

# 安装依赖
RUN npm install --legacy-peer-deps && \
    npm install -g @nestjs/cli && \
    npm cache clean --force

# 复制源代码和配置文件
COPY . .

# 构建
RUN npm run build

# 设置环境变量
ENV NODE_ENV=production \
    PORT=3001

EXPOSE 3001

# 启动应用
CMD ["npm", "run", "start:prod"]