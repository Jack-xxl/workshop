<!-- vite-project/src/pages/ProjectDetail.vue -->
<template>
  <div class="container" v-if="project">
    <h1 class="title">{{ project.title }}</h1>
    <p class="meta">
      类型：{{ mapType(project.type) }}
      <span v-if="project.subject"> · 学科：{{ project.subject }}</span>
    </p>
    <p class="meta">创作者：{{ project.author }} · 创建时间：{{ formatDate(project.createdAt) }}</p>

    <div class="block">
      <h2>项目目标</h2>
      <p>{{ project.summary }}</p>
    </div>

    <div class="block">
      <h2>AI 生成与孩子完善后的内容</h2>
      <pre>{{ project.content }}</pre>
    </div>

    <router-link class="back" to="/gallery">← 返回作品墙</router-link>
  </div>

  <div v-else class="container">作品加载中或不存在。</div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const project = ref(null);

onMounted(loadProject);

async function loadProject() {
  try {
    const res = await fetch(`/api/projects/${route.params.id}`);
    if (!res.ok) return;
    project.value = await res.json();
  } catch (e) {
    console.error(e);
  }
}

function mapType(t) {
  if (t === "study-companion") return "AI 学习伴侣";
  if (t === "memory-system") return "AI 记忆系统";
  if (t === "goal-navigator") return "AI 目标导航员";
  return t;
}

function formatDate(d) {
  if (!d) return "";
  return new Date(d).toLocaleString();
}
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 32px 16px;
}
.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}
.meta {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 4px;
}
.block {
  margin-top: 20px;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
}
pre {
  white-space: pre-wrap;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 13px;
}
.back {
  display: inline-block;
  margin-top: 16px;
  color: #2563eb;
}
</style>
