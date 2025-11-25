<!-- src/pages/AgentBuilder.vue -->
<template>
  <div class="builder-page" :class="themeClass">
    <header class="top">
      <h1>AI 小助手创作工坊</h1>
      <p class="sub">
        在这里，你可以亲手设计一个专属于你的 AI 学习小伙伴：给 TA 起名字、选头像、定性格，
        还可以选择 TA 擅长的技能（纠正口语、出听力、讲解作文……）。
      </p>
    </header>

    <main class="grid">
      <!-- 左侧：配置表单 -->
      <section class="panel">
        <h2>① 基本信息</h2>

        <div class="field">
          <label>你的昵称（可选）</label>
          <input
            v-model="profile.ownerName"
            type="text"
            placeholder="例如：Jack、小明、小星星……"
          />
        </div>

        <div class="field">
          <label>年级 / 阶段</label>
          <select v-model="profile.grade">
            <option value="primary">小学</option>
            <option value="middle">初中</option>
            <option value="high">高中</option>
            <option value="other">其他</option>
          </select>
        </div>

        <div class="field">
          <label>主要学习科目</label>
          <select v-model="profile.subject">
            <option value="english">英语</option>
            <option value="chinese">语文</option>
            <option value="math">数学</option>
            <option value="mixed">综合学习</option>
          </select>
        </div>

        <h2>② 给 AI 导师起名 & 形象</h2>

        <div class="field">
          <label>导师名字（你来起名）</label>
          <input
            v-model="profile.agentName"
            type="text"
            placeholder="例如：Lily、Max、Sunny 老师……"
          />
        </div>

        <div class="field">
          <label>头像风格</label>
          <div class="avatar-row">
            <button
              v-for="preset in avatarPresets"
              :key="preset.id"
              class="avatar-btn"
              :class="{ active: profile.avatarPreset === preset.id }"
              @click="profile.avatarPreset = preset.id"
            >
              <span class="emoji">{{ preset.emoji }}</span>
              <span class="label">{{ preset.label }}</span>
            </button>
          </div>
        </div>

        <div class="field">
          <label>自定义头像图片（选填，填网络图片地址即可）</label>
          <input
            v-model="profile.customAvatarUrl"
            type="text"
            placeholder="例如：https://.../my-avatar.png （没有可以先不填）"
          />
          <p class="hint">
            目前用网络图片地址。以后正式上线，可以支持手机本地上传。
          </p>
        </div>

        <h2>③ 导师性格 & 说话风格</h2>

        <div class="field">
          <label>导师性格</label>
          <div class="pill-row">
            <button
              v-for="opt in personaOptions"
              :key="opt.value"
              class="pill"
              :class="{ active: profile.persona === opt.value }"
              @click="profile.persona = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>中英比例（讲解语言风格）</label>
          <div class="pill-row">
            <button
              v-for="opt in languageModeOptions"
              :key="opt.value"
              class="pill"
              :class="{ active: profile.languageMode === opt.value }"
              @click="profile.languageMode = opt.value"
            >
              {{ opt.label }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>语音播报的语速 / 语调</label>
          <div class="pill-row">
            <button
              v-for="opt in voiceRateOptions"
              :key="opt.value"
              class="pill"
              :class="{ active: profile.voiceRate === opt.value }"
              @click="profile.voiceRate = opt.value"
            >
              语速：{{ opt.label }}
            </button>
          </div>

          <div class="pill-row">
            <button
              v-for="opt in voiceToneOptions"
              :key="opt.value"
              class="pill"
              :class="{ active: profile.voiceTone === opt.value }"
              @click="profile.voiceTone = opt.value"
            >
              语气：{{ opt.label }}
            </button>
          </div>
        </div>

        <div class="field">
          <label>导师座右铭 / 口号（出现在页面顶部）</label>
          <input
            v-model="profile.slogan"
            type="text"
            placeholder="例如：犯错，是进步的开始。"
          />
        </div>

        <h2>④ TA 擅长帮你做什么？</h2>

        <div class="skills">
          <label class="skill-item">
            <input v-model="profile.skills.speakingCorrection" type="checkbox" />
            <span>纠正口语：帮我改口语句子、打星级评分</span>
          </label>
          <label class="skill-item">
            <input v-model="profile.skills.listeningPractice" type="checkbox" />
            <span>听力练习：帮我出听力材料和问题</span>
          </label>
          <label class="skill-item">
            <input v-model="profile.skills.readingHelper" type="checkbox" />
            <span>阅读助手：讲解文章、生词和结构</span>
          </label>
          <label class="skill-item">
            <input v-model="profile.skills.writingCoach" type="checkbox" />
            <span>写作教练：批改作文，给出更高级表达</span>
          </label>
          <label class="skill-item">
            <input v-model="profile.skills.pronunciationCoach" type="checkbox" />
            <span>发音教练：帮我练句子/单词发音（结合语音识别）</span>
          </label>
        </div>

        <h2>⑤ 主题颜色（界面风格）</h2>
        <div class="pill-row">
          <button
            v-for="opt in themeOptions"
            :key="opt.value"
            class="pill"
            :class="{ active: profile.theme === opt.value }"
            @click="profile.theme = opt.value"
          >
            {{ opt.label }}
          </button>
        </div>

        <div class="actions">
          <button class="btn-primary" @click="saveProfile">
            ✅ 保存我的专属 AI 小助手
          </button>
          <button class="btn-text" @click="resetProfile">
            重置为默认
          </button>
        </div>
      </section>

      <!-- 右侧：实时预览 -->
      <section class="panel preview">
        <h2>实时预览：我的 AI 导师</h2>

        <div class="agent-card">
          <div class="header">
            <div class="avatar" :class="themeClass">
              <img
                v-if="profile.customAvatarUrl"
                :src="profile.customAvatarUrl"
                alt="avatar"
                class="avatar-img"
              />
              <span v-else>{{ avatarEmoji }}</span>
            </div>
            <div class="meta">
              <div class="name">{{ displayName }}</div>
              <div class="desc">{{ displayDesc }}</div>
              <div class="slogan" v-if="profile.slogan">
                「{{ profile.slogan }}」
              </div>
            </div>
          </div>

          <ul class="preview-list">
            <li>
              <strong>学习阶段：</strong>{{ gradeLabel }} ｜ 科目：{{ subjectLabel }}
            </li>
            <li>
              <strong>性格：</strong>{{ personaLabel }} ｜ 语言风格：{{ languageModeLabel }}
            </li>
            <li>
              <strong>语音播报：</strong>语速 {{ voiceRateLabel }} ，语气 {{ voiceToneLabel }}
            </li>
            <li>
              <strong>擅长技能：</strong>{{ skillsSummary }}
            </li>
          </ul>

          <p class="tip">
            保存后，在「英语 Lily 学习助手」里，你会看到这个导师的名字、头像和风格，并且可以直接用 TA 来练口语、做听力。
          </p>

          <router-link class="btn-secondary" to="/study-agent">
            去和 TA 聊聊 → 英语 Lily 学习助手
          </router-link>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";

const defaultProfile = {
  ownerName: "",
  grade: "middle",
  subject: "english",
  agentName: "Lily",
  avatarPreset: "cat",
  customAvatarUrl: "",
  persona: "warm",
  languageMode: "mix",
  voiceRate: "normal",
  voiceTone: "gentle",
  slogan: "",
  skills: {
    speakingCorrection: true,
    listeningPractice: true,
    readingHelper: true,
    writingCoach: true,
    pronunciationCoach: true,
  },
  theme: "blue",
};

const profile = ref(structuredClone(defaultProfile));

// 头像预设
const avatarPresets = [
  { id: "cat", emoji: "😺", label: "猫老师" },
  { id: "owl", emoji: "🦉", label: "猫头鹰导师" },
  { id: "robot", emoji: "🤖", label: "AI 机器人" },
  { id: "star", emoji: "🌟", label: "星星导师" },
];

// 性格
const personaOptions = [
  { value: "warm", label: "耐心温暖型" },
  { value: "energetic", label: "元气活泼型" },
  { value: "direct", label: "高效直接型" },
];

// 中英比例
const languageModeOptions = [
  { value: "cnMain", label: "中文为主，英文为辅" },
  { value: "mix", label: "中英混合讲解" },
  { value: "enMain", label: "英文为主，适合进阶" },
];

// 语速
const voiceRateOptions = [
  { value: "slow", label: "慢一点" },
  { value: "normal", label: "正常" },
  { value: "fast", label: "稍快" },
];

// 语气
const voiceToneOptions = [
  { value: "gentle", label: "温柔" },
  { value: "energetic", label: "有活力" },
  { value: "serious", label: "严谨" },
];

// 主题色
const themeOptions = [
  { value: "blue", label: "冷静蓝" },
  { value: "green", label: "治愈绿" },
  { value: "orange", label: "元气橙" },
  { value: "purple", label: "创意紫" },
];

onMounted(() => {
  try {
    const raw = localStorage.getItem("agentProfile");
    if (raw) {
      const saved = JSON.parse(raw);
      profile.value = { ...structuredClone(defaultProfile), ...saved };
    }
  } catch (e) {
    console.error("加载 agentProfile 失败", e);
  }
});

// 主题 class
const themeClass = computed(() => {
  return `theme-${profile.value.theme || "blue"}`;
});

// 预览字段
const displayName = computed(() => profile.value.agentName || "Lily");

const avatarEmoji = computed(() => {
  const preset = avatarPresets.find(
    (p) => p.id === profile.value.avatarPreset
  );
  return preset ? preset.emoji : "🤖";
});

const gradeLabel = computed(() => {
  const g = profile.value.grade;
  if (g === "primary") return "小学";
  if (g === "middle") return "初中";
  if (g === "high") return "高中";
  return "其他";
});

const subjectLabel = computed(() => {
  const s = profile.value.subject;
  if (s === "english") return "英语";
  if (s === "chinese") return "语文";
  if (s === "math") return "数学";
  return "综合";
});

const personaLabel = computed(() => {
  const p = personaOptions.find((x) => x.value === profile.value.persona);
  return p ? p.label : "耐心温暖型";
});

const languageModeLabel = computed(() => {
  const p = languageModeOptions.find(
    (x) => x.value === profile.value.languageMode
  );
  return p ? p.label : "中英混合";
});

const voiceRateLabel = computed(() => {
  const p = voiceRateOptions.find((x) => x.value === profile.value.voiceRate);
  return p ? p.label : "正常";
});

const voiceToneLabel = computed(() => {
  const p = voiceToneOptions.find((x) => x.value === profile.value.voiceTone);
  return p ? p.label : "温柔";
});

const skillsSummary = computed(() => {
  const s = profile.value.skills || {};
  const arr = [];
  if (s.speakingCorrection) arr.push("口语纠正");
  if (s.listeningPractice) arr.push("听力练习");
  if (s.readingHelper) arr.push("阅读讲解");
  if (s.writingCoach) arr.push("写作批改");
  if (s.pronunciationCoach) arr.push("发音训练");
  if (!arr.length) return "暂未选择，可在左侧勾选。";
  return arr.join("、");
});

// 描述
const displayDesc = computed(() => {
  const phase = gradeLabel.value;
  const subject = subjectLabel.value;
  return `${phase} · ${subject}学习 AI 导师`;
});

// 保存
function saveProfile() {
  try {
    localStorage.setItem("agentProfile", JSON.stringify(profile.value));
    alert("已保存你的专属 AI 小助手配置！在英语 Lily 学习助手里会自动生效。");
  } catch (e) {
    console.error("保存失败", e);
    alert("保存时出错，请稍后重试。");
  }
}

// 重置
function resetProfile() {
  if (!confirm("确认要重置为默认配置吗？")) return;
  profile.value = structuredClone(defaultProfile);
  localStorage.setItem("agentProfile", JSON.stringify(profile.value));
}
</script>

<style scoped>
.builder-page {
  max-width: 1100px;
  margin: 1.5em auto;
  padding: 1.5em 1.4em 1.8em;
  border-radius: 1.4em;
  background: #ffffff;
  box-shadow: 0 3px 18px rgba(0, 0, 0, 0.06);
}

.top h1 {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #1a202c;
}

.sub {
  font-size: 0.95rem;
  color: #4a5568;
  margin-bottom: 0.8rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1.5fr) minmax(0, 1.3fr);
  gap: 1rem;
  margin-top: 0.6rem;
}

