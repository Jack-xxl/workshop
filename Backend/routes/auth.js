// backend/routes/auth.js
// Single shared username/password authentication system
const express = require("express");
const jwt = require("jsonwebtoken");

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-change-me";
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "changeme";
const AUTH_VERSION = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}`;

// Warn if using default password
if (ADMIN_PASSWORD === "changeme") {
  console.warn("⚠️  WARNING: Using default password 'changeme'. Please set ADMIN_PASSWORD in .env file!");
}

// 生成 token（包含当前用户名/密码版本）
function signToken() {
  return jwt.sign(
    {
      username: ADMIN_USERNAME,
      authVersion: AUTH_VERSION,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// 登录
router.post("/login", (req, res) => {
  try {
    const { username, password } = req.body || {};
    if (!username || !password) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名和密码不能为空" });
    }

    // Validate against environment variables
    if (username !== ADMIN_USERNAME || password !== ADMIN_PASSWORD) {
      return res
        .status(400)
        .json({ ok: false, error: "用户名或密码错误" });
    }

    const token = signToken();
    res.json({
      ok: true,
      token,
      user: { username: ADMIN_USERNAME },
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
    // 如果 .env 中的用户名或密码已更改，则强制重新登录
    if (payload.authVersion !== AUTH_VERSION) {
      return res
        .status(401)
        .json({ ok: false, error: "登录信息已更新，请重新登录" });
    }
    req.user = payload; // { username, authVersion }
    next();
  } catch (e) {
    return res.status(401).json({ ok: false, error: "登录已失效，请重新登录" });
  }
}

// 当前登录用户信息
router.get("/me", authMiddleware, (req, res) => {
  res.json({
    ok: true,
    user: { username: req.user.username },
  });
});

module.exports = { router, authMiddleware };
