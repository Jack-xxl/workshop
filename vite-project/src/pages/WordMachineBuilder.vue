<!-- src/pages/WordMachineBuilder.vue -->
<template>
  <div class="builder-page">
    <header class="topbar">
      <h1>AI 单词机 · 配置向导</h1>
      <p class="sub">
        用 2 分钟，打造一个专属于你的 AI 单词教练。完成后系统会自动生成今日训练计划。
      </p>
    </header>

    <main class="content">
      <!-- 0. 来自 Playground 的总体预览 -->
      <section
        class="section preview-section"
        v-if="playgroundTheme || playgroundStory"
      >
        <h2>当前「我的单词机」预览（来自 Playground 设置）</h2>

        <div class="preview-row">
          <!-- 主题颜色预览 -->
          <div v-if="playgroundTheme" class="preview-card">
            <div class="preview-title">主题颜色（来自 Playground）</div>
            <div class="preview-theme">
              <div class="color-item">
                <span
                  class="color-dot"
                  :style="{ backgroundColor: playgroundTheme.primaryColor }"
                ></span>
                <span class="color-label">
                  主色 primaryColor：
                  {{ playgroundTheme.primaryColor }}
                </span>
              </div>
              <div class="color-item">
                <span
                  class="color-dot"
                  :style="{ backgroundColor: playgroundTheme.accentColor }"
                ></span>
                <span class="color-label">
                  强调色 accentColor：
                  {{ playgroundTheme.accentColor }}
                </span>
              </div>
              <p class="hint">
                Builder 里的「界面主题色」更多是皮肤 / 氛围，这里的颜色会真正用在按钮和主操作上。
              </p>
            </div>
          </div>

          <!-- 错词故事工厂默认配置预览 -->
          <div v-if="playgroundStory" class="preview-card">
            <div class="preview-title">错词故事工厂 · 默认配置</div>
            <ul class="story-preview-list">
              <li>故事类型：{{ playgroundStory.style || "未设置" }}</li>
              <li>长度：{{ playgroundStory.lengthLevel || playgroundStory.length || "未设置" }}</li>
              <li>口吻：{{ playgroundStory.tone || "未设置" }}</li>
              <li>叙述视角：{{ playgroundStory.narrator || "未设置" }}</li>
            </ul>
            <p class="hint">
              这些是「错词故事工厂」在训练页的默认选项，学生在训练时仍然可以手动切换。
            </p>
          </div>
        </div>
      </section>

      <!-- 第 1 步：学生 & 导师基础信息 -->
      <section class="section">
        <h2>① 学生 & 导师信息</h2>
        <div class="grid">
          <div class="field">
            <label>你的名字（可选）</label>
            <input
              v-model="config.studentName"
              type="text"
              placeholder="比如：Jack"
            />
            <p class="hint">用于在页面上显示「Jack 的单词机」。不填也可以。</p>
          </div>
          <div class="field">
            <label>导师名字</label>
            <input
              v-model="config.mentorName"
              type="text"
              placeholder="比如：Lily / Mike"
            />
            <p class="hint">
              可以从 Playground 的导师名片 Code Lab 里先设计，再回来微调。
            </p>
          </div>
        </div>
        <div class="grid">
          <div class="field">
            <label>导师头像（表情）</label>
            <div class="emoji-row">
              <button
                v-for="e in emojiOptions"
                :key="e"
                class="emoji-btn"
                :class="{ active: config.avatarEmoji === e }"
                @click="config.avatarEmoji = e"
              >
                {{ e }}
              </button>
            </div>
            <p class="hint">后期可以换成真实图片；现在先用简单表情。</p>
          </div>
          <div class="field">
            <label>界面主题颜色（基础皮肤）</label>
            <div class="theme-row">
              <button
                class="theme-btn theme-blue"
                :class="{ active: config.theme === 'blue' }"
                @click="config.theme = 'blue'"
              >
                冷静蓝
              </button>
              <button
                class="theme-btn theme-green"
                :class="{ active: config.theme === 'green' }"
                @click="config.theme = 'green'"
              >
                治愈绿
              </button>
              <button
                class="theme-btn theme-orange"
                :class="{ active: config.theme === 'orange' }"
                @click="config.theme = 'orange'"
              >
                元气橙
              </button>
            </div>
            <p class="hint">
              这里是「大氛围皮肤」，具体按钮和主操作颜色，会叠加 Playground
              里配置的十六进制颜色。
            </p>
          </div>
        </div>
        <div class="field">
          <label>导师座右铭 / 口号</label>
          <input
            v-model="config.slogan"
            type="text"
            placeholder="比如：犯错是进步的开始。"
          />
          <p class="hint">这句话会显示在训练页面顶部，让孩子有情感连接。</p>
        </div>
      </section>

      <!-- 第 2 步：单词机模板 -->
      <section class="section">
        <h2>② 选择你的单词机模板</h2>
        <div class="card-row">
          <div
            class="card"
            :class="{ active: config.template === 'exam' }"
            @click="setTemplate('exam')"
          >
            <h3>📚 考试提分型</h3>
            <p>适合中考 / 高考 / 校内考试，任务稍微偏重，复习频率较高。</p>
          </div>
          <div
            class="card"
            :class="{ active: config.template === 'fun' }"
            @click="setTemplate('fun')"
          >
            <h3>🎈 轻松兴趣型</h3>
            <p>每天任务量较少，节奏轻松，适合小学 / 基础阶段慢慢建立信心。</p>
          </div>
          <div
            class="card"
            :class="{ active: config.template === 'speaking' }"
            @click="setTemplate('speaking')"
          >
            <h3>🎤 口语发音型</h3>
            <p>更强调发音和例句，后期可以配合语音闯关、一对一跟读练习。</p>
          </div>
        </div>
      </section>

      <!-- 第 3 步：学习强度 & 复习流派 -->
      <section class="section">
        <h2>③ 学习强度 & 复习流派</h2>
        <div class="grid">
          <div class="field">
            <label>每天学习强度</label>
            <div class="radio-row">
              <label class="radio-item">
                <input
                  type="radio"
                  value="easy"
                  v-model="config.intensity"
                />
                <span>轻松模式（新词 5 个左右）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="normal"
                  v-model="config.intensity"
                />
                <span>标准模式（新词约 10 个）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="hard"
                  v-model="config.intensity"
                />
                <span>冲刺模式（新词 15 个左右）</span>
              </label>
            </div>
            <p class="hint" v-if="playgroundPlan">
              当前已从 Playground 的任务计划里读取默认值：{{ playgroundPlan.intensity }}。
            </p>
          </div>
          <div class="field">
            <label>复习风格</label>
            <div class="radio-row">
              <label class="radio-item">
                <input
                  type="radio"
                  value="lazy"
                  v-model="config.reviewStyle"
                />
                <span>佛系背单词（间隔稍长）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="standard"
                  v-model="config.reviewStyle"
                />
                <span>稳定进步（标准艾宾浩斯）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="exam"
                  v-model="config.reviewStyle"
                />
                <span>考试冲刺（短间隔高频复习）</span>
              </label>
            </div>
            <p class="hint" v-if="playgroundPlan">
              当前复习流派默认来自 Playground：{{ playgroundPlan.reviewStyle }}。
            </p>
          </div>
        </div>
      </section>

      <!-- 第 4 步：语音模式 & 卡片选项 -->
      <section class="section">
        <h2>④ 语音闯关 & 单词卡片选项</h2>
        <div class="grid">
          <div class="field">
            <label>语音闯关难度</label>
            <div class="radio-row">
              <label class="radio-item">
                <input
                  type="radio"
                  value="none"
                  v-model="config.voiceMode"
                />
                <span>关闭（暂时不练发音）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="relaxed"
                  v-model="config.voiceMode"
                />
                <span>宽松模式（主要鼓励为主）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="normal"
                  v-model="config.voiceMode"
                />
                <span>标准模式（发音 + 完整度）</span>
              </label>
              <label class="radio-item">
                <input
                  type="radio"
                  value="strict"
                  v-model="config.voiceMode"
                />
                <span>严格模式（接近外教要求）</span>
              </label>
            </div>
          </div>
          <div class="field">
            <label>单词卡片包含内容</label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="config.cardOptions.withExample"
              />
              <span>显示例句（推荐）</span>
            </label>
            <label class="checkbox-item">
              <input
                type="checkbox"
                v-model="config.cardOptions.allowNote"
              />
              <span>允许学生写自己的联想 / 记忆法</span>
            </label>
          </div>
        </div>
      </section>

      <!-- 第 5 步：勋章名字（可选） -->
      <section class="section">
        <h2>⑤ 勋章名字（可选）</h2>
        <div class="field">
          <label>你想得到的勋章名称</label>
          <input
            v-model="config.medalName"
            type="text"
            placeholder="比如：单词小猎人 / 英语小勇士"
          />
          <p class="hint">
            这个名字会出现在训练页面顶部，用来奖励坚持学习的你。
          </p>
        </div>
      </section>

      <!-- 底部按钮 -->
      <section class="section actions">
        <button class="btn-primary" @click="saveAndGo">
          ✅ 保存配置并开始今天的训练
        </button>
        <p class="hint">
          保存后系统会将设置写入浏览器本地（localStorage），
          并自动为你生成一个专属的单词导师档案。
        </p>
      </section>
    </main>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { userKey } from "../services/userStorage";

