<!-- vite-project/src/pages/ProjectGallery.vue -->
<template>
  <div class="container">
    <h1 class="title">AI 作品展示墙</h1>
    <p class="subtitle">这里展示的是营员们亲手创造的 AI 项目。</p>

    <div v-if="loading">加载中...</div>

    <div v-else-if="projects.length === 0">暂时还没有作品，快去创建一个吧！</div>

    <div class="grid" v-else>
      <div
        v-for="p in projects"
        :key="p.id"
        class="card"
        @click="goDetail(p.id)"
      >
        <h2>{{ p.title }}</h2>
        <p class="meta">
          类型：{{ mapType(p.type) }}
          <span v-if="p.subject"> · 学科：{{ p.subject }}</span>
        </p>
        <p class="summary">{{ p.summary }}</p>
        <p class="date">{{ formatDate(p.createdAt) }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { fetchWithAuth } from "../services/api";

const router = useRouter();
const projects = ref([]);
const loading = ref(false);

onMounted(loadProjects);

async function loadProjects() {
  loading.value = true;
  try {
    const res = await fetchWithAuth("/api/projects");
    const data = await res.json();
    projects.value = Array.isArray(data)
      ? data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      : [];
  } catch (e) {
    console.error(e);
  } finally {
    loading.value = false;
  }
}

function goDetail(id) {
  router.push({ name: "ProjectDetail", params: { id } });
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
  max-width: 960px;
  margin: 0 auto;
  padding: 32px 16px;
}
.title {
  font-size: 26px;
  font-weight: 700;
  margin-bottom: 8px;
}
.subtitle {
  margin-bottom: 24px;
  color: #555;
}
.grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 16px;
}
.card {
  border-radius: 12px;
  background: #fff;
  border: 1px solid #e5e7eb;
  padding: 16px;
  cursor: pointer;
  transition: 0.2s;
}
.card:hover {
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.06);
  transform: translateY(-3px);
}
.meta {
  color: #6b7280;
  font-size: 13px;
  margin-bottom: 4px;
}
.summary {
  font-size: 14px;
  margin-bottom: 6px;
}
.date {
  font-size: 12px;
  color: #9ca3af;
}
</style>
