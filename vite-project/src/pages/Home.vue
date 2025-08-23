<template>
  <div class="page">
    <!-- 英雄区域 -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title gradient-text animate-fade-in-up">
            AI创变营 · 青少年AI创新孵化平台
          </h1>
          <p class="hero-subtitle animate-fade-in-up">
            让孩子动手用AI做项目，解决真实问题，拒绝内卷和焦虑，孩子用能力赢未来！
          </p>
          
          <!-- 导航主按钮 -->
          <div class="hero-actions animate-fade-in-up">
            <router-link class="btn btn-primary" to="/faq">
              <span>🌟</span>
              核心优势
            </router-link>
            <router-link class="btn btn-secondary" to="/courses">
              <span>📚</span>
              成长路线&课程体系
            </router-link>
            <router-link class="btn btn-secondary" to="/showcase">
              <span>🏆</span>
              成果与展示
            </router-link>
            <router-link class="btn btn-secondary" to="/incubation">
              <span>🚀</span>
              企业孵化与合作
            </router-link>
            <router-link class="btn btn-accent" to="/signup">
              <span>✍️</span>
              立即报名
            </router-link>
            <router-link class="btn btn-secondary" to="/trial">
              <span>🎯</span>
              预约免费试听
            </router-link>
            <router-link class="btn btn-primary special" to="/ai-ask">
              <span>🤖</span>
              AI智能答疑
            </router-link>
          </div>
        </div>
      </div>
    </section>

    <!-- 品牌主优势横幅 -->
    <section class="section">
      <div class="container">
        <div class="features-banner card animate-fade-in-up">
          <div class="features-grid">
            <div class="feature-item">
              <span class="feature-icon">🌟</span>
              <span>从零基础到创新项目，AI能力和作品双收</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌟</span>
              <span>导师+AI全程陪伴，学习不孤单</span>
            </div>
            <div class="feature-item">
              <span class="feature-icon">🌟</span>
              <span>优秀者直通企业实习、孵化、融资与合作平台</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 快速导航卡片 -->
    <section class="section">
      <div class="container">
        <div class="section-header">
          <h2 class="section-title">快速导航</h2>
          <p class="section-subtitle">选择您感兴趣的领域，开启AI创新之旅</p>
        </div>
        
        <div class="nav-cards grid grid-cols-2">
          <router-link to="/courses" class="nav-card card">
            <div class="nav-card-icon">📚</div>
            <h3>课程体系</h3>
            <p>了解完整的AI学习路线，从启蒙到实战</p>
          </router-link>
          
          <router-link to="/showcase" class="nav-card card">
            <div class="nav-card-icon">🏆</div>
            <h3>成果展示</h3>
            <p>查看学员作品和项目成果</p>
          </router-link>
          
          <router-link to="/faq" class="nav-card card">
            <div class="nav-card-icon">❓</div>
            <h3>常见问题</h3>
            <p>解答关于AI创变营的疑问</p>
          </router-link>
          
          <router-link to="/incubation" class="nav-card card">
            <div class="nav-card-icon">🚀</div>
            <h3>企业合作</h3>
            <p>了解孵化与合作机会</p>
          </router-link>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="footer">
      <div class="container">
        <div class="footer-content">
          <div class="footer-brand">
            <h3 class="gradient-text">AI创变营</h3>
            <p>青少年AI创新孵化平台</p>
          </div>
          <div class="footer-links">
            <div class="footer-section">
              <h4>联系我们</h4>
              <p>官方公众号</p>
              <p>客服咨询</p>
            </div>
            <div class="footer-section">
              <h4>快速链接</h4>
              <router-link to="/signup">立即报名</router-link>
              <router-link to="/trial">免费试听</router-link>
            </div>
          </div>
        </div>
        <div class="footer-bottom">
          <p>© 2024 AI创变营 · 青少年AI创新孵化平台</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<style scoped>
.hero {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%);
  border-radius: 0 0 var(--radius-2xl) var(--radius-2xl);
  margin-bottom: var(--space-16);
  position: relative;
  overflow: hidden;
}

.hero::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="%23ffffff" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="%23ffffff" opacity="0.1"/><circle cx="10" cy="60" r="0.5" fill="%23ffffff" opacity="0.1"/><circle cx="90" cy="40" r="0.5" fill="%23ffffff" opacity="0.1"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 1;
}

