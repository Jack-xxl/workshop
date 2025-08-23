<template>
  <div class="page">
    <div class="container-md">
      <!-- 页面标题 -->
      <div class="section-header text-center">
        <h1 class="section-title gradient-text">🤖 AI 智能答疑</h1>
        <p class="section-subtitle">专业解答 Python、Scratch、AI 学习相关问题，为您的AI学习之旅保驾护航</p>
      </div>

      <!-- 问答区域 -->
      <div class="qa-container card">
        <div class="qa-header">
          <h2>AI 问答（仅限 Python / Scratch / AI 学习）</h2>
          <p class="qa-description">请输入您的问题，我们的AI助手将为您提供专业解答</p>
        </div>

        <!-- 输入表单 -->
        <div class="qa-form">
          <div class="form-row">
            <div class="input-group">
              <label class="form-label">问题内容</label>
              <input
                v-model="question"
                placeholder="请输入与 Python / Scratch / AI 学习相关的问题"
                class="form-input"
                @keyup.enter="submit"
              />
            </div>
          </div>
          
          <div class="form-row">
            <div class="input-group">
              <label class="form-label">年龄（可选）</label>
              <select v-model="age" class="form-select">
                <option value="">请选择年龄</option>
                <option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>
                <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option>
                <option>18</option><option>19</option><option>20</option><option>25</option><option>30</option>
              </select>
            </div>
            
            <div class="button-group">
              <button 
                :disabled="loading" 
                @click="submit" 
                class="btn btn-primary"
                :class="{ 'loading': loading }"
              >
                <span v-if="!loading" class="btn-icon">🚀</span>
                <span v-if="loading" class="btn-icon loading-spinner">⏳</span>
                {{ loading ? "思考中…" : "提交问题" }}
              </button>
            </div>
          </div>
        </div>

        <!-- 错误提示 -->
        <div v-if="error" class="error-message">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>

        <!-- 答案显示 -->
        <div v-if="answer" class="answer-container">
          <div class="answer-header">
            <span class="answer-icon">💡</span>
            <h3>AI 回答</h3>
          </div>
          <div class="answer-content">
            <pre>{{ answer }}</pre>
          </div>
        </div>

        <!-- 使用提示 -->
        <div class="usage-tips">
          <h4>💡 使用提示</h4>
          <ul>
            <li>问题越具体，回答越准确</li>
            <li>可以询问编程概念、项目思路、学习方法等</li>
            <li>年龄信息有助于提供更适合的解答</li>
            <li>支持中英文提问</li>
          </ul>
        </div>
      </div>

      <!-- 常见问题 -->
      <div class="faq-section">
        <div class="section-header">
          <h2 class="section-title">❓ 常见问题类型</h2>
          <p class="section-subtitle">了解AI助手能回答哪些类型的问题</p>
        </div>
        
        <div class="faq-grid">
          <div class="faq-card card">
            <div class="faq-icon">🐍</div>
            <h3>Python 编程</h3>
            <p>语法问题、算法思路、项目实战、最佳实践</p>
          </div>
          
          <div class="faq-card card">
            <div class="faq-icon">🎮</div>
            <h3>Scratch 编程</h3>
            <p>积木搭建、游戏设计、动画制作、逻辑思维</p>
          </div>
          
          <div class="faq-card card">
            <div class="faq-icon">🤖</div>
            <h3>AI 学习</h3>
            <p>AI工具使用、机器学习基础、项目应用</p>
          </div>
          
          <div class="faq-card card">
            <div class="faq-icon">📚</div>
            <h3>学习方法</h3>
            <p>学习路径、资源推荐、实践建议、进阶指导</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { askAi } from "../services/qwenService";

const question = ref("");
const age = ref("");
const answer = ref("");
const error = ref("");
const loading = ref(false);

async function submit() {
  answer.value = "";
  error.value = "";
  const q = question.value.trim();
  if (!q) { 
    error.value = "请输入问题"; 
    return; 
  }

  loading.value = true;
  try {
    const data = await askAi(q, age.value || undefined);
    answer.value = data?.answer ?? JSON.stringify(data);
  } catch (e) {
    console.error("[UI] submit error:", e);
    error.value = e?.response?.data?.error || e.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.qa-container {
  margin-bottom: var(--space-12);
}

.qa-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.qa-header h2 {
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.qa-description {
  color: var(--gray-600);
  margin-bottom: 0;
}

.qa-form {
  margin-bottom: var(--space-6);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--space-4);
  align-items: end;
  margin-bottom: var(--space-4);
}

.input-group {
  display: flex;
  flex-direction: column;
}

.button-group {
  display: flex;
  align-items: flex-end;
}

.btn.loading {
  opacity: 0.8;
  cursor: not-allowed;
}

.btn-icon {
  margin-right: var(--space-2);
}

.loading-spinner {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* 错误提示 */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-4);
  background: var(--error-50);
  border: 1px solid var(--error-200);
  border-radius: var(--radius-lg);
  color: var(--error-700);
  margin-bottom: var(--space-4);
}

.error-icon {
  font-size: var(--text-lg);
}

/* 答案显示 */
.answer-container {
  margin: var(--space-6) 0;
  border: 2px solid var(--primary-100);
  border-radius: var(--radius-xl);
  overflow: hidden;
}

.answer-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--primary-50);
  border-bottom: 1px solid var(--primary-100);
}

.answer-icon {
  font-size: var(--text-xl);
}

.answer-header h3 {
  margin-bottom: 0;
  color: var(--primary-700);
}

.answer-content {
  padding: var(--space-4);
  background: white;
}

.answer-content pre {
  margin: 0;
  white-space: pre-wrap;
  word-wrap: break-word;
  line-height: var(--leading-relaxed);
  color: var(--gray-800);
  font-family: var(--font-mono);
  font-size: var(--text-sm);
}

/* 使用提示 */
.usage-tips {
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-6);
}

.usage-tips h4 {
  color: var(--gray-800);
  margin-bottom: var(--space-3);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.usage-tips ul {
  margin: 0;
  padding-left: var(--space-6);
}

.usage-tips li {
  color: var(--gray-700);
  margin-bottom: var(--space-2);
}

/* FAQ 部分 */
.faq-section {
  margin-top: var(--space-16);
}

.faq-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.faq-card {
  text-align: center;
  transition: all 0.3s ease;
}

.faq-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.faq-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
  display: block;
}

.faq-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.faq-card p {
  color: var(--gray-600);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .button-group {
    justify-content: stretch;
  }
  
  .btn {
    width: 100%;
  }
  
  .faq-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
}

@media (max-width: 640px) {
  .qa-container {
    padding: var(--space-4);
  }
  
  .faq-grid {
    grid-template-columns: 1fr;
  }
  
  .answer-content pre {
    font-size: var(--text-xs);
  }
}
</style>