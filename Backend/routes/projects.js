// backend/routes/projects.js —— 存储与读取 AI 作品的小路由
const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

// 简单用一个 JSON 文件存作品；后期你想换 MongoDB 很容易
const DATA_FILE = path.join(__dirname, "..", "data", "projects.json");

// 确保 data 目录和文件存在
function ensureDataFile() {
  const dir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DATA_FILE)) fs.writeFileSync(DATA_FILE, "[]", "utf-8");
}

function readProjects() {
  ensureDataFile();
  const raw = fs.readFileSync(DATA_FILE, "utf-8");
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("parse projects.json error:", e);
    return [];
  }
}

function writeProjects(list) {
  ensureDataFile();
  fs.writeFileSync(DATA_FILE, JSON.stringify(list, null, 2), "utf-8");
}

/**
 * GET /api/projects
 * 获取全部作品列表（展示墙用）
 */
router.get("/", (req, res) => {
  const projects = readProjects();
  // 后期可以在这里做过滤：只返回 status === 'approved' 的
  res.json(projects);
});

/**
 * GET /api/projects/:id
 * 获取单个作品详情
 */
router.get("/:id", (req, res) => {
  const projects = readProjects();
  const p = projects.find((x) => String(x.id) === String(req.params.id));
  if (!p) return res.status(404).json({ error: "project not found" });
  res.json(p);
});

/**
 * POST /api/projects
 * 新增一个作品
 * body: { title, author, type, subject, summary, content }
 */
router.post("/", (req, res) => {
  const { title, author, type, subject, summary, content } = req.body || {};

  if (!title || !type) {
    return res.status(400).json({ error: "title 和 type 必填" });
  }

  const projects = readProjects();
  const now = new Date();

  const project = {
    id: Date.now(), // 简单唯一ID，够这个平台用
    title,
    author: author || "营员同学",
    type, // 'study-companion' | 'memory-system' | 'goal-navigator' ...
    subject: subject || "",
    summary: summary || "",
    content: content || "",
    status: "approved", // 先默认通过；后期可改成 pending，配老师审核
    createdAt: now.toISOString(),
  };

  projects.push(project);
  writeProjects(projects);

  res.json({ success: true, project });
});

module.exports = router;