.panel {
  border-radius: 1rem;
  padding: 0.9rem 1rem;
  background: #f9fafb;
  border: 1px solid #e2e8f0;
}

.panel h2 {
  font-size: 1.05rem;
  margin: 0.5rem 0 0.35rem;
}

.field {
  margin-bottom: 0.6rem;
}

.field label {
  display: block;
  font-size: 0.88rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
  color: #2d3748;
}

.field input,
.field select {
  width: 100%;
  border-radius: 0.6rem;
  border: 1px solid #cbd5e0;
  padding: 0.4rem 0.55rem;
  font-size: 0.9rem;
  outline: none;
  background: #ffffff;
}

.field input:focus,
.field select:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px rgba(49, 130, 206, 0.25);
}

.hint {
  font-size: 0.8rem;
  color: #718096;
  margin-top: 0.15rem;
}

.avatar-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.avatar-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  padding: 0.3rem 0.6rem;
  font-size: 0.85rem;
  cursor: pointer;
  background: #ffffff;
}

.avatar-btn .emoji {
  font-size: 1.1rem;
}

.avatar-btn.active {
  border-color: #3182ce;
  background: #ebf8ff;
}

.pill-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.pill {
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  padding: 0.3rem 0.9rem;
  font-size: 0.86rem;
  background: #ffffff;
  cursor: pointer;
}

