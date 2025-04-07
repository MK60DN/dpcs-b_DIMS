# 分布式库存调拨系统安装与配置指南

本文档提供了基于[MK60DN/dpcs-b](https://github.com/MK60DN/dpcs-b)仓库开发的分布式库存调拨系统的安装、配置和部署指南。该系统采用DPCS-B（双路径协调系统）架构。

## 系统需求

### 开发环境
- Node.js 18.x 或更高版本
- npm 9.x 或更高版本
- Git

### 生产环境
- 现代浏览器 (Chrome、Edge、Firefox、Safari)
- 服务器要求：
  - CPU: 至少4核心
  - 内存: 至少8GB RAM
  - 存储: 至少50GB可用空间
  - 操作系统: Ubuntu 22.04 LTS 或 CentOS 8+

## 安装步骤

### 1. 获取源代码

首先克隆项目代码库：

```bash
# 克隆仓库
git clone https://github.com/MK60DN/dpcs-b.git

# 进入项目目录
cd dpcs-b
```

### 2. 安装依赖

安装项目所需的所有依赖：

```bash
# 安装项目依赖
npm install
```

### 3. 配置环境变量

创建`.env`文件并配置必要的环境变量：

```bash
# 复制环境变量模板
cp .env.example .env

# 编辑环境变量
nano .env
```

需要配置的主要环境变量包括：

```
# API基础URL
REACT_APP_API_URL=https://api.dpcs-b.example.com/v1

# 认证配置
REACT_APP_AUTH_DOMAIN=your-auth-domain
REACT_APP_AUTH_CLIENT_ID=your-client-id

# 功能开关
REACT_APP_ENABLE_BLOCKCHAIN=true
REACT_APP_ENABLE_LLM=true
```

### 4. 启动开发服务器

启动本地开发服务器进行测试：

```bash
npm start
```

应用将在`http://localhost:3000`启动。

### 5. 构建生产版本

当准备部署到生产环境时，构建优化版本：

```bash
npm run build
```

构建后的文件将位于`build`目录中，可以部署到任何静态Web服务器。

## 系统配置

### 强化学习模块配置

左脑模块（强化学习）的主要配置参数位于`src/services/rlService.js`：

```javascript
// 学习率
learningRate: 0.1,

// 折扣因子
discountFactor: 0.9,

// 探索率
explorationRate: 0.2
```

这些参数可以通过系统设置界面进行调整，但以上是推荐的起始值。

### 语言模型配置

右脑模块（语言模型）的配置位于`src/services/llmService.js`：

```javascript
// 模型选择
model: "CAMEL Agent",

// 温度参数
temperature: 0.7,

// 最大令牌数
maxTokens: 1000
```

在生产环境中，需要将模型端点配置为实际的LLM API服务。

### 融合模块配置

信息融合模块的权重配置可以在系统设置中调整：

```javascript
// 左脑权重
leftWeight: 0.5,

// 右脑权重
rightWeight: 0.5,

// 融合策略
fusionStrategy: "加权平均"
```

### 区块链组件配置

要启用区块链功能，需要配置区块链节点信息：

```javascript
// 区块链网络URL
REACT_APP_BLOCKCHAIN_NODE=https://your-blockchain-node.example.com

// 合约地址
REACT_APP_CONTRACT_ADDRESS=0x1234...5678
```

## 部署指南

### 使用Docker部署

可以使用Docker容器部署DPCS-B系统：

#### 1. 构建Docker镜像

```bash
# 构建Docker镜像
docker build -t dpcs-b:latest .
```

#### 2. 运行容器

```bash
# 运行Docker容器
docker run -d -p 80:80 --name dpcs-b dpcs-b:latest
```

### 使用Nginx部署

#### 1. 构建生产版本

```bash
npm run build
```

#### 2. 配置Nginx

创建Nginx配置文件：

```nginx
server {
    listen 80;
    server_name your-domain.com;
    
    root /path/to/dpcs-b/build;
    index index.html;
    
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API代理配置(如果需要)
    location /api/ {
        proxy_pass https://api.dpcs-b.example.com/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

#### 3. 重启Nginx

```bash
sudo systemctl restart nginx
```

### 持续集成/持续部署

可以使用GitHub Actions或Jenkins设置CI/CD流程，以下是一个简单的GitHub Actions工作流示例：

```yaml
name: Deploy DPCS-B

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Setup Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          REACT_APP_API_URL: ${{ secrets.API_URL }}
          
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./build
```

## 集成指南

### 与库存管理系统集成

DPCS-B可以通过API与现有的库存管理系统集成。主要集成点包括：

1. **库存数据同步** - 定期从ERP系统导入库存水平和需求预测
2. **调拨执行** - 将系统生成的调拨决策推送回执行系统
3. **事件通知** - 将库存变动、补货到达等事件通知DPCS-B系统

### 与数据分析平台集成

可以将DPCS-B的决策结果和性能指标推送到数据分析平台：

1. **决策日志** - 记录所有调拨决策及其结果
2. **性能指标** - 跟踪服务水平、库存周转率等KPI
3. **模型评估** - 左右脑模块的预测准确度对比

## 测试指南

### 单元测试

运行单元测试以验证各模块功能：

```bash
npm test
```

### 端到端测试

使用Cypress进行端到端测试：

```bash
npm run test:e2e
```

### 性能测试

可以使用以下命令来运行性能测试套件：

```bash
npm run test:performance
```

## 故障排除

### 常见问题

1. **应用无法启动**
   - 检查Node.js版本是否符合要求
   - 验证所有依赖是否正确安装
   - 检查`.env`文件配置是否正确

2. **强化学习模块无响应**
   - 检查浏览器控制台是否有错误消息
   - 验证状态空间和动作空间配置
   - 可能需要增加迭代次数以获得更好的结果

3. **语言模型响应缓慢**
   - 检查API连接是否正常
   - 考虑减少`maxTokens`参数值
   - 可以降低`temperature`参数以获得更确定性的响应

4. **区块链连接失败**
   - 验证区块链节点是否可访问
   - 检查合约地址是否正确
   - 确保网络设置与目标区块链一致

### 日志收集

系统日志位于：

- 开发环境: 浏览器控制台
- 生产环境: `/var/log/dpcs-b/`(取决于部署方式)

可以使用以下命令查看Docker容器日志：

```bash
docker logs dpcs-b
```

## 更新与升级

### 升级步骤

1. 备份当前配置和数据
2. 拉取最新代码
3. 安装新依赖
4. 运行数据迁移脚本(如有)
5. 构建新版本
6. 部署新版本

```bash
# 备份
cp .env .env.backup

# 拉取最新代码
git pull origin main

# 更新依赖
npm install

# 构建
npm run build

# 部署(取决于您的部署方式)
```

## 安全注意事项

- 确保所有API通信使用HTTPS加密
- 实施适当的访问控制和认证机制
- 定期更新依赖以修复潜在的安全漏洞
- 避免在客户端存储敏感信息
- 实施CSRF和XSS防护措施

## 支持与资源

- 官方文档: [https://mk60dn.github.io/dpcs-b/docs](https://mk60dn.github.io/dpcs-b/docs)
- GitHub仓库: [https://github.com/MK60DN/dpcs-b](https://github.com/MK60DN/dpcs-b)
- 问题跟踪: [https://github.com/MK60DN/dpcs-b/issues](https://github.com/MK60DN/dpcs-b/issues)
- 社区论坛: [https://community.dpcs-b.example.com](https://community.dpcs-b.example.com)

## 贡献指南

我们欢迎社区贡献！请参阅[CONTRIBUTING.md](../CONTRIBUTING.md)文件了解如何参与项目开发。

## 许可证

DPCS-B系统采用MIT许可证，详见[LICENSE](../LICENSE)文件。