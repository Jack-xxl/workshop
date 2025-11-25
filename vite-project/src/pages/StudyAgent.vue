<!-- src/pages/StudyAgent.vue -->
<template>
  <div class="agent-page" :class="themeClass">
    <!-- 头部：头像 + 名称 + 口号 -->
    <header class="agent-header">
      <div class="avatar">
        <img
          v-if="avatarImgUrl"
          :src="avatarImgUrl"
          alt="avatar"
          class="avatar-img"
        />
        <span v-else>{{ avatarEmojiOrInitial }}</span>
      </div>
      <div class="info">
        <div class="name">{{ agentName }}</div>
        <div class="desc">
          {{ agentDesc }}
          <span v-if="ageRoleLabel">｜{{ ageRoleLabel }}</span>
        </div>
        <div v-if="agentSlogan" class="slogan">「{{ agentSlogan }}」</div>
      </div>
    </header>

    <!-- 顶部标签：口语 / 听力 / 阅读 / 写作 / 错题本 -->
    <nav class="tabs">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="tab-btn"
        :class="{ active: activeTab === tab.value }"
        @click="switchTab(tab.value)"
      >
        {{ tab.label }}
      </button>
    </nav>

    <!-- 当前模式提示 + 导师擅长技能标签 -->
    <section class="mode-tip">
      <p v-if="activeTab === 'speaking'">
        当前模式：<b>口语</b>。可以练习对话、语音或发音。
      </p>
      <p v-else-if="activeTab === 'listening'">
        当前模式：<b>听力</b>。让 {{ agentName }} 出一段听力并回答问题。
      </p>
      <p v-else-if="activeTab === 'reading'">
        当前模式：<b>阅读</b>。让 {{ agentName }} 讲解文章或出题。
      </p>
      <p v-else-if="activeTab === 'writing'">
        当前模式：<b>写作</b>。输入作文，让 {{ agentName }} 批改和升级表达。
      </p>
      <p v-else>
        当前模式：<b>错题本</b>。查看并回顾上传的题目和讲解。
      </p>

      <div v-if="agentSkillsSummary" class="skills-row">
        擅长：<span class="skill-tag" v-for="(s, i) in agentSkillsSummary" :key="i">
          {{ s }}
        </span>
      </div>
    </section>

    <!-- 聊天区域 -->
    <main class="chat-panel">
      <div
        v-for="(msg, i) in visibleMessages"
        :key="i"
        class="msg-row"
        :class="msg.side"
      >
        <div class="msg-bubble">
          <div class="msg-content">
            <!-- html 消息（内含 <img> 等） -->
            <div v-if="msg.html" v-html="msg.html"></div>
            <!-- 纯文本 -->
            <div v-else>{{ msg.text }}</div>
          </div>

          <!-- 语音播报按钮：只给导师（left）的消息 -->
          <button
            v-if="msg.side === 'left' && canSpeak"
            class="tts-btn"
            title="朗读这一条"
            @click="speakMessage(msg)"
          >
            🔊
          </button>
        </div>
      </div>
    </main>

    <!-- 输入区 -->
    <footer class="input-bar">
      <!-- 语音识别按钮 -->
      <button
        class="icon-btn"
        :class="{ recording: isRecording }"
        @click="handleSpeech"
        title="按一下开始/停止语音识别"
      >
        🎤
      </button>

      <!-- 文本输入 -->
      <input
        v-model="inputText"
        class="text-input"
        type="text"
        :placeholder="inputPlaceholder"
        @keyup.enter="sendText"
      />

      <!-- 图片上传按钮 -->
      <label class="icon-btn" title="上传题目/作文照片">
        📷
        <input
          type="file"
          accept="image/*"
          class="file-input"
          @change="handleImageUpload"
        />
      </label>

      <!-- 发送文字 -->
      <button class="send-btn" @click="sendText">发送</button>
    </footer>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";

// 顶部标签
const tabs = [
  { value: "speaking", label: "口语" },
  { value: "listening", label: "听力" },
  { value: "reading", label: "阅读" },
  { value: "writing", label: "写作" },
  { value: "mistakes", label: "错题本" },
];

const activeTab = ref("speaking");
const inputText = ref("");
// 最近一次上传的图片地址，发给后端做批改
const lastImageUrl = ref(null);

// ===== 导师配置（从 AgentBuilder 保存的 agentProfile 读取） =====
const agentProfile = ref(null);

onMounted(() => {
  try {
    const raw = localStorage.getItem("agentProfile");
    if (raw) {
      agentProfile.value = JSON.parse(raw);
    }
  } catch (e) {
    console.error("读取 agentProfile 失败", e);
  }

  // 初始化第一条欢迎语
  initWelcomeMessage();
});

// 顶层：导师名字 / 描述 / 口号
const agentName = computed(
  () => agentProfile.value?.agentName || "Lily"
);