.pill.active {
  border-color: #3182ce;
  background: #ebf8ff;
  color: #1a365d;
  font-weight: 600;
}

.skills {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.skill-item {
  display: flex;
  align-items: flex-start;
  gap: 0.35rem;
  font-size: 0.86rem;
  color: #4a5568;
}

.skill-item input {
  margin-top: 0.15rem;
}

.actions {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.6rem;
}

.btn-primary {
  border-radius: 999px;
  padding: 0.45rem 1.4rem;
  border: none;
  background: #3182ce;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}
.btn-primary:hover {
  background: #2b6cb0;
}

.btn-text {
  border: none;
  background: transparent;
  color: #718096;
  font-size: 0.85rem;
  cursor: pointer;
}
.btn-text:hover {
  color: #4a5568;
}

.preview {
  background: #ffffff;
}

.agent-card {
  border-radius: 1rem;
  border: 1px solid #e2e8f0;
  padding: 0.9rem 0.9rem 0.9rem;
  background: #f9fafb;
}

.agent-card .header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.5rem;
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #3182ce;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  color: #fff;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.meta .name {
  font-size: 1.2rem;
  font-weight: 700;
  color: #1a202c;
}

.meta .desc {
  font-size: 0.9rem;
  color: #4a5568;
}

.meta .slogan {
  font-size: 0.86rem;
  color: #2b6cb0;
  margin-top: 0.15rem;
}

.preview-list {
  list-style: none;
  padding-left: 0;
  margin: 0.4rem 0 0.4rem;
  font-size: 0.87rem;
  color: #4a5568;
}

.preview-list li + li {
  margin-top: 0.15rem;
}

.tip {
  font-size: 0.82rem;
  color: #718096;
  margin-bottom: 0.4rem;
}

.btn-secondary {
  display: inline-block;
  border-radius: 999px;
  padding: 0.4rem 1.3rem;
  border: none;
  background: #38a169;
  color: #ffffff;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: none;
}
.btn-secondary:hover {
  background: #2f855a;
}

/* 主题色微调边框/高光色（可以后面扩展得更细致） */
.theme-blue .btn-primary,
.theme-blue .btn-secondary {
  /* 保持默认蓝 + 绿即可 */
}
.theme-green .avatar {
  background: #2f855a;
}
.theme-orange .avatar {
  background: #dd6b20;
}
.theme-purple .avatar {
  background: #805ad5;
}

@media (max-width: 900px) {
  .grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
