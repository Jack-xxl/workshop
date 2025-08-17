// backend/index.js  —— CommonJS 版本
const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, ".env") });
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const { apiLimiter } = require("./middleware/rateLimiting");

const app = express();

// 端口 & 前端来源
const PORT = Number(process.env.PORT) || 3100;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// 安全中间件
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'"],
        scriptSrc: ["'self'"],
        imgSrc: ["'self'", "data:", "https:"],
      },
    },
  })
);

// CORS（开发时兼容 5174/3000）
app.use(
  cors({
    origin: [FRONTEND_URL, "http://localhost:5174", "http://localhost:3000"],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// 频率限制 & 解析
app.use(apiLimiter);
app.use(express.json({ limit: "10mb" }));

// 业务路由（同时挂 /api/ask 和 /ask，前端走 /api/ask）
const askRouter = require("./routes/askAI");
app.use("/api/ask", askRouter);
app.use("/ask", askRouter); // 兼容旧地址，可删

// 健康检查
app.get("/health", (req, res) => {
  res.json({ status: "OK", timestamp: new Date().toISOString(), uptime: process.uptime() });
});

// 404
app.use("*", (req, res) => res.status(404).json({ error: "Endpoint not found" }));

// 全局错误
app.use((err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === "production" ? "Internal server error" : err.message,
  });
});

// 启动日志
app.listen(PORT, () => {
  console.log(`API ready on http://localhost:${PORT}`);
  console.log(`[BOOT] FRONTEND_URL=${FRONTEND_URL}`);
  console.log(
    `[BOOT] QIANWEN_API_KEY loaded: ${
      !!process.env.QIANWEN_API_KEY || !!process.env.QWEN_API_KEY
    }`
  );
});