const agentDesc = computed(() => {
  const gradeMap = {
    primary: "小学",
    middle: "初中",
    high: "高中",
    other: "其他阶段",
  };
  const subjectMap = {
    english: "英语",
    chinese: "语文",
    math: "数学",
    mixed: "综合学习",
  };
  const g = gradeMap[agentProfile.value?.grade] || "学生";
  const s = subjectMap[agentProfile.value?.subject] || "学习";
  return `${g} · ${s} AI 学习伙伴`;
});

const agentSlogan = computed(() => agentProfile.value?.slogan || "");

// 年龄/角色文案
const ageRoleLabel = computed(() => {
  const v = agentProfile.value?.ageRole;
  if (v === "senior") return "20 岁学长 / 学姐";
  if (v === "teacher30") return "30 岁英语老师";
  if (v === "futureAI") return "来自 2050 年的 AI 导师";
  return "";
});

// 头像：自定义图片 > 预设 emoji > 名字首字母
const avatarImgUrl = computed(
  () => agentProfile.value?.customAvatarUrl || ""
);

const avatarEmojiOrInitial = computed(() => {
  if (!agentProfile.value) return "L";
  if (agentProfile.value.avatarPreset === "owl") return "🦉";
  if (agentProfile.value.avatarPreset === "robot") return "🤖";
  if (agentProfile.value.avatarPreset === "star") return "🌟";
  if (agentProfile.value.avatarPreset === "cat") return "😺";
  const name = agentProfile.value.agentName || "L";
  return name.trim().charAt(0).toUpperCase();
});

// 导师擅长技能标签
const agentSkillsSummary = computed(() => {
  const s = agentProfile.value?.skills;
  if (!s) return null;
  const arr = [];
  if (s.speakingCorrection) arr.push("口语纠正");
  if (s.listeningPractice) arr.push("听力练习");
  if (s.readingHelper) arr.push("阅读讲解");
  if (s.writingCoach) arr.push("写作批改");
  if (s.pronunciationCoach) arr.push("发音训练");
  return arr.length ? arr : null;
});

// 主题 class（可跟背景世界观结合）
const themeClass = computed(() => {
  const theme = agentProfile.value?.theme || "blue";
  const bg = agentProfile.value?.backgroundTheme || "stars";
  return `theme-${theme} bg-${bg}`;
});

// 聊天消息：side: left/right; text 或 html; tab: speaking / ...
const messages = ref([]);

function initWelcomeMessage() {
  if (messages.value.length) return;
  const name = agentName.value;
  messages.value.push({
    side: "left",
    text: `你好呀！我是你的英语 AI 学习伙伴 ${name}。我们先来练练口语吧，可以用英文或中英夹杂来跟我打招呼～`,
    tab: "speaking",
  });
}

// 按当前 tab 过滤要显示的消息
const visibleMessages = computed(() =>
  messages.value.filter((m) => m.tab === activeTab.value)
);

// 输入框 placeholder
const inputPlaceholder = computed(() => {
  switch (activeTab.value) {
    case "speaking":
      return "说点什么，比如：帮我练习对话～";
    case "listening":
      return "比如：出一段关于动物的听力练习～";
    case "reading":
      return "贴一段文章或让导师推荐阅读～";
    case "writing":
      return "写一段作文，让导师批改～";
    case "mistakes":
      return "这里可以回顾错题，也可以让导师帮你整理错题～";
    default:
      return "跟你的 AI 导师聊聊吧～";
  }
});

function switchTab(tab) {
  activeTab.value = tab;
}

// ================== 语音识别（Web Speech API） ==================
const isRecording = ref(false);
let speechRecognizer = null;

// ================== 语音播报（TTS） ==================
let synth = null;
const canSpeak = ref(false);

// 根据 agentProfile 确定语速 / 语调
const ttsRate = computed(() => {
  const v = agentProfile.value?.voiceRate || "normal";
  if (v === "slow") return 0.85;
  if (v === "fast") return 1.15;
  return 1.0;
});

const ttsPitch = computed(() => {
  const v = agentProfile.value?.voiceTone || "gentle";
  if (v === "energetic") return 1.1;
  if (v === "serious") return 0.9;
  return 1.0;
});

