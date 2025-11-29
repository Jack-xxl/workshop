# ParentNavBackend 教育顾问接口系统

## 启动方式：

1. 打开终端，进入项目目录
2. 安装依赖（如需要）：
   ```
   npm install
   ```
3. 配置环境变量（见下方说明）
4. 启动项目：
   ```
   node index.js
   ```

## 环境变量配置

在 `Backend/.env` 文件中配置以下环境变量：

### 必需变量

- `QIANWEN_API_KEY`: 通义千问 API 密钥（从 https://dashscope.aliyuncs.com/ 获取）

### 认证变量（单用户登录系统）

- `ADMIN_USERNAME`: 共享用户名（默认: "admin"）
- `ADMIN_PASSWORD`: 共享密码（默认: "changeme" - **请务必修改！**）

**⚠️ 重要：** 默认密码仅用于开发环境。在生产环境中，请务必设置强密码！

### 可选变量

- `PORT`: 服务器端口（默认: 3100）
- `FRONTEND_URL`: 前端地址，用于 CORS（默认: "http://localhost:5173"）
- `JWT_SECRET`: JWT 令牌密钥（默认: "dev-secret-change-me"）

### 示例 .env 文件

```env
# 通义千问 API 密钥
QIANWEN_API_KEY=sk-your-api-key-here

# 登录凭证（请修改为强密码！）
ADMIN_USERNAME=admin
ADMIN_PASSWORD=your-secure-password-here

# 服务器配置
PORT=3100
FRONTEND_URL=http://localhost:5173

# JWT 密钥（生产环境请使用随机字符串）
JWT_SECRET=your-jwt-secret-here
```

## 在 GitHub 或部署平台配置环境变量

### GitHub Secrets（用于 GitHub Actions）

1. 进入仓库的 Settings → Secrets and variables → Actions
2. 点击 "New repository secret"
3. 添加以下 secrets：
   - `ADMIN_USERNAME`
   - `ADMIN_PASSWORD`
   - `QIANWEN_API_KEY`
   - `JWT_SECRET`（可选）

### 部署平台（Vercel, Netlify, Railway 等）

在平台的环境变量设置中添加：
- `ADMIN_USERNAME`
- `ADMIN_PASSWORD`
- `QIANWEN_API_KEY`
- `JWT_SECRET`（可选）
- `PORT`（如果平台需要）

**注意：** 修改环境变量后，需要重启服务器才能生效。

## API 接口

### 认证接口

- `POST /api/auth/login` - 用户登录
  ```json
  {
    "username": "admin",
    "password": "your-password"
  }
  ```

- `GET /api/auth/me` - 获取当前用户信息（需要认证）

### 其他接口

所有其他 API 接口都需要在请求头中包含认证令牌：
```
Authorization: Bearer <token>
```

### 健康检查

- `GET /health` - 服务器健康状态（无需认证）