const router = useRouter();

// 与 Playground 对齐的 key
const LS_THEME = "wordTrainerTheme";
const LS_STORY = "wordTrainerStoryConfig";
const LS_MENTOR = "wordTrainerMentorConfig";
const LS_PLAN = "wordTrainerPlanConfig";

// Playground 预览用状态
const playgroundTheme = ref(null);
const playgroundStory = ref(null);
const playgroundPlan = ref(null);

// 默认配置
const config = reactive({
  studentName: "",
  mentorName: "Lily",
  avatarEmoji: "📘",
  theme: "blue",
  slogan: "犯错是进步的开始。",
  template: "exam", // exam / fun / speaking
  intensity: "normal", // easy / normal / hard
  reviewStyle: "standard", // lazy / standard / exam
  voiceMode: "normal", // none / relaxed / normal / strict
  cardOptions: {
    withExample: true,
    allowNote: true,
  },
  medalName: "单词小猎人",
});

const emojiOptions = ["📘", "🦉", "🧠", "🚀", "🤖", "🐱", "🐶"];

// 根据模板自动带一些默认参数
function setTemplate(t) {
  config.template = t;
  if (t === "exam") {
    config.intensity = "hard";
    config.reviewStyle = "exam";
  } else if (t === "fun") {
    config.intensity = "easy";
    config.reviewStyle = "lazy";
  } else if (t === "speaking") {
    config.voiceMode = "normal";
  }
}

