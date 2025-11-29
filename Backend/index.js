// backend/index.js —— 后端入口（CommonJS）

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiting");
const { router: authRouter, authMiddleware } = require("./routes/auth");

// 路由模块
const askRouter = require("./routes/askAI");      // 英语/学习问答
const projectRouter = require("./routes/projects"); // AI 作品存储
const agentRouter = require("./routes/agent");     // StudyAgent：语音/图片/聊天
const wordsRouter = require("./routes/words");     // 单词机：故事/词族/测验/总结

// =======================
// 🆕 Playground 路由（学生可运行 JS 代码）
// =======================
const vm = require("vm");

const app = express();

// 端口 & 前端来源
const PORT = Number(process.env.PORT) || 3100;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 安全中间件
app.use(
  helmet({
    contentSecurityPolicy: false,
  })
);

// CORS（开发兼容 5174 / 3000）
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 频率限制 & body 解析
app.use(apiLimiter);
app.use(express.json({ limit: "10mb" }));

// 静态托管上传图片
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =======================
// 🔐 认证路由（必须在中间件之前，允许未登录访问）
// =======================
app.use("/api/auth", authRouter);

// =======================
// 🛡️ 认证中间件：保护所有 API 路由（除了 /api/auth/login 和 /health）
// =======================
app.use((req, res, next) => {
  // 允许访问登录接口和健康检查
  if (req.path === "/api/auth/login" || req.path === "/health") {
    return next();
  }
  // 允许访问静态文件
  if (req.path.startsWith("/uploads/")) {
    return next();
  }
  // 其他所有 API 路由都需要认证
  if (req.path.startsWith("/api/") || req.path.startsWith("/ask")) {
    return authMiddleware(req, res, next);
  }
  next();
});

// =======================
// 🧩 业务路由
// =======================

// 1）AI 问答（原来的接口）
app.use("/api/ask", askRouter);
app.use("/ask", askRouter); // 兼容旧地址

// 2）AI 项目/作品
app.use("/api/projects", projectRouter);

// 3）学习 Agent（口语/听力/图片）
app.use("/api/agent", agentRouter);

// 4）单词机（故事 / 词族 / 测验 / 鼓励语）
app.use("/api/words", wordsRouter);


// ===============================
// 🆕 Playground：让学生运行 JS 代码
// POST /api/playground/run
// body: { code: "..." }
// ===============================
app.post("/api/playground/run", (req, res) => {
  const { code } = req.body || {};

  if (!code || typeof code !== "string") {
    return res.status(400).json({
      ok: false,
      error: "缺少 code 字段",
    });
  }

  try {
    /**
     * 用 Node.js 的 vm 模块执行学生代码：
     * - 禁止 require
     * - 禁止访问文件系统
     * - 禁止访问全局对象
     * - 只能返回 audioConfig 或用户定义的对象
     */
    const sandbox = {};
    const context = vm.createContext(sandbox);

    const wrapped = `
      (function() {
        "use strict";
        ${code}
        if (typeof audioConfig === "undefined") {
          throw new Error("必须定义 audioConfig");
        }
        return audioConfig;
      })()
    `;

    const result = vm.runInContext(wrapped, context, {
      timeout: 200, // 防止死循环
    });

    res.json({
      ok: true,
      result,
    });

  } catch (err) {
    console.error("Playground code error:", err);
    res.status(400).json({
      ok: false,
      error: err.message || "代码执行失败",
    });
  }
});


// =======================
// 健康检查
// =======================
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// =======================
// 404
// =======================
app.use("*", (req, res) => {
  res.status(404).json({
    error: "Not Found",
    path: req.originalUrl,
  });
});

// =======================
// 启动服务
// =======================
const server = app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`FRONTEND_URL allowed origin: ${FRONTEND_URL}`);
});

// 处理端口占用错误
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Error: Port ${PORT} is already in use!`);
    console.error(`\nTo fix this, you can:`);
    console.error(`1. Stop the existing process using port ${PORT}:`);
    console.error(`   netstat -ano | findstr ":${PORT}"`);
    console.error(`   Then kill the process: Stop-Process -Id <PID> -Force`);
    console.error(`\n2. Or use a different port by setting PORT in .env file`);
    console.error(`\n3. Or run this PowerShell command to find and kill the process:`);
    console.error(`   Get-NetTCPConnection -LocalPort ${PORT} | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }`);
    process.exit(1);
  } else {
    console.error('Server error:', err);
    process.exit(1);
  }
});
