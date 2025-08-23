<template>
  <div class="page">
    <div class="container-md">
      <!-- 页面标题 -->
      <div class="section-header text-center">
        <h1 class="section-title gradient-text">🎯 预约免费试听</h1>
        <p class="section-subtitle">体验不一样的AI成长之路，先体验，后决定！</p>
      </div>

      <!-- 试听介绍 -->
      <div class="trial-intro card">
        <div class="intro-header">
          <h2>预约免费试听 · 体验不一样的AI成长之路</h2>
          <p class="intro-highlight">
            0元体验AI项目课堂，先体验，后决定！让孩子和家长都能直观感受AI智能坊的成长魅力。
          </p>
        </div>

        <div class="benefits-box">
          <h3>🎁 试听课你将收获：</h3>
          <ul class="benefits-list">
            <li>真实体验AI项目式学习流程，不只是"编程"</li>
            <li>学会用AI工具解决一个小实际问题（或制作作品雏形）</li>
            <li>体验导师互动答疑与AI智能辅助教学</li>
            <li>了解未来成长路线和晋级通道，感受"非内卷式"教育氛围</li>
            <li>试听后可获个性化成长建议和学习报告</li>
          </ul>
          <div class="highlight-note">
            试听不收取任何费用，名额有限，先到先得！
          </div>
        </div>
      </div>

      <!-- 预约表单 -->
      <div class="trial-form-container card">
        <div class="form-header">
          <h3>📝 预约信息</h3>
          <p>填写基本信息，我们将在24小时内与您联系安排试听</p>
        </div>

        <form @submit.prevent="handleSubmit" class="trial-form">
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
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-success btn-large">
              <span class="btn-icon">🎯</span>
              提交预约
            </button>
          </div>
        </form>

        <!-- 成功提示 -->
        <div v-if="submitted" class="success-message">
          <div class="success-icon">🎉</div>
          <div class="success-content">
            <h3>预约成功！</h3>
            <p>我们会尽快与您联系安排试听，欢迎关注官方公众号或加老师微信咨询。</p>
          </div>
        </div>

        <!-- 联系信息 -->
        <div class="contact-info">
          <h4>📞 咨询方式</h4>
          <p>咨询电话：<strong>400-xxxxxxx</strong> &nbsp; | &nbsp; 微信/公众号咨询</p>
        </div>
      </div>

      <!-- 试听流程 -->
      <div class="process-section">
        <div class="section-header">
          <h2 class="section-title">🔄 试听流程</h2>
          <p class="section-subtitle">简单四步，开启AI学习体验</p>
        </div>
        
        <div class="process-steps">
          <div class="process-step">
            <div class="step-number">1</div>
            <div class="step-content">
              <h3>填写预约</h3>
              <p>填写基本信息，选择合适的时间</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">2</div>
            <div class="step-content">
              <h3>确认安排</h3>
              <p>老师24小时内联系确认试听时间</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">3</div>
            <div class="step-content">
              <h3>体验课堂</h3>
              <p>参与90分钟AI项目体验课</p>
            </div>
          </div>
          
          <div class="process-step">
            <div class="step-number">4</div>
            <div class="step-content">
              <h3>获得反馈</h3>
              <p>收到个性化学习建议和成长报告</p>
            </div>
          </div>
        </div>
      </div>

      <!-- 为什么选择我们 -->
      <div class="why-choose-section">
        <div class="section-header">
          <h2 class="section-title">💎 为什么选择AI创变营</h2>
          <p class="section-subtitle">独特的教学模式，让孩子爱上AI学习</p>
        </div>
        
        <div class="features-grid">
          <div class="feature-card card">
            <div class="feature-icon">🎯</div>
            <h3>项目驱动</h3>
            <p>不是枯燥的编程课，而是有趣的AI项目实践</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">👨‍🏫</div>
            <h3>导师陪伴</h3>
            <p>专业导师全程指导，AI助教智能辅助</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🚀</div>
            <h3>能力培养</h3>
            <p>培养创新思维、解决问题、团队协作能力</p>
          </div>
          
          <div class="feature-card card">
            <div class="feature-icon">🌟</div>
            <h3>成果导向</h3>
            <p>每个孩子都能完成自己的AI作品</p>
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
const submitted = ref(false)

