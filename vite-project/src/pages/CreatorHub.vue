<template>
  <div class="container">
    <h1 class="title">AI 智能体创造中心</h1>
    <p class="subtitle">选择你想做的 AI 项目，开始创造属于你的 AI 小伙伴。</p>

    <!-- ------------------ 基础三个项目 ------------------ -->
    <div class="cards">
      <div class="card" @click="goCreate('study-companion')">
        <h2>AI 学习伴侣</h2>
        <p>语文 / 数学 / 英语任选其一，AI 帮你制定学习计划、出题、讲解难题。</p>
      </div>

      <div class="card" @click="goCreate('memory-system')">
        <h2>AI 记忆系统生成器</h2>
        <p>从知识点生成记忆卡片 + 自测题，提升学习效率。</p>
      </div>

      <div class="card" @click="goCreate('goal-navigator')">
        <h2>AI 目标导航员</h2>
        <p>根据兴趣与优势，绘制未来成长路线图。</p>
      </div>
    </div>

    <!-- 作品展示墙 -->
    <router-link class="link-gallery" to="/gallery">
      查看同学们的 AI 作品墙 →
    </router-link>

    <hr class="divider" />

    <!-- ==================== 🆕 AI 单词机入口 ==================== -->
    <section class="section">
      <h2 class="section-title">📘 AI 单词机 · 我的专属词汇教练</h2>
      <p class="section-desc">
        个性化学习方式：从单词库 → 记忆方式 → AI 规划 → 语音闯关 → 错词复习，
        5 天内做出属于你自己的单词训练系统。
      </p>

      <button class="btn-blue" @click="goWordMachine">
        🚀 进入 AI 单词机（配置 & 训练）
      </button>
    </section>

    <hr class="divider" />

    <!-- ==================== 🆕 AI 小助手创作工坊 ==================== -->
    <section class="section">
      <h2 class="section-title">🎨 AI 小助手创作工坊</h2>
      <p class="section-desc">
        想自己做一个 AI 工具？你可以在这里为它设定名字、头像、主题色、性格，
        创造独一无二的 AI 小伙伴。
      </p>
      <button class="btn-orange" @click="goAgentBuilder">
        ✨ 开始创建我的 AI 小助手
      </button>
    </section>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();

// 原本项目入口
function goCreate(type) {
  router.push({ name: "ProjectCreate", query: { type } });
}

// 🆕 跳到 AI 单词机配置 / 训练中心
function goWordMachine() {
  router.push("/word-builder");
}

// 🆕 跳到 AI 小助手创作工坊
function goAgentBuilder() {
  router.push("/agent-builder");
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 40px 16px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  margin-bottom: 8px;
}

.subtitle {
  color: #555;
  margin-bottom: 24px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
  margin-bottom: 24px;
}

.card {
  border-radius: 12px;
  padding: 18px;
  border: 1px solid #e5e7eb;
  cursor: pointer;
  background: #fff;
  transition: 0.25s;
}

.card:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.07);
}

.link-gallery {
  display: inline-block;
  margin-top: 10px;
  color: #2563eb;
}

.divider {
  margin: 36px 0;
  border: none;
  background: #e5e7eb;
  height: 1px;
}

.section {
  text-align: center;
  padding: 20px;
  background: #f7fafc;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
}

.section-desc {
  max-width: 620px;
  font-size: 15px;
  color: #555;
  margin: 0 auto 14px;
  line-height: 1.6;
}

.btn-blue,
.btn-orange {
  padding: 10px 22px;
  font-size: 15px;
  border-radius: 999px;
  border: none;
  color: white;
  cursor: pointer;
}

.btn-blue {
  background: #3182ce;
}
.btn-blue:hover {
  background: #2b6cb0;
}

.btn-orange {
  background: #ed8936;
}
.btn-orange:hover {
  background: #dd6b20;
}
</style>