// 读取已有配置 & Playground 配置
onMounted(() => {
  // 1) 先读自身的 wordMachineConfig
  try {
    const cfgKey = userKey("wordMachineConfig");
    const raw = localStorage.getItem(cfgKey);
    if (raw) {
      const saved = JSON.parse(raw);
      Object.assign(config, saved);
    }
  } catch (e) {
    console.error("读取已有配置失败", e);
  }

  // 2) 读取 Playground 的主题 / 故事配置（仅用于预览）
  try {
    const themeKey = userKey(LS_THEME);
    const rawTheme =
      localStorage.getItem(themeKey) || localStorage.getItem(LS_THEME);
    if (rawTheme) {
      playgroundTheme.value = JSON.parse(rawTheme);
    }
  } catch (e) {
    console.warn("读取 Playground 主题失败", e);
  }

  try {
    const storyKey = userKey(LS_STORY);
    const rawStory =
      localStorage.getItem(storyKey) || localStorage.getItem(LS_STORY);
    if (rawStory) {
      playgroundStory.value = JSON.parse(rawStory);
    }
  } catch (e) {
    console.warn("读取 Playground 故事配置失败", e);
  }

  // 3) 读取 Playground 的导师名片配置，自动填充到表单里
  try {
    const mentorKey = userKey(LS_MENTOR);
    const rawMentor =
      localStorage.getItem(mentorKey) || localStorage.getItem(LS_MENTOR);
    if (rawMentor) {
      const m = JSON.parse(rawMentor);
      if (m.mentorName) config.mentorName = m.mentorName;
      if (m.mentorAvatarEmoji) config.avatarEmoji = m.mentorAvatarEmoji;
      if (m.mentorSlogan) config.slogan = m.mentorSlogan;
      if (m.medalName) config.medalName = m.medalName;
    }
  } catch (e) {
    console.warn("读取 Playground 导师配置失败", e);
  }

  // 4) 读取 Playground 的任务计划配置，自动勾选强度 & 复习流派
  try {
    const planKey = userKey(LS_PLAN);
    const rawPlan =
      localStorage.getItem(planKey) || localStorage.getItem(LS_PLAN);
    if (rawPlan) {
      const p = JSON.parse(rawPlan);
      playgroundPlan.value = p;
      if (p.intensity) config.intensity = p.intensity;
      if (p.reviewStyle) config.reviewStyle = p.reviewStyle;
    }
  } catch (e) {
    console.warn("读取 Playground 任务计划失败", e);
  }
});

