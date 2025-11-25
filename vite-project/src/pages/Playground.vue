<template>
  <div class="pg-page">
    <header class="pg-header">
      <h1>AI 英语项目 · 学习版 Playground</h1>
      <p class="pg-sub">
        在这里，学生可以“真的动代码”：改一小段配置代码，立刻看到 AI 单词机 /
        页面外观的变化。你可以在上课时边讲边演示，让孩子感受到“我也能改产品”。
      </p>
    </header>
    <!-- 🔙 返回训练中心，查看修改后的单词机效果 -->
    <div class="pg-nav-row">
      <router-link class="btn pg-nav-btn" to="/word-trainer">
        ← 返回「今日单词记忆 · 训练中心」（查看刚才的修改效果）
      </router-link>
    </div>

    <main class="pg-main">
      <!-- ① 发音参数 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>① 发音参数 Code Lab（调整朗读语速 / 音量）</h2>
          <p class="pg-tip">
            目标：让学生通过修改 JSON 配置，控制单词朗读的速度和音量。修改成功后，会保存到
            <code>wordTrainerAudioConfig</code>（按当前登录账号区分），单词机可以复用。
          </p>
        </div>

        <div class="pg-grid">
          <!-- 左侧说明 -->
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 基本写法</h3>
            <p class="pg-text">
              右侧是一段 JSON 配置，只能写 <b>数字</b>：
            </p>
            <ul class="pg-list">
              <li>
                <code>rate</code>：语速，建议在 <b>0.5 ~ 1.2</b> 之间；0.5 很慢，0.75
                偏慢，1 是正常。
              </li>
              <li><code>pitch</code>：音调，高低；建议保持 <b>1.0</b>。</li>
              <li><code>volume</code>：音量，0～1 之间。</li>
            </ul>
            <p class="pg-text">
              修改完后点 <b>“应用到单词机”</b>，配置会保存到浏览器本地（当前账号）。你也可以点击“试听示例单词”感受当前参数的效果。
            </p>
            <p class="pg-text">
              <b>建议课堂玩法：</b>老师先演示一次，然后让每个孩子尝试把语速改为
              <code>0.5</code>、<code>0.75</code>、<code>1.0</code>，感受差异。
            </p>
          </div>

          <!-- 右侧代码编辑区 -->
          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>audioConfig.json</span>
                <button class="btn-xs ghost" @click="resetAudioCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "rate": 0.75, "pitch": 1.0, "volume": 1.0 }
              </pre>
              <textarea
                v-model="audioCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyAudioConfig">
                  应用到单词机（保存配置）
                </button>
                <button
                  class="btn-sm ghost"
                  @click="testSpeak"
                  :disabled="!canSpeak"
                >
                  试听示例单词（apple）
                </button>
              </div>
              <p
                v-if="audioMessage"
                :class="['pg-msg', audioError ? 'err' : 'ok']"
              >
                {{ audioMessage }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ② 按钮文案 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>② 按钮文案 Code Lab（改“认识 / 不太会”文案）</h2>
          <p class="pg-tip">
            目标：让学生体验“改一行字符串，界面文字就变了”。配置会保存到
            <code>wordTrainerButtonLabels</code>（按账号区分），并在下面预览。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 字符串配置</h3>
            <p class="pg-text">右侧是一个简单的配置对象，只有两个字段：</p>
            <ul class="pg-list">
              <li><code>hardLabel</code>：“不会 / 我要再背”按钮的文字。</li>
              <li><code>masteredLabel</code>：“认识，下一个”按钮的文字。</li>
            </ul>
            <p class="pg-text">
              字符串需要用英文引号包起来：<code>"认识，下一个"</code>。
            </p>
            <p class="pg-text">
              修改完点击“应用按钮文案”，下方预览区的按钮会立刻更新，并保存到本地（当前账号）。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>buttonLabels.json</span>
                <button class="btn-xs ghost" @click="resetButtonCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "hardLabel": "不太会 / 我要再背", "masteredLabel": "认识，下一个" }
              </pre>
              <textarea
                v-model="buttonCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyButtonLabels">
                  应用按钮文案
                </button>
              </div>
              <p
                v-if="buttonMessage"
                :class="['pg-msg', buttonError ? 'err' : 'ok']"
              >
                {{ buttonMessage }}
              </p>
              <div class="pg-preview">
                <div class="pg-preview-title">预览 · 单词机底部按钮：</div>
                <div class="pg-preview-buttons">
                  <button class="btn-secondary">
                    {{ buttonLabels.hardLabel }}
                  </button>
                  <button class="btn-primary">
                    {{ buttonLabels.masteredLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ③ 主题颜色 Code Lab（加预设按钮） -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>③ 主题颜色 Code Lab（改成自己喜欢的配色）</h2>
          <p class="pg-tip">
            目标：让学生通过修改颜色代码，定制自己的“单词机主题”。配置会保存到
            <code>wordTrainerTheme</code>（按账号区分），并在下方卡片即时预览。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 两种玩法</h3>
            <p class="pg-text">
              方式 A：直接点下面的“主题预设按钮”，系统会帮你填好右侧 JSON。
            </p>
            <div class="preset-row">
              <button class="btn-xs" @click="setThemePreset('blueGreen')">
                🌤️ 天空蓝 + 草地绿
              </button>
              <button class="btn-xs" @click="setThemePreset('greenOrange')">
                🍊 草地绿 + 橙色
              </button>
              <button class="btn-xs" @click="setThemePreset('pinkPurple')">
                💜 粉色 + 紫色
              </button>
              <button class="btn-xs" @click="setThemePreset('dark')">
                🌙 深色酷酷风
              </button>
            </div>
            <p class="pg-text">
              方式 B：自己改 JSON。右侧 JSON 有两个字段：
            </p>
            <ul class="pg-list">
              <li>
                <code>primaryColor</code>：主要按钮 / 标题颜色，例如
                <code>#3182ce</code>。
              </li>
              <li>
                <code>accentColor</code>：强调色，例如
                <code>#38a169</code>。
              </li>
            </ul>
            <p class="pg-text">
              不用搞懂每一个数字代表什么，只要记住：<b>同一套颜色要成对出现</b>，
              可以让孩子查“好看的配色”，把复制好的十六进制颜色改进去。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>themeConfig.json</span>
                <button class="btn-xs ghost" @click="resetThemeCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "primaryColor": "#3182ce", "accentColor": "#38a169" }
              </pre>
              <textarea
                v-model="themeCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyThemeConfig">
                  应用主题颜色
                </button>
              </div>
              <p
                v-if="themeMessage"
                :class="['pg-msg', themeError ? 'err' : 'ok']"
              >
                {{ themeMessage }}
              </p>
              <div class="pg-theme-preview" :style="themePreviewStyle">
                <div class="pg-theme-badge">预览卡片</div>
                <div class="pg-theme-title">
                  {{ mentorPreviewName }} 的 AI 单词机
                </div>
                <div class="pg-theme-sub">
                  这是根据你刚才的主题颜色生成的效果预览。
                </div>
                <div class="pg-theme-buttons">
                  <button class="btn-secondary">
                    {{ buttonLabels.hardLabel }}
                  </button>
                  <button class="btn-primary">
                    {{ buttonLabels.masteredLabel }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ④ 错词故事工厂 · 默认设置 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>④ 错词故事工厂 · 默认设置 Code Lab</h2>
          <p class="pg-tip">
            目标：在这里预先配置“错词故事工厂”的默认
            故事类型 / 长度 / 口吻 / 视角，保存到
            <code>wordTrainerStoryConfig</code>，单词机会自动读取。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 故事配置字段</h3>
            <p class="pg-text">右侧 JSON 有四个字段：</p>
            <ul class="pg-list">
              <li>
                <code>style</code>：故事类型。
                <code>"funny"</code>（幽默搞笑）、
                <code>"mystery"</code>（悬疑惊悚）、
                <code>"scifi"</code>（科幻 / 未来感）、
                <code>"adventure"</code>（冒险）、
                <code>"slice_of_life"</code>（日常生活）。
              </li>
              <li>
                <code>length</code>：故事长度，
                <code>"short"</code>（30-120 字）、
                <code>"medium"</code>（150-250 字）、
                <code>"long"</code>（300-400 字）。
              </li>
              <li>
                <code>tone</code>：讲故事的口吻，
                <code>"teacher"</code>（老师鼓励型）、
                <code>"friend"</code>（朋友聊天型）、
                <code>"hero"</code>（冒险英雄型）。
              </li>
              <li>
                <code>pov</code>：视角，
                <code>"first_person"</code>（“我”做主角）、
                <code>"third_person"</code>（旁白讲述）。
              </li>
            </ul>
            <p class="pg-text">
              这些配置只是默认值，学生在单词机页面里仍然可以手动切换。但老师可以先统一好“班级默认风格”。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>storyConfig.json</span>
                <button class="btn-xs ghost" @click="resetStoryCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "style": "funny", "length": "short", "tone": "teacher", "pov": "third_person" }
              </pre>
              <textarea
                v-model="storyCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyStoryConfig">
                  应用故事默认设置
                </button>
              </div>
              <p
                v-if="storyMessage"
                :class="['pg-msg', storyError ? 'err' : 'ok']"
              >
                {{ storyMessage }}
              </p>
              <div class="pg-preview">
                <div class="pg-preview-title">当前默认配置：</div>
                <div class="pg-text">
                  风格：{{ storyConfig.style }}；长度：{{ storyConfig.length }}；口吻：{{
                    storyConfig.tone
                  }}；视角：{{ storyConfig.pov }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑤ 导师名片 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>⑤ 导师名片 Code Lab（名字 / 头像 / 口号）</h2>
          <p class="pg-tip">
            目标：让学生给 AI 导师设计“名片”，保存到
            <code>wordTrainerMentorConfig</code>。训练页顶部名片会自动更新。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 名片字段</h3>
            <ul class="pg-list">
              <li><code>mentorName</code>：导师名字。</li>
              <li>
                <code>mentorAvatarEmoji</code>：头像表情，例如
                <code>"📘"</code>。
              </li>
              <li><code>mentorSlogan</code>：一句口号。</li>
              <li><code>medalName</code>：勋章名字。</li>
            </ul>
            <p class="pg-text">
              老师可以让每个孩子设计一张“自己的导师名片”，然后在训练中心页面查看自己的作品。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>mentorConfig.json</span>
                <button class="btn-xs ghost" @click="resetMentorCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{
  "mentorName": "Jack 的单词教练",
  "mentorAvatarEmoji": "📘",
  "mentorSlogan": "每天一点点，单词向上升！",
  "medalName": "单词小猎人"
}
              </pre>
              <textarea
                v-model="mentorCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyMentorConfig">
                  应用导师名片
                </button>
              </div>
              <p
                v-if="mentorMessage"
                :class="['pg-msg', mentorError ? 'err' : 'ok']"
              >
                {{ mentorMessage }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑥ 学习任务计划 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>⑥ 学习任务计划 Code Lab（每天背多少 / 复习流派）</h2>
          <p class="pg-tip">
            目标：通过修改配置感受学习计划也可以是自己设计的。保存到
            <code>wordTrainerPlanConfig</code>，会覆盖单词机里的强度 &amp; 复习流派。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 计划字段</h3>
            <ul class="pg-list">
              <li>
                <code>intensity</code>：<code>"easy"</code>（轻松模式）、
                <code>"normal"</code>（标准模式）、
                <code>"hard"</code>（冲刺模式）。
              </li>
              <li>
                <code>reviewStyle</code>：<code>"lazy"</code>（佛系复习）、
                <code>"standard"</code>（稳定进步）、
                <code>"exam"</code>（考试冲刺）。
              </li>
            </ul>
            <p class="pg-text">
              实际的每天新词 / 复习词数量，会根据不同强度分档，细节由单词机内部计算。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>planConfig.json</span>
                <button class="btn-xs ghost" @click="resetPlanCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "intensity": "normal", "reviewStyle": "standard" }
              </pre>
              <textarea
                v-model="planCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyPlanConfig">
                  应用学习计划
                </button>
              </div>
              <p v-if="planMessage" :class="['pg-msg', planError ? 'err' : 'ok']">
                {{ planMessage }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- ⑦ 卡片信息量 Code Lab -->
      <section class="pg-section">
        <div class="pg-section-title">
          <h2>⑦ 卡片信息量 Code Lab（要不要音标 / 例句 / 记忆法）</h2>
          <p class="pg-tip">
            目标：让学生决定自己的单词卡片“信息密度”，保存到
            <code>wordTrainerCardConfig</code>，训练中心会自动调整展示。
          </p>
        </div>

        <div class="pg-grid">
          <div class="pg-col">
            <h3 class="pg-small-title">说明 · 配置字段</h3>
            <ul class="pg-list">
              <li>
                <code>showPhonetic</code>：是否显示音标（单词下面那一行
                [ˈæpəl]）。
              </li>
              <li><code>withExample</code>：是否显示例句区域。</li>
              <li><code>allowNote</code>：是否显示“我自己的联想 / 记忆法”。</li>
            </ul>
            <p class="pg-text">
              课堂示例：先把三个都设成 <code>true</code>，看一下卡片信息很丰富；
              再把其中某一项改成 <code>false</code>，刷新训练页面，观察消失了哪一块。
            </p>
          </div>

          <div class="pg-col">
            <div class="pg-code-card">
              <div class="pg-code-header">
                <span>cardConfig.json</span>
                <button class="btn-xs ghost" @click="resetCardCode">
                  恢复默认示例
                </button>
              </div>
              <pre class="pg-code-hint">
{ "showPhonetic": true, "withExample": true, "allowNote": true }
              </pre>
              <textarea
                v-model="cardCode"
                class="pg-textarea"
                spellcheck="false"
              ></textarea>
              <div class="pg-actions-row">
                <button class="btn-sm" @click="applyCardConfig">
                  应用卡片信息量设置
                </button>
              </div>
              <p v-if="cardMessage" :class="['pg-msg', cardError ? 'err' : 'ok']">
                {{ cardMessage }}
              </p>
              <div class="pg-preview">
                <div class="pg-preview-title">预览 · 会显示哪些内容：</div>
                <div class="pg-text">
                  音标：{{ cardConfig.showPhonetic ? "显示" : "隐藏" }}；
                  例句：{{ cardConfig.withExample ? "显示" : "隐藏" }}；
                  记忆法：{{ cardConfig.allowNote ? "显示" : "隐藏" }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { userKey } from "../services/userStorage";

// ===== localStorage key（未加 userKey 的是旧版兼容） =====
const LS_AUDIO_BASE = "wordTrainerAudioConfig";
const LS_BUTTONS_BASE = "wordTrainerButtonLabels";
const LS_THEME_BASE = "wordTrainerTheme";
const LS_STORY_BASE = "wordTrainerStoryConfig";
const LS_MENTOR_BASE = "wordTrainerMentorConfig";
const LS_PLAN_BASE = "wordTrainerPlanConfig";
const LS_CARD_BASE = "wordTrainerCardConfig";

/* ========== 1. 发音配置 ========== */
const defaultAudioConfig = {
  rate: 0.75,
  pitch: 1.0,
  volume: 1.0,
};
const audioCode = ref("");
const audioMessage = ref("");
const audioError = ref(false);
const audioConfig = ref({ ...defaultAudioConfig });
const canSpeak =
  typeof window !== "undefined" && "speechSynthesis" in window;

function resetAudioCode() {
  audioCode.value = JSON.stringify(defaultAudioConfig, null, 2);
  audioMessage.value = "";
  audioError.value = false;
}

function applyAudioConfig() {
  try {
    const obj = JSON.parse(audioCode.value);
    if (typeof obj.rate !== "number") throw new Error("rate 必须是数字");
    if (typeof obj.pitch !== "number") throw new Error("pitch 必须是数字");
    if (typeof obj.volume !== "number") throw new Error("volume 必须是数字");

    audioConfig.value = {
      rate: obj.rate,
      pitch: obj.pitch,
      volume: obj.volume,
    };
    const audioKey = userKey(LS_AUDIO_BASE);
    localStorage.setItem(audioKey, JSON.stringify(audioConfig.value));
    audioMessage.value =
      "✅ 已保存到本地（当前账号的 wordTrainerAudioConfig）。";
    audioError.value = false;
  } catch (e) {
    audioMessage.value = "❌ 解析失败：" + e.message;
    audioError.value = true;
  }
}

function testSpeak() {
  if (!canSpeak) {
    audioMessage.value = "当前浏览器不支持 Web Speech API。";
    audioError.value = true;
    return;
  }
  const utter = new SpeechSynthesisUtterance("apple");
  utter.rate = audioConfig.value.rate ?? 1;
  utter.pitch = audioConfig.value.pitch ?? 1;
  utter.volume = audioConfig.value.volume ?? 1;
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
  audioMessage.value = '🎧 已根据当前配置朗读单词 "apple"。';
  audioError.value = false;
}

/* ========== 2. 按钮文案 ========== */
const defaultButtonLabels = {
  hardLabel: "不太会 / 我要再背",
  masteredLabel: "认识，下一个",
};
const buttonCode = ref("");
const buttonLabels = ref({ ...defaultButtonLabels });
const buttonMessage = ref("");
const buttonError = ref(false);

function resetButtonCode() {
  buttonCode.value = JSON.stringify(defaultButtonLabels, null, 2);
  buttonMessage.value = "";
  buttonError.value = false;
}

function applyButtonLabels() {
  try {
    const obj = JSON.parse(buttonCode.value);
    if (typeof obj.hardLabel !== "string") {
      throw new Error("hardLabel 必须是字符串");
    }
    if (typeof obj.masteredLabel !== "string") {
      throw new Error("masteredLabel 必须是字符串");
    }
    buttonLabels.value = {
      hardLabel: obj.hardLabel,
      masteredLabel: obj.masteredLabel,
    };
    const btnKey = userKey(LS_BUTTONS_BASE);
    localStorage.setItem(btnKey, JSON.stringify(buttonLabels.value));
    buttonMessage.value =
      "✅ 按钮文案已保存到本地（当前账号的 wordTrainerButtonLabels）。";
    buttonError.value = false;
  } catch (e) {
    buttonMessage.value = "❌ 解析失败：" + e.message;
    buttonError.value = true;
  }
}

/* ========== 3. 主题颜色 ========== */
const defaultTheme = {
  primaryColor: "#3182ce",
  accentColor: "#38a169",
};
const themeCode = ref("");
const themeConfig = ref({ ...defaultTheme });
const themeMessage = ref("");
const themeError = ref(false);

function resetThemeCode() {
  themeCode.value = JSON.stringify(defaultTheme, null, 2);
  themeMessage.value = "";
  themeError.value = false;
}

function setThemePreset(preset) {
  if (preset === "blueGreen") {
    themeConfig.value = {
      primaryColor: "#3182ce",
      accentColor: "#38a169",
    };
  } else if (preset === "greenOrange") {
    themeConfig.value = {
      primaryColor: "#38a169",
      accentColor: "#dd6b20",
    };
  } else if (preset === "pinkPurple") {
    themeConfig.value = {
      primaryColor: "#d53f8c",
      accentColor: "#805ad5",
    };
  } else if (preset === "dark") {
    themeConfig.value = {
      primaryColor: "#2d3748",
      accentColor: "#ecc94b",
    };
  }
  themeCode.value = JSON.stringify(themeConfig.value, null, 2);
}

function applyThemeConfig() {
  try {
    const obj = JSON.parse(themeCode.value);
    if (typeof obj.primaryColor !== "string") {
      throw new Error("primaryColor 必须是字符串");
    }
    if (typeof obj.accentColor !== "string") {
      throw new Error("accentColor 必须是字符串");
    }
    themeConfig.value = {
      primaryColor: obj.primaryColor,
      accentColor: obj.accentColor,
    };
    const themeKey = userKey(LS_THEME_BASE);
    localStorage.setItem(themeKey, JSON.stringify(themeConfig.value));
    themeMessage.value =
      "✅ 主题配置已保存到本地（当前账号的 wordTrainerTheme）。";
    themeError.value = false;
  } catch (e) {
    themeMessage.value = "❌ 解析失败：" + e.message;
    themeError.value = true;
  }
}

const themePreviewStyle = computed(() => ({
  borderColor: themeConfig.value.primaryColor,
  boxShadow: `0 0 0 1px ${themeConfig.value.primaryColor}20`,
}));

/* ========== 4. 故事默认配置 ========== */
const defaultStoryConfig = {
  style: "funny",
  length: "short",
  tone: "teacher",
  pov: "third_person",
};
const storyCode = ref("");
const storyConfig = ref({ ...defaultStoryConfig });
const storyMessage = ref("");
const storyError = ref(false);

function resetStoryCode() {
  storyCode.value = JSON.stringify(defaultStoryConfig, null, 2);
  storyMessage.value = "";
  storyError.value = false;
}

function applyStoryConfig() {
  try {
    const obj = JSON.parse(storyCode.value);
    storyConfig.value = {
      ...defaultStoryConfig,
      ...obj,
    };
    const key = userKey(LS_STORY_BASE);
    localStorage.setItem(key, JSON.stringify(storyConfig.value));
    storyMessage.value =
      "✅ 故事默认设置已保存（当前账号的 wordTrainerStoryConfig）。";
    storyError.value = false;
  } catch (e) {
    storyMessage.value = "❌ 解析失败：" + e.message;
    storyError.value = true;
  }
}

/* ========== 5. 导师名片配置 ========== */
const defaultMentorConfig = {
  mentorName: "我的单词教练",
  mentorAvatarEmoji: "📘",
  mentorSlogan: "犯错是进步的开始。",
  medalName: "单词小猎人",
};
const mentorCode = ref("");
const mentorConfig = ref({ ...defaultMentorConfig });
const mentorMessage = ref("");
const mentorError = ref(false);

function resetMentorCode() {
  mentorCode.value = JSON.stringify(defaultMentorConfig, null, 2);
  mentorMessage.value = "";
  mentorError.value = false;
}

function applyMentorConfig() {
  try {
    const obj = JSON.parse(mentorCode.value);
    mentorConfig.value = {
      ...defaultMentorConfig,
      ...obj,
    };
    const key = userKey(LS_MENTOR_BASE);
    localStorage.setItem(key, JSON.stringify(mentorConfig.value));
    mentorMessage.value =
      "✅ 导师名片已保存（当前账号的 wordTrainerMentorConfig）。";
    mentorError.value = false;
  } catch (e) {
    mentorMessage.value = "❌ 解析失败：" + e.message;
    mentorError.value = true;
  }
}

const mentorPreviewName = computed(
  () => mentorConfig.value.mentorName || "我的单词机"
);

/* ========== 6. 学习计划配置 ========== */
const defaultPlanConfig = {
  intensity: "normal",
  reviewStyle: "standard",
};
const planCode = ref("");
const planConfig = ref({ ...defaultPlanConfig });
const planMessage = ref("");
const planError = ref(false);

function resetPlanCode() {
  planCode.value = JSON.stringify(defaultPlanConfig, null, 2);
  planMessage.value = "";
  planError.value = false;
}

function applyPlanConfig() {
  try {
    const obj = JSON.parse(planCode.value);
    planConfig.value = {
      ...defaultPlanConfig,
      ...obj,
    };
    const key = userKey(LS_PLAN_BASE);
    localStorage.setItem(key, JSON.stringify(planConfig.value));
    planMessage.value =
      "✅ 学习任务计划已保存（当前账号的 wordTrainerPlanConfig）。";
    planError.value = false;
  } catch (e) {
    planMessage.value = "❌ 解析失败：" + e.message;
    planError.value = true;
  }
}

/* ========== 7. 卡片信息量配置 ========== */
const defaultCardConfig = {
  showPhonetic: true,
  withExample: true,
  allowNote: true,
};
const cardCode = ref("");
const cardConfig = ref({ ...defaultCardConfig });
const cardMessage = ref("");
const cardError = ref(false);

function resetCardCode() {
  cardCode.value = JSON.stringify(defaultCardConfig, null, 2);
  cardMessage.value = "";
  cardError.value = false;
}

function applyCardConfig() {
  try {
    const obj = JSON.parse(cardCode.value);
    cardConfig.value = {
      ...defaultCardConfig,
      ...obj,
    };
    const key = userKey(LS_CARD_BASE);
    localStorage.setItem(key, JSON.stringify(cardConfig.value));
    cardMessage.value =
      "✅ 卡片信息量设置已保存（当前账号的 wordTrainerCardConfig）。";
    cardError.value = false;
  } catch (e) {
    cardMessage.value = "❌ 解析失败：" + e.message;
    cardError.value = true;
  }
}

/* ========== 初始化：从 localStorage 读回设置 ========== */
onMounted(() => {
  // audio
  try {
    const audioKey = userKey(LS_AUDIO_BASE);
    const raw = localStorage.getItem(audioKey);
    if (raw) {
      const obj = JSON.parse(raw);
      audioConfig.value = { ...defaultAudioConfig, ...obj };
      audioCode.value = JSON.stringify(audioConfig.value, null, 2);
    } else {
      resetAudioCode();
    }
  } catch {
    resetAudioCode();
  }

  // buttons
  try {
    const btnKey = userKey(LS_BUTTONS_BASE);
    const raw = localStorage.getItem(btnKey);
    if (raw) {
      const obj = JSON.parse(raw);
      buttonLabels.value = { ...defaultButtonLabels, ...obj };
      buttonCode.value = JSON.stringify(buttonLabels.value, null, 2);
    } else {
      resetButtonCode();
    }
  } catch {
    resetButtonCode();
  }

  // theme
  try {
    const themeKey = userKey(LS_THEME_BASE);
    const raw = localStorage.getItem(themeKey);
    if (raw) {
      const obj = JSON.parse(raw);
      themeConfig.value = { ...defaultTheme, ...obj };
      themeCode.value = JSON.stringify(themeConfig.value, null, 2);
    } else {
      resetThemeCode();
    }
  } catch {
    resetThemeCode();
  }

  // story
  try {
    const key = userKey(LS_STORY_BASE);
    const raw = localStorage.getItem(key);
    if (raw) {
      const obj = JSON.parse(raw);
      storyConfig.value = { ...defaultStoryConfig, ...obj };
      storyCode.value = JSON.stringify(storyConfig.value, null, 2);
    } else {
      resetStoryCode();
    }
  } catch {
    resetStoryCode();
  }

  // mentor
  try {
    const key = userKey(LS_MENTOR_BASE);
    const raw = localStorage.getItem(key);
    if (raw) {
      const obj = JSON.parse(raw);
      mentorConfig.value = { ...defaultMentorConfig, ...obj };
      mentorCode.value = JSON.stringify(mentorConfig.value, null, 2);
    } else {
      resetMentorCode();
    }
  } catch {
    resetMentorCode();
  }

  // plan
  try {
    const key = userKey(LS_PLAN_BASE);
    const raw = localStorage.getItem(key);
    if (raw) {
      const obj = JSON.parse(raw);
      planConfig.value = { ...defaultPlanConfig, ...obj };
      planCode.value = JSON.stringify(planConfig.value, null, 2);
    } else {
      resetPlanCode();
    }
  } catch {
    resetPlanCode();
  }

  // card
  try {
    const key = userKey(LS_CARD_BASE);
    const raw = localStorage.getItem(key);
    if (raw) {
      const obj = JSON.parse(raw);
      cardConfig.value = { ...defaultCardConfig, ...obj };
      cardCode.value = JSON.stringify(cardConfig.value, null, 2);
    } else {
      resetCardCode();
    }
  } catch {
    resetCardCode();
  }
});
</script>

<style scoped>
.pg-page {
  max-width: 1120px;
  margin: 1.5rem auto;
  padding: 1.4rem 1.2rem 1.8rem;
  background: #ffffff;
  border-radius: 1.2rem;
  box-shadow: 0 2px 18px rgba(0, 0, 0, 0.05);
}
.pg-header h1 {
  font-size: 1.7rem;
  font-weight: 700;
  margin-bottom: 0.3rem;
  color: #1a202c;
}
.pg-sub {
  font-size: 0.9rem;
  color: #4a5568;
}
.pg-main {
  margin-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1.1rem;
}
.pg-section {
  border-radius: 0.9rem;
  border: 1px solid #e2e8f0;
  padding: 0.8rem 0.9rem 1rem;
  background: #f9fafb;
}
.pg-section-title h2 {
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
}
.pg-tip {
  font-size: 0.86rem;
  color: #4a5568;
}
.pg-grid {
  margin-top: 0.6rem;
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 2fr);
  gap: 0.8rem;
}
.pg-col {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}
.pg-small-title {
  font-size: 0.96rem;
  font-weight: 600;
  margin: 0;
}
.pg-text {
  font-size: 0.86rem;
  color: #4a5568;
}
.pg-list {
  margin: 0.2rem 0 0.2rem 1.1rem;
  padding: 0;
  font-size: 0.86rem;
  color: #4a5568;
}
.pg-list li + li {
  margin-top: 0.1rem;
}
.pg-code-card {
  background: #1a202c;
  color: #e2e8f0;
  border-radius: 0.8rem;
  padding: 0.6rem 0.6rem 0.7rem;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
}
.pg-code-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
  margin-bottom: 0.2rem;
  color: #a0aec0;
}
.pg-code-hint {
  font-size: 0.78rem;
  color: #a0aec0;
  margin: 0.2rem 0;
}
.pg-textarea {
  width: 100%;
  min-height: 110px;
  border-radius: 0.6rem;
  border: 1px solid #4a5568;
  background: #111827;
  color: #e2e8f0;
  font-family: Menlo, Monaco, Consolas, "Courier New", monospace;
  font-size: 0.82rem;
  padding: 0.4rem 0.5rem;
  resize: vertical;
  box-sizing: border-box;
}
.pg-actions-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0.4rem;
}
.btn-sm {
  display: inline-block;
  border-radius: 999px;
  padding: 0.28rem 0.85rem;
  border: none;
  background: #3182ce;
  color: #fff;
  font-size: 0.82rem;
  cursor: pointer;
}
.btn-sm:hover {
  background: #2b6cb0;
}
.btn-xs {
  border-radius: 999px;
  padding: 0.15rem 0.6rem;
  border: none;
  font-size: 0.75rem;
  cursor: pointer;
  background: #e2e8f0;
  color: #2d3748;
}
.btn-xs.ghost {
  background: #2d3748;
  color: #e2e8f0;
}
.btn-xs.ghost:hover {
  background: #4a5568;
}
.btn-sm.ghost {
  background: #2d3748;
  color: #e2e8f0;
}
.btn-sm.ghost:hover {
  background: #4a5568;
}
.pg-msg {
  margin-top: 0.35rem;
  font-size: 0.8rem;
}
.pg-msg.ok {
  color: #9ae6b4;
}
.pg-msg.err {
  color: #feb2b2;
}
/* 通用按钮风格（与 WordTrainer 保持一致） */
.btn-primary,
.btn-secondary {
  border-radius: 999px;
  padding: 0.35rem 1rem;
  border: none;
  font-size: 0.86rem;
}
.btn-primary {
  background: #38a169;
  color: #fff;
}
.btn-secondary {
  background: #edf2f7;
  color: #2d3748;
}
/* 预览区域 */
.pg-preview {
  margin-top: 0.5rem;
  padding-top: 0.45rem;
  border-top: 1px dashed #4a5568;
}
.pg-preview-title {
  font-size: 0.8rem;
  color: #a0aec0;
  margin-bottom: 0.25rem;
}
.pg-preview-buttons {
  display: flex;
  gap: 0.35rem;
  justify-content: flex-end;
}
/* 主题预览卡片 */
.pg-theme-preview {
  margin-top: 0.6rem;
  border-radius: 0.8rem;
  border: 1px solid #cbd5e0;
  padding: 0.6rem 0.7rem 0.7rem;
  background: #ffffff;
}
.pg-theme-badge {
  display: inline-block;
  padding: 0.12rem 0.5rem;
  border-radius: 999px;
  font-size: 0.76rem;
  background: #ebf8ff;
  color: #2b6cb0;
}
.pg-theme-title {
  margin-top: 0.3rem;
  font-size: 1rem;
  font-weight: 600;
  color: #1a202c;
}
.pg-theme-sub {
  margin-top: 0.15rem;
  font-size: 0.84rem;
  color: #4a5568;
}
.pg-theme-buttons {
  margin-top: 0.5rem;
  display: flex;
  justify-content: flex-end;
  gap: 0.35rem;
}
.preset-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin: 0.3rem 0;
}
/* 响应式 */
@media (max-width: 820px) {
  .pg-grid {
    grid-template-columns: minmax(0, 1fr);
  }
}
</style>