function handleSubmit() {
  submitted.value = true
  // 可对接后端或第三方表单系统
}
</script>

<style scoped>
.trial-intro {
  margin-bottom: var(--space-8);
}

.intro-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.intro-header h2 {
  color: var(--gray-900);
  margin-bottom: var(--space-4);
}

.intro-highlight {
  color: var(--primary-600);
  font-weight: 600;
  font-size: var(--text-lg);
  margin-bottom: 0;
}

.benefits-box {
  background: var(--primary-50);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 2px solid var(--primary-100);
}

.benefits-box h3 {
  color: var(--primary-700);
  margin-bottom: var(--space-4);
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.benefits-list {
  margin: 0 0 var(--space-4) 0;
  padding-left: var(--space-6);
}

.benefits-list li {
  color: var(--gray-700);
  margin-bottom: var(--space-2);
  line-height: var(--leading-relaxed);
}

.highlight-note {
  color: var(--accent-600);
  font-weight: 600;
  padding: var(--space-3);
  background: var(--accent-50);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--accent-500);
}

/* 预约表单 */
.trial-form-container {
  margin-bottom: var(--space-12);
}

.form-header {
  text-align: center;
  margin-bottom: var(--space-6);
}

.form-header h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.form-header p {
  color: var(--gray-600);
  margin-bottom: 0;
}

.trial-form {
  margin-bottom: var(--space-6);
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-4);
  margin-bottom: var(--space-6);
}

.required {
  color: var(--error-500);
  margin-left: var(--space-1);
}

.form-actions {
  text-align: center;
}

.btn-success {
  background: linear-gradient(135deg, var(--success-500) 0%, var(--success-600) 100%);
  color: white;
  box-shadow: var(--shadow-md);
}

.btn-success:hover {
  background: linear-gradient(135deg, var(--success-600) 0%, var(--success-700) 100%);
  box-shadow: var(--shadow-lg);
  transform: translateY(-1px);
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

/* 试听流程 */
.process-section {
  margin: var(--space-16) 0;
}

.process-steps {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.process-step {
  text-align: center;
  position: relative;
}

.process-step:not(:last-child)::after {
  content: '';
  position: absolute;
  top: 40px;
  right: -30px;
  width: 60px;
  height: 2px;
  background: var(--primary-200);
  display: none;
}

@media (min-width: 1024px) {
  .process-step:not(:last-child)::after {
    display: block;
  }
}

.step-number {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-500) 0%, var(--primary-600) 100%);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: var(--text-2xl);
  font-weight: 800;
  margin: 0 auto var(--space-4);
  box-shadow: var(--shadow-md);
}

.step-content h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.step-content p {
  color: var(--gray-600);
  margin-bottom: 0;
  line-height: var(--leading-relaxed);
}

/* 为什么选择我们 */
.why-choose-section {
  margin-top: var(--space-16);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-6);
  margin-top: var(--space-8);
}

.feature-card {
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.feature-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
  display: block;
}

.feature-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-3);
}

.feature-card p {
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
  
  .process-steps {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .features-grid {
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  }
  
  .success-message {
    flex-direction: column;
    text-align: center;
  }
  
  .process-step:not(:last-child)::after {
    display: none;
  }
}

@media (max-width: 640px) {
  .trial-intro,
  .trial-form-container {
    padding: var(--space-4);
  }
  
  .benefits-box {
    padding: var(--space-4);
  }
  
  .process-steps {
    grid-template-columns: 1fr;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .btn-large {
    width: 100%;
  }
}
</style>