.hero-title {
  font-size: clamp(2rem, 5vw, var(--text-5xl));
  margin-bottom: var(--space-6);
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.hero-subtitle {
  font-size: clamp(1.1rem, 2.5vw, var(--text-xl));
  margin-bottom: var(--space-8);
  max-width: 800px;
  margin-left: auto;
  margin-right: auto;
  color: var(--gray-700);
}

.hero-actions {
  display: flex;
  gap: var(--space-3);
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.hero-actions .btn {
  min-width: 140px;
}

.btn.special {
  background: linear-gradient(135deg, var(--accent-400) 0%, var(--accent-500) 100%);
  color: white;
  box-shadow: var(--shadow-lg);
  transform: scale(1.05);
}

.btn.special:hover {
  background: linear-gradient(135deg, var(--accent-500) 0%, var(--accent-600) 100%);
  transform: scale(1.05) translateY(-2px);
  box-shadow: var(--shadow-xl);
}

/* 特性横幅 */
.features-banner {
  background: linear-gradient(135deg, var(--primary-50) 0%, var(--accent-50) 100%);
  border: none;
  box-shadow: var(--shadow-lg);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-6);
}

.feature-item {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  font-size: var(--text-lg);
  font-weight: 600;
  color: var(--gray-800);
}

.feature-icon {
  font-size: var(--text-2xl);
  flex-shrink: 0;
}

/* 导航卡片 */
.nav-cards {
  margin-top: var(--space-8);
}

.nav-card {
  text-decoration: none;
  color: inherit;
  transition: all 0.3s ease;
  border: 2px solid transparent;
  position: relative;
  overflow: hidden;
}

.nav-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(59, 130, 246, 0.1), transparent);
  transition: left 0.5s ease;
}

.nav-card:hover::before {
  left: 100%;
}

.nav-card:hover {
  border-color: var(--primary-200);
  transform: translateY(-4px);
  box-shadow: var(--shadow-xl);
}

.nav-card-icon {
  font-size: var(--text-4xl);
  margin-bottom: var(--space-4);
  display: block;
}

.nav-card h3 {
  color: var(--gray-900);
  margin-bottom: var(--space-2);
}

.nav-card p {
  color: var(--gray-600);
  margin-bottom: 0;
}

/* 页脚 */
.footer {
  background: var(--gray-900);
  color: white;
  margin-top: var(--space-20);
  padding: var(--space-16) 0 var(--space-8);
}

.footer-content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: var(--space-12);
  margin-bottom: var(--space-8);
}

.footer-brand h3 {
  font-size: var(--text-2xl);
  margin-bottom: var(--space-2);
}

.footer-brand p {
  color: var(--gray-400);
  margin-bottom: 0;
}

.footer-links {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-8);
}

.footer-section h4 {
  color: var(--gray-300);
  margin-bottom: var(--space-3);
  font-size: var(--text-sm);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-section p,
.footer-section a {
  color: var(--gray-400);
  margin-bottom: var(--space-2);
  display: block;
  transition: color 0.2s ease;
}

.footer-section a:hover {
  color: var(--primary-400);
}

.footer-bottom {
  border-top: 1px solid var(--gray-800);
  padding-top: var(--space-6);
  text-align: center;
}

.footer-bottom p {
  color: var(--gray-500);
  margin-bottom: 0;
  font-size: var(--text-sm);
}

/* 响应式设计 */
@media (max-width: 768px) {
  .hero-actions {
    flex-direction: column;
    align-items: center;
  }
  
  .hero-actions .btn {
    width: 100%;
    max-width: 280px;
  }
  
  .features-grid {
    grid-template-columns: 1fr;
  }
  
  .nav-cards {
    grid-template-columns: 1fr;
  }
  
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--space-8);
  }
  
  .footer-links {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
}

@media (max-width: 640px) {
  .hero {
    padding: var(--space-12) 0;
  }
  
  .hero-title {
    font-size: var(--text-3xl);
  }
  
  .hero-subtitle {
    font-size: var(--text-lg);
  }
  
  .features-grid {
    gap: var(--space-4);
  }
  
  .feature-item {
    font-size: var(--text-base);
  }
}
</style>
