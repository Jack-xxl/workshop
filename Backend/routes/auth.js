// backend/routes/auth.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { readJson, writeJson } = require("../utils/jsonDb");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const USERS_FILE = "users.json";

// 生成 token
function signToken(user) {
  return jwt.sign(
    {
      id: user.id,
      username: user.username,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 注册
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名和密码不能为空" });
    }

    const users = readJson(USERS_FILE);

    if (users.find((u) => u.username === username)) {
      return res
        .status(400)
        .json({ ok: false, error: "该用户名已被占用" });
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = {
      id: Date.now().toString(), // 简单 id
      username,
      passwordHash: hash,
      createdAt: new Date().toISOString(),
    };
    users.push(newUser);
    writeJson(USERS_FILE, users);

    const token = signToken(newUser);
    res.json({
      ok: true,
      token,
      user: { id: newUser.id, username: newUser.username },
    });
  } catch (err) {
    console.error("register error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

// 登录
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名和密码不能为空" });
    }

    const users = readJson(USERS_FILE);
    const user = users.find((u) => u.username === username);
    if (!user) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名或密码错误" });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名或密码错误" });
    }

    const token = signToken(user);
    res.json({
      ok: true,
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (err) {
    console.error("login error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

// 中间件：校验 token，用在需要登录的接口上
function authMiddleware(req, res, next) {
  const auth = req.headers.authorization || "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
  if (!token) {
    return res.status(401).json({ ok: false, error: "未登录" });
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload; // { id, username }
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "登录已失效，请重新登录" });
  }
}

// 当前登录用户信息
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    user: { id: req.user.id, username: req.user.username },
  });
});

module.exports = { router, authMiddleware };
