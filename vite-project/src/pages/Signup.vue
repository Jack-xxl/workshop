<template>
  <div class="page">
    <div class="container-sm">
      <!-- 页面标题 -->
      <div class="section-header text-center">
        <h1 class="section-title gradient-text">✍️ 立即报名</h1>
        <p class="section-subtitle">抢占AI时代的起跑线，让孩子成为未来的AI创新者</p>
      </div>

      <!-- 报名表单 -->
      <div class="signup-container card">
        <div class="signup-header">
          <h2>立即报名 · 抢占AI时代的起跑线</h2>
          <p class="signup-description">
            填写信息，即可预约免费试听课或申请成为首批AI创新营学员！名额有限，报名即享专属成长规划建议、课程大礼包和平台优先推荐资格。
          </p>
        </div>

        <form @submit.prevent="handleSubmit" class="signup-form">
          <div class="form-grid">
            <div class="form-group">
              <label class="form-label">家长姓名 <span class="required">*</span></label>
              <input 
                v-model="parentName" 
                required 
                class="form-input"
                placeholder="请输入家长姓名"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">联系方式 <span class="required">*</span></label>
              <input 
                v-model="contact" 
                type="tel" 
                required 
                class="form-input"
                placeholder="请输入手机号码"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">孩子姓名</label>
              <input 
                v-model="childName" 
                class="form-input"
                placeholder="请输入孩子姓名"
              />
            </div>
            
            <div class="form-group">
              <label class="form-label">孩子年龄</label>
              <input 
                v-model="age" 
                type="number" 
                min="4" 
                max="22" 
                class="form-input"
                placeholder="请输入孩子年龄"
              />
            </div>
            
            <div class="form-group full-width">
              <label class="form-label">课程意向</label>
              <select v-model="intention" class="form-select">
                <option value="AI兴趣启蒙（6-9岁）">AI兴趣启蒙（6-9岁）</option>
                <option value="AI项目实战（10岁及以上）">AI项目实战（10岁及以上）</option>
                <option value="AI少年实验室（高阶晋级）">AI少年实验室（高阶晋级）</option>
              </select>
            </div>
            
            <div class="form-group full-width">
              <label class="form-label">留言（可选）</label>
              <textarea 
                v-model="msg" 
                class="form-textarea"
                placeholder="请输入您的留言或特殊需求"
              ></textarea>
            </div>
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary btn-large">
              <span class="btn-icon">🚀</span>
              提交报名
            </button>
          </div>
        </form>

        <!-- 成功提示 -->
        <div v-if="submitted" class="success-message">
          <div class="success-icon">🎉</div>
          <div class="success-content">
            <h3>报名成功！</h3>
            <p>我们将在24小时内联系您，欢迎关注官方公众号或加老师微信，获取更多课程与福利信息。</p>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="contact-info">
          <h4>📞 联系我们</h4>
          <p>如有疑问，可联系客服：<strong>400-xxxxxxx</strong> 或加微信咨询老师。</p>
        </div>
      </div>

      <!-- 报名优势 -->
      <div class="benefits-section">
        <div class="section-header">
          <h2 class="section-title">🌟 报名即享特权</h2>
          <p class="section-subtitle">成为首批学员，享受更多专属福利</p>
        </div>
        
        <div class="benefits-grid">
          <div class="benefit-card card">
            <div class="benefit-icon">🎁</div>
            <h3>专属大礼包</h3>
            <p>包含学习资料、工具软件、项目模板等价值千元的AI学习资源</p>
          </div>
          
          <div class="benefit-card card">
            <div class="benefit-icon">📋</div>
            <h3>成长规划</h3>
            <p>专业导师一对一制定个性化学习计划，科学规划AI成长路径</p>
          </div>
          
          <div class="benefit-card card">
            <div class="benefit-icon">⭐</div>
            <h3>优先推荐</h3>
            <p>优秀学员优先获得企业实习、项目合作、创业孵化等机会</p>
          </div>
          
          <div class="benefit-card card">
            <div class="benefit-icon">🎯</div>
            <h3>试听体验</h3>
            <p>免费体验AI项目课堂，感受不一样的AI学习方式</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const parentName = ref('')
const contact = ref('')
const childName = ref('')
const age = ref('')
const intention = ref('AI兴趣启蒙（6-9岁）')
const msg = ref('')
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  // 后续可接入后端或第三方表单
}
</script>

<style scoped>
.signup-container {
  margin-bottom: var(--space-12);
}

.signup-header {
  text-align: center;
  margin-bottom: var(--space-8);
}

.signup-header h2 {
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.signup-description {
  color: var(--gray-600);
  line-height: var(--leading-relaxed);
  margin-bottom: 0;
}

.signup-form {
  margin-bottom: var(--space-6);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.required {
  color: var(--error-500);
  margin-left: var(--space-1);
}

.form-actions {
  text-align: center;
}

.btn-large {
  padding: var(--space-4) var(--space-8);
  font-size: var(--text-lg);
}

/* 成功提示 */
.success-message {
  display: flex;
  align-items: flex-start;
  gap: var(--space-4);
  padding: var(--space-6);
  background: var(--success-50);
  border: 2px solid var(--success-200);
  border-radius: var(--radius-xl);
  margin: var(--space-6) 0;
}

.success-icon {
  font-size: var(--text-4xl);
  flex-shrink: 0;
}

.success-content h3 {
  color: var(--success-700);
  margin-bottom: var(--space-2);
}

.success-content p {
  color: var(--success-600);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

/* 联系信息 */
.contact-info {
  background: var(--gray-50);
  border-radius: var(--radius-lg);
  padding: var(--space-4);
  margin-top: var(--space-6);
}

.contact-info h4 {
  color: var(--gray-800);
  margin-bottom: var(--space-2);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.contact-info p {
  color: var(--gray-600);
  margin-bottom: 0;
}

/* 报名优势 */
.benefits-section {
  margin-top: var(--space-16);
}

.benefits-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.benefit-card {
  text-align: center;
  transition: all 0.3s ease;
}

.benefit-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.benefit-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
  display: block;
}

.benefit-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.benefit-card p {
  color: var(--gray-600);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
    gap: var(--space-3);
  }
  
  .benefits-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .success-message {
    flex-direction: column;
    text-align: center;
  }
}

@media (max-width: 640px) {
  .signup-container {
    padding: var(--space-4);
  }
  
  .benefits-grid {
    grid-template-columns: 1fr;
  }
  
  .btn-large {
    width: 100%;
  }
}
</style>