function saveAndGo() {
  try {
    // 1）按用户维度保存 wordMachineConfig
    const cfgKey = userKey("wordMachineConfig");
    localStorage.setItem(cfgKey, JSON.stringify(config));

    // 2）顺便生成 / 更新一个导师档案（给 WordTrainer / StudyAgent 共用）
    const profile = {
      mentorName:
        config.mentorName ||
        (config.studentName
          ? config.studentName + "的单词教练"
          : "我的单词教练"),
      mentorAvatarEmoji: config.avatarEmoji || "📘",
      theme: config.theme || "blue",
      mentorSlogan: config.slogan || "",
      medalName: config.medalName || "单词小猎人",
    };
    localStorage.setItem("agent-profile", JSON.stringify(profile));

    alert("配置已保存，马上进入今日单词训练！");
    router.push("/word-trainer");
  } catch (e) {
    console.error("保存配置失败", e);
    alert("保存失败，请稍后再试一次。");
  }
}
</script>

<style scoped>
.builder-page {
  max-width: 1120px;
  margin: 1.5em auto;
  padding: 1.5em 1.2em 1.5em;
  background: #ffffff;
  border-radius: 1.2em;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
}

.topbar h1 {
  font-size: 1.6rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #1a202c;
}

.sub {
  font-size: 0.9rem;
  color: #4a5568;
  margin-bottom: 0.5rem;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section {
  padding: 0.8rem 0.1rem;
  border-top: 1px solid #edf2f7;
}

.section:first-of-type {
  border-top: none;
}

.section h2 {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

/* 预览区样式 */
.preview-section {
  background: #f7fafc;
  padding: 0.9rem 0.8rem;
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
}

.preview-row {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.8rem;
}

.preview-card {
  background: #ffffff;
  border-radius: 0.8rem;
  border: 1px solid #e2e8f0;
  padding: 0.6rem 0.7rem;
}

.preview-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.35rem;
}

.preview-theme {
  font-size: 0.86rem;
}

.color-item {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  margin-bottom: 0.25rem;
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 999px;
  border: 1px solid #cbd5e0;
}

.color-label {
  font-size: 0.84rem;
  color: #2d3748;
}

.story-preview-list {
  margin: 0;
  padding-left: 1.1rem;
  font-size: 0.86rem;
  color: #4a5568;
}

.story-preview-list li + li {
  margin-top: 0.1rem;
}

.grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 0.8rem;
  margin-bottom: 0.5rem;
}

@media (max-width: 768px) {
  .grid,
  .preview-row {
    grid-template-columns: minmax(0, 1fr);
  }
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.field label {
  font-size: 0.9rem;
  font-weight: 500;
  color: #2d3748;
}

.field input[type="text"] {
  border-radius: 0.7rem;
  border: 1px solid #cbd5e0;
  padding: 0.35rem 0.6rem;
  font-size: 0.92rem;
}

.hint {
  font-size: 0.8rem;
  color: #718096;
}

.card-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 0.8rem;
}

.card {
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  padding: 0.7rem 0.8rem;
  cursor: pointer;
  background: #f9fafb;
  transition: 0.2s;
}

.card h3 {
  margin: 0 0 0.3rem;
  font-size: 1rem;
}

.card p {
  margin: 0;
  font-size: 0.88rem;
  color: #4a5568;
}

.card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.05);
}

.card.active {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px rgba(49, 130, 206, 0.4);
}

.radio-row {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.15rem;
}

.radio-item {
  display: flex;
  align-items: center;
  gap: 0.24rem;
  font-size: 0.9rem;
  color: #4a5568;
}

.checkbox-item {
  display: flex;
  align-items: center;
  gap: 0.24rem;
  font-size: 0.9rem;
  color: #4a5568;
  margin-top: 0.2rem;
}

.emoji-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.emoji-btn {
  border-radius: 999px;
  border: 1px solid #e2e8f0;
  background: #fff;
  padding: 0.2rem 0.45rem;
  font-size: 1.2rem;
  cursor: pointer;
}

.emoji-btn.active {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px rgba(49, 130, 206, 0.4);
}

.theme-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
}

.theme-btn {
  border-radius: 999px;
  padding: 0.25rem 0.8rem;
  border: 1px solid #e2e8f0;
  font-size: 0.86rem;
  cursor: pointer;
  background: #fff;
}

.theme-blue {
  border-color: #90cdf4;
}

.theme-green {
  border-color: #9ae6b4;
}

.theme-orange {
  border-color: #fbd38d;
}

.theme-btn.active {
  background: #3182ce;
  color: #fff;
  border-color: #3182ce;
}

.actions {
  border-top: 1px dashed #e2e8f0;
  margin-top: 0.5rem;
  padding-top: 0.8rem;
}

.btn-primary {
  border-radius: 999px;
  padding: 0.5rem 1.5rem;
  border: none;
  background: #3182ce;
  color: #fff;
  font-size: 0.95rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2b6cb0;
}
</style>
