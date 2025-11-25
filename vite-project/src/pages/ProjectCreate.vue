<!-- vite-project/src/pages/ProjectCreate.vue -->
<template>
  <div class="container">
    <h1 class="title">创建我的 AI 项目</h1>
    <p class="subtitle">根据提示填写信息，AI 会为你生成个性化的方案。</p>

    <form class="form" @submit.prevent="handleAsk">
      <div class="field">
        <label>项目类型</label>
        <select v-model="form.type">
          <option value="study-companion">AI 学习伴侣</option>
          <option value="memory-system">AI 记忆系统生成器</option>
          <option value="goal-navigator">AI 目标导航员</option>
        </select>
      </div>

      <div class="field" v-if="form.type === 'study-companion'">
        <label>学科</label>
        <select v-model="form.subject">
          <option value="语文">语文</option>
          <option value="数学">数学</option>
          <option value="英语">英语</option>
        </select>
      </div>

      <div class="field">
        <label>项目标题（会显示在作品墙上）</label>
        <input v-model="form.title" placeholder="例如：我的 AI 英语学习小助手" required />
      </div>

      <div class="field">
        <label>想让 AI 帮你解决什么问题？</label>
        <textarea
          v-model="form.goal"
          rows="3"
          placeholder="例如：记单词太容易忘，希望 AI 帮我制定计划和测验。"
        ></textarea>
      </div>

      <div class="field">
        <label>你的年级 / 年龄（可选）</label>
        <input v-model="form.age" placeholder="例如：12" />
      </div>

      <button class="btn-primary" type="submit" :disabled="loading">
        {{ loading ? "AI 正在思考..." : "让 AI 生成方案" }}
      </button>
    </form>

    <div v-if="aiResult" class="result">
      <h2>AI 生成的方案</h2>
      <pre>{{ aiResult }}</pre>

      <div class="field">
        <label>可以在这里微调 / 补充你的作品内容：</label>
        <textarea v-model="form.content" rows="8"></textarea>
      </div>

      <button class="btn-secondary" @click="handleSave" :disabled="saving">
        {{ saving ? "保存中..." : "保存并发布到作品墙" }}
      </button>
      <p v-if="saveMessage" class="save-msg">{{ saveMessage }}</p>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const form = reactive({
  type: "study-companion",
  subject: "语文",
  title: "",
  goal: "",
  age: "",
  content: "",
});

const loading = ref(false);
const saving = ref(false);
const aiResult = ref("");
const saveMessage = ref("");

onMounted(() => {
  const t = route.query.type;
  if (t === "memory-system" || t === "goal-navigator") {
    form.type = t;
  }
});

async function handleAsk() {
  loading.value = true;
  saveMessage.value = "";
  aiResult.value = "";
  form.content = "";

  let question = "";
  if (form.type === "study-companion") {
    question = `请作为学习教练，帮我在【${form.subject}】学科上实现目标：${form.goal}`;
  } else if (form.type === "memory-system") {
    question = `请帮我把下面需要记忆的内容，设计成记忆卡片和自测题，并给出复习建议：${form.goal}`;
  } else if (form.type === "goal-navigator") {
    question = `请作为成长目标导航员，根据我的兴趣和困惑给出未来方向建议：${form.goal}`;
  }

  try {
    const res = await fetch("/api/ask", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        question,
        age: form.age,
      }),
    });
    const data = await res.json();
    aiResult.value = data.answer || "AI 没有返回内容，请稍后再试～";
    form.content = aiResult.value; // 默认先填进去，孩子可以再改
  } catch (e) {
    console.error(e);
    aiResult.value = "调用 AI 失败，请检查网络或稍后重试。";
  } finally {
    loading.value = false;
  }
}

async function handleSave() {
  if (!form.title) {
    alert("请填写作品标题");
    return;
  }
  saving.value = true;
  saveMessage.value = "";

  try {
    const res = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: form.title,
        author: "营员同学", // 后期可替换成登录账号名
        type: form.type,
        subject: form.subject,
        summary: form.goal,
        content: form.content,
      }),
    });
    const data = await res.json();
    if (data.success) {
      saveMessage.value = "作品已保存并发布！现在可以前往作品墙查看。";
      // 跳转到该作品详情页
      router.push({ name: "ProjectDetail", params: { id: data.project.id } });
    } else {
      saveMessage.value = data.error || "保存失败";
    }
  } catch (e) {
    console.error(e);
    saveMessage.value = "保存失败，请稍后再试。";
  } finally {
    saving.value = false;
  }
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
.subtitle {
  margin-bottom: 24px;
  color: #555;
}
.form {
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  padding: 20px;
  background: #fff;
}
.field {
  margin-bottom: 16px;
}
label {
  font-weight: 600;
  display: block;
  margin-bottom: 4px;
}
input,
select,
textarea {
  width: 100%;
  padding: 8px 10px;
  border-radius: 8px;
  border: 1px solid #d1d5db;
  font-size: 14px;
}
.btn-primary,
.btn-secondary {
  border: none;
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
}
.btn-primary {
  background: #2563eb;
  color: #fff;
}
.btn-secondary {
  margin-top: 12px;
  background: #10b981;
  color: #fff;
}
.result {
  margin-top: 24px;
  padding: 20px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #f9fafb;
}
pre {
  white-space: pre-wrap;
  background: #111827;
  color: #f9fafb;
  padding: 12px;
  border-radius: 8px;
  font-size: 13px;
  margin-bottom: 12px;
}
.save-msg {
  margin-top: 8px;
  color: #16a34a;
}
</style>
