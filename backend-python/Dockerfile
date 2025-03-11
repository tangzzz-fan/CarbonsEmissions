FROM python:3.11-slim-bullseye

WORKDIR /app

# 使用国内镜像源并安装系统依赖
RUN sed -i 's/deb.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && \
    sed -i 's/security.debian.org/mirrors.ustc.edu.cn/g' /etc/apt/sources.list && \
    apt-get update && \
    apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# 复制依赖文件
COPY requirements.txt .

# 使用国内 PyPI 镜像源安装 Python 依赖
RUN pip install -i https://pypi.tuna.tsinghua.edu.cn/simple --no-cache-dir -r requirements.txt

# 复制源代码
COPY . .

# 设置环境变量
ENV PYTHONUNBUFFERED=1 \
    PYTHONPATH=/app

EXPOSE 8000

# 启动 FastAPI 服务
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]