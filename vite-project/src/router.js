// src/router.js
import { createRouter, createWebHistory } from "vue-router";

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
  // 不再需要登录，直接进入应用
  { path: "/login", redirect: "/" },

  { path: "/", component: Home },
  { path: "/faq", component: Faq },
  { path: "/courses", component: Courses },
  { path: "/showcase", component: Showcase },
  { path: "/incubation", component: Incubation },
  { path: "/signup", component: Signup },
  { path: "/trial", component: Trial },
  { path: "/about", component: About },
  { path: "/ai-ask", component: AskAi },

  {
    path: "/creator",
    name: "CreatorHub",
    component: CreatorHub,
  },

  {
    path: "/creator/create",
    name: "ProjectCreate",
    component: ProjectCreate,
  },

  {
    path: "/gallery",
    name: "ProjectGallery",
    component: ProjectGallery,
  },

  {
    path: "/project/:id",
    name: "ProjectDetail",
    component: ProjectDetail,
  },

  {
    path: "/study-agent",
    name: "StudyAgent",
    component: StudyAgent,
  },

  {
    path: "/agent-builder",
    name: "AgentBuilder",
    component: AgentBuilder,
  },

  {
    path: "/word-builder",
    name: "WordBuilder",
    component: WordBuilder,
  },

  {
    path: "/word-trainer",
    name: "WordTrainer",
    component: WordTrainer,
  },

  {
    path: "/playground",
    name: "Playground",
    component: Playground,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
