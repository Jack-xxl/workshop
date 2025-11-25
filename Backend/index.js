// backend/index.js —— 后端入口（CommonJS）

const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiting");

// 路由模块
const askRouter = require("./routes/askai");      // 英语/学习问答
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
app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
  console.log(`FRONTEND_URL allowed origin: ${FRONTEND_URL}`);
});