onMounted(() => {
  // 1) 浏览器语音播报
  if ("speechSynthesis" in window) {
    synth = window.speechSynthesis;
    canSpeak.value = true;
  } else {
    console.warn("当前浏览器不支持 speechSynthesis 语音播报");
  }

  // 2) 浏览器语音识别
  const SR =
    window.SpeechRecognition || window.webkitSpeechRecognition || null;

  if (!SR) {
    console.warn("当前浏览器不支持 SpeechRecognition 语音识别");
    return;
  }

  speechRecognizer = new SR();
  // 中文识别
  speechRecognizer.lang = "zh-CN";
  // 连续识别：可以说比较长
  speechRecognizer.continuous = true;
  // 只要最终结果，避免重复
  speechRecognizer.interimResults = false;
  speechRecognizer.maxAlternatives = 1;

  speechRecognizer.onresult = (event) => {
    let finalText = "";
    for (let i = event.resultIndex; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalText += result[0].transcript;
      }
    }

    finalText = finalText.trim();
    if (!finalText) return;

    // 只在有最终结果时追加一次
    inputText.value += (inputText.value ? " " : "") + finalText;
  };

  speechRecognizer.onerror = (e) => {
    console.error("speech error", e);
    alert("语音识别出错啦，可以稍后再试一次～");
    isRecording.value = false;
  };

  speechRecognizer.onend = () => {
    isRecording.value = false;
  };
});

onBeforeUnmount(() => {
  if (speechRecognizer && isRecording.value) {
    speechRecognizer.stop();
  }
  if (synth) {
    synth.cancel();
  }
});

// 点击麦克风按钮：开始 / 结束 语音识别
function handleSpeech() {
  if (!speechRecognizer) {
    alert("当前浏览器不支持语音识别功能～");
    return;
  }

  if (!isRecording.value) {
    speechRecognizer.start();
    isRecording.value = true;
  } else {
    speechRecognizer.stop();
    isRecording.value = false;
  }
}

// ================== 文本发送到后端 ==================
async function sendText() {
  const content = inputText.value.trim();
  if (!content) return;

  // 右侧显示自己输入的内容
  messages.value.push({
    side: "right",
    text: content,
    tab: activeTab.value,
  });
  inputText.value = "";

  try {
    const resp = await fetch("http://localhost:3100/api/agent/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        text: content,
        mode: activeTab.value, // speaking / listening / ...
        imageUrl: lastImageUrl.value, // 如果之前上传过图片，一并发给后端
      }),
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("chat error:", data);
      messages.value.push({
        side: "left",
        text: "抱歉，我这边开小差了，稍后再试一次可以吗？",
        tab: activeTab.value,
      });
      return;
    }

    const answer = data.answer || "（后端没有返回内容）";
    messages.value.push({
      side: "left",
      text: answer,
      tab: activeTab.value,
    });
  } catch (e) {
    console.error(e);
    messages.value.push({
      side: "left",
      text: "网络好像有点问题，稍后再试试～",
      tab: activeTab.value,
    });
  }
}

// ================== 图片上传 ==================
async function handleImageUpload(event) {
  const file = event.target.files[0];
  event.target.value = ""; // 清空 input，方便下次继续选
  if (!file) return;

  const form = new FormData();
  form.append("image", file);

  try {
    const resp = await fetch("http://localhost:3100/api/agent/upload-image", {
      method: "POST",
      body: form,
    });

    const data = await resp.json();

    if (!resp.ok) {
      console.error("upload error:", data);
      alert(data.error || "图片上传失败，请稍后重试～");
      return;
    }

    const imageUrl = data.url || data.imageUrl;
    if (!imageUrl) {
      alert("后端没有返回图片地址，请检查接口。");
      return;
    }

    lastImageUrl.value = imageUrl;

    // 先右侧发一句提示
    messages.value.push({
      side: "right",
      text: "我上传了一张题目/笔记照片，请帮我看看～",
      tab: activeTab.value,
    });

    const imgHtml = `
      <a href="${imageUrl}" target="_blank" rel="noopener">
        <img src="${imageUrl}" class="chat-image" />
      </a>
    `;

    // 当前模式展示图片
    messages.value.push({
      side: "right",
      html: imgHtml,
      tab: activeTab.value,
    });

    // 错题本里也保存一份
    messages.value.push({
      side: "right",
      html: imgHtml,
      tab: "mistakes",
    });

    // 系统提示
    messages.value.push({
      side: "left",
      text: "【错题本】题目图片已保存，之后可以在“错题本”标签里回顾。",
      tab: activeTab.value,
    });
  } catch (e) {
    console.error(e);
    alert("图片上传失败，请稍后重试～");
  }
}

// ================== 语音播报（朗读导师的回答） ==================
function speakMessage(msg) {
  if (!synth) {
    alert("当前浏览器不支持语音播报功能～");
    return;
  }

  // 从 text 或 html 提取纯文本
  let text = "";
  if (msg.text) {
    text = msg.text;
  } else if (msg.html) {
    const div = document.createElement("div");
    div.innerHTML = msg.html;
    text = div.innerText || div.textContent || "";
  }

  if (!text) return;

  // 停止前一次朗读
  synth.cancel();

  const utter = new SpeechSynthesisUtterance(text);

  // 简单中英检测：大部分是中文 → 用 zh-CN，否则用 en-US
  const chineseMatch = text.match(/[\u4e00-\u9fa5]/g);
  const chineseCount = chineseMatch ? chineseMatch.length : 0;
  const lang =
    chineseCount > text.length / 4
      ? "zh-CN"
      : "en-US";

  utter.lang = lang;
  utter.rate = ttsRate.value;
  utter.pitch = ttsPitch.value;

  synth.speak(utter);
}
</script>

