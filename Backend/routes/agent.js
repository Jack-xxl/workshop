// backend/routes/agent.js
// Lily 专属学习伙伴路由：文字对话 + 图片上传（通义 Qwen / Qwen-VL）

const express = require("express");
const router = express.Router();
const path = require("path");
const fs = require("fs");
const multer = require("multer");
const { chatWithAgent } = require("../services/qwenService");

// --------- 静态目录：uploads，保存题目 / 笔记照片 ----------
const uploadDir = path.join(__dirname, "..", "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// multer 本地存储配置
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname) || ".jpg";
    const basename = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${basename}${ext}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

// 计算对外可访问的基地址，比如 http://localhost:3100
function getBaseUrl(req) {
  if (process.env.BASE_URL) return process.env.BASE_URL.replace(/\/$/, "");
  const protocol = req.protocol || "http";
  const host = req.get("host") || "localhost:3100";
  return `${protocol}://${host}`;
}

// =============== 图片上传：返回可访问的图片 URL ===============
router.post("/upload-image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "没有收到图片文件" });
  }

  const base = getBaseUrl(req);
  const imageUrl = `${base}/uploads/${req.file.filename}`;

  console.log("[UPLOAD] saved:", imageUrl);

  res.json({ url: imageUrl });
});

// =============== 聊天：文字 + 可选图片 URL ===================
router.post("/chat", async (req, res) => {
  try {
    const { text, mode, imageUrl } = req.body || {};

    if (!text || typeof text !== "string") {
      return res.status(400).json({ error: "缺少 text 参数" });
    }

    const answer = await chatWithAgent({
      text,
      mode: mode || "speaking",
      imageUrl: imageUrl || null,
    });

    return res.json({ answer });
  } catch (err) {
    console.error("[Agent chat error]", err);
    // 为了前端不再走“开小差了”的兜底，这里也返回 200，只在文案里说明问题
    return res.json({
      answer:
        "现在批改接口有一点小问题（" +
        (err.message || "未知错误") +
        "），你可以先把图片里的英文内容用文字打出来，我也可以帮你逐句修改～",
    });
  }
});

module.exports = router;
