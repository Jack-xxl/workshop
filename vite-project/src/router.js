// src/router.js
import { createRouter, createWebHistory } from "vue-router";
import { getAuthToken, isAuthenticated } from "./services/authService";
import { fetchWithAuth } from "./services/api";

import Login from "./pages/Login.vue";

import Home from "./pages/Home.vue";
import Faq from "./pages/Faq.vue";
import Courses from "./pages/Courses.vue";
import Showcase from "./pages/Showcase.vue";
import Incubation from "./pages/Incubation.vue";
import Signup from "./pages/Signup.vue";
import Trial from "./pages/Trial.vue";
import About from "./pages/About.vue";
import AskAi from "./pages/AskAi.vue";

// 👉 AI 创变营相关
import CreatorHub from "./pages/CreatorHub.vue";          // AI 智能体创造中心（项目选择）
import ProjectCreate from "./pages/ProjectCreate.vue";    // 创建具体项目
import ProjectGallery from "./pages/ProjectGallery.vue";  // AI 作品展示墙
import ProjectDetail from "./pages/ProjectDetail.vue";    // 单个作品详情

// 👉 学习专用对话界面（听说读写 + 错题本）
import StudyAgent from "./pages/StudyAgent.vue";

// 👉 AI 小助手创作工坊
import AgentBuilder from "./pages/AgentBuilder.vue";

// 👉 AI 单词机：配置向导 + 训练中心
import WordBuilder from "./pages/WordMachineBuilder.vue";
import WordTrainer from "./pages/WordTrainer.vue";

// 👉 学习版 Playground（孩子可以改代码）
import Playground from "./pages/Playground.vue";

const routes = [
  { path: "/login", component: Login, meta: { requiresAuth: false } },

  { path: "/", component: Home, meta: { requiresAuth: true } },
  { path: "/faq", component: Faq, meta: { requiresAuth: true } },
  { path: "/courses", component: Courses, meta: { requiresAuth: true } },
  { path: "/showcase", component: Showcase, meta: { requiresAuth: true } },
  { path: "/incubation", component: Incubation, meta: { requiresAuth: true } },
  { path: "/signup", component: Signup, meta: { requiresAuth: true } },
  { path: "/trial", component: Trial, meta: { requiresAuth: true } },
  { path: "/about", component: About, meta: { requiresAuth: true } },
  { path: "/ai-ask", component: AskAi, meta: { requiresAuth: true } },

  // AI 智能体创造中心
  {
    path: "/creator",
    name: "CreatorHub",
    component: CreatorHub,
    meta: { requiresAuth: true },
  },

  // 创建具体 AI 项目
  {
    path: "/creator/create",
    name: "ProjectCreate",
    component: ProjectCreate,
    meta: { requiresAuth: true },
  },

  // AI 作品展示墙
  {
    path: "/gallery",
    name: "ProjectGallery",
    component: ProjectGallery,
    meta: { requiresAuth: true },
  },

  // 单个 AI 作品详情
  {
    path: "/project/:id",
    name: "ProjectDetail",
    component: ProjectDetail,
    meta: { requiresAuth: true },
  },

  // 学习型 AI 助手：听说读写 + 错题本
  {
    path: "/study-agent",
    name: "StudyAgent",
    component: StudyAgent,
    meta: { requiresAuth: true },
  },

  // AI 小助手创作工坊
  {
    path: "/agent-builder",
    name: "AgentBuilder",
    component: AgentBuilder,
    meta: { requiresAuth: true },
  },

  // AI 单词机：配置向导
  {
    path: "/word-builder",
    name: "WordBuilder",
    component: WordBuilder,
    meta: { requiresAuth: true },
  },

  // AI 单词机：训练中心
  {
    path: "/word-trainer",
    name: "WordTrainer",
    component: WordTrainer,
    meta: { requiresAuth: true },
  },

  // 学习版 Playground
  {
    path: "/playground",
    name: "Playground",
    component: Playground,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Authentication guard
router.beforeEach(async (to, from, next) => {
  const token = getAuthToken();
  // Check if route requires authentication (defaults to true if not specified)
  const requiresAuth = to.matched.some(
    (record) => record.meta.requiresAuth !== false
  );

  // Public routes (e.g. /login)
  if (!requiresAuth) {
    // If already logged in and trying to access login, go home
    if (to.path === "/login" && token && isAuthenticated()) {
      return next({ path: "/" });
    }
    return next();
  }

  // No token or expired token → force login
  if (!token || !isAuthenticated()) {
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }

  // Server check: has username/password changed (authVersion mismatch)?
  // Server check: has username/password changed (authVersion mismatch)?
  try {
    const resp = await fetchWithAuth("/api/auth/me");

    if (!resp.ok) {
      throw new Error("Unauthorized");
    }

    // Token is valid on server → allow navigation
    return next();
  } catch (e) {
    // Backend rejected token (e.g. after password/username change)
    localStorage.removeItem("authToken");
    localStorage.removeItem("currentUser");
    return next({ path: "/login", query: { redirect: to.fullPath } });
  }
});

export default router;