<style scoped>
.agent-page {
  max-width: 900px;
  margin: 1.5em auto;
  padding: 1.5em 1.2em 1.2em;
  background: #ffffff;
  border-radius: 1.2em;
  box-shadow: 0 2px 16px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
  height: calc(100vh - 80px);
}

.agent-header {
  display: flex;
  align-items: center;
  margin-bottom: 0.8em;
}

.avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #3182ce;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 20px;
  margin-right: 0.8em;
  overflow: hidden;
}

.avatar-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.info .name {
  font-size: 1.2em;
  font-weight: 700;
  color: #1a202c;
}
.info .desc {
  font-size: 0.9em;
  color: #718096;
}
.info .slogan {
  font-size: 0.85em;
  color: #2b6cb0;
  margin-top: 0.1rem;
}

.tabs {
  display: flex;
  gap: 0.6em;
  margin: 0.6em 0 0.6em;
}

.tab-btn {
  flex: 1;
  padding: 0.4em 0.2em;
  border-radius: 999px;
  border: none;
  font-size: 0.9em;
  background: #edf2f7;
  color: #4a5568;
  cursor: pointer;
}
.tab-btn.active {
  background: #3182ce;
  color: #fff;
  font-weight: 600;
}

.mode-tip {
  font-size: 0.9em;
  color: #4a5568;
  background: #f7fafc;
  border-radius: 0.8em;
  padding: 0.6em 0.8em;
  margin-bottom: 0.6em;
}

.skills-row {
  margin-top: 0.3rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.3rem;
  align-items: center;
}

.skill-tag {
  display: inline-block;
  padding: 0.1rem 0.5rem;
  border-radius: 999px;
  background: #e6fffa;
  color: #2c7a7b;
  font-size: 0.75rem;
}

.chat-panel {
  flex: 1;
  overflow-y: auto;
  padding: 0.6em 0;
  border-top: 1px solid #edf2f7;
  border-bottom: 1px solid #edf2f7;
  margin-bottom: 0.6em;
}

.msg-row {
  display: flex;
  margin: 0.3em 0;
}
.msg-row.left {
  justify-content: flex-start;
}
.msg-row.right {
  justify-content: flex-end;
}

.msg-bubble {
  position: relative;
  max-width: 72%;
  padding: 0.55em 2.0em 0.55em 0.85em;
  border-radius: 0.9em;
  font-size: 0.96em;
  line-height: 1.5;
  word-break: break-word;
}
.msg-row.left .msg-bubble {
  background: #edf2f7;
  color: #1a202c;
}
.msg-row.right .msg-bubble {
  background: #3182ce;
  color: #fff;
}

.msg-content img,
.chat-image {
  max-width: 100%;
  border-radius: 0.6em;
  display: block;
}

/* 朗读按钮 */
.tts-btn {
  position: absolute;
  right: 6px;
  bottom: 4px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 0.9em;
  opacity: 0.7;
}
.tts-btn:hover {
  opacity: 1;
}

/* 输入区样式 */
.input-bar {
  display: flex;
  align-items: center;
  gap: 0.4em;
  margin-top: 0.4em;
}

.text-input {
  flex: 1;
  border-radius: 999px;
  border: 1px solid #cbd5e0;
  padding: 0.4em 0.9em;
  font-size: 0.95em;
  outline: none;
}
.text-input:focus {
  border-color: #3182ce;
  box-shadow: 0 0 0 1px rgba(49, 130, 206, 0.3);
}

.icon-btn {
  border: none;
  background: #edf2f7;
  border-radius: 999px;
  padding: 0.3em 0.7em;
  cursor: pointer;
  font-size: 1em;
}
.icon-btn.recording {
  background: #fed7d7;
}

.file-input {
  display: none;
}

.send-btn {
  border: none;
  background: #38a169;
  color: #fff;
  padding: 0.35em 0.9em;
  border-radius: 999px;
  cursor: pointer;
  font-size: 0.95em;
}
.send-btn:hover {
  background: #2f855a;
}

/* 简单主题预留（颜色可以后面细调） */
.theme-blue .agent-header .avatar {
  background: #3182ce;
}
.theme-green .agent-header .avatar {
  background: #2f855a;
}
.theme-orange .agent-header .avatar {
  background: #dd6b20;
}
.theme-purple .agent-header .avatar {
  background: #805ad5;
}

.bg-stars {}
.bg-bookshelf {}
.bg-space {}
.bg-classroom {}
</style>
