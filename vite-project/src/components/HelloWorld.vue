<script setup>
import { ref } from 'vue'

const isMenuOpen = ref(false)

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}
</script>

<template>
  <nav class="navbar">
    <div class="container">
      <div class="navbar-content">
        <!-- Logo -->
        <router-link to="/" class="navbar-brand">
          <span class="brand-icon">🤖</span>
          <span class="brand-text">AI创变营</span>
        </router-link>

        <!-- 导航菜单 -->
        <div class="navbar-menu" :class="{ 'active': isMenuOpen }">
          <router-link to="/" class="nav-link">首页</router-link>
          <router-link to="/courses" class="nav-link">课程体系</router-link>
          <router-link to="/showcase" class="nav-link">成果展示</router-link>
          <router-link to="/faq" class="nav-link">核心优势</router-link>
          <router-link to="/incubation" class="nav-link">企业合作</router-link>
          <router-link to="/ai-ask" class="nav-link">AI答疑</router-link>
        </div>

        <!-- 行动按钮 -->
        <div class="navbar-actions">
          <router-link to="/trial" class="btn btn-secondary btn-sm">免费试听</router-link>
          <router-link to="/signup" class="btn btn-primary btn-sm">立即报名</router-link>
        </div>

        <!-- 移动端菜单按钮 -->
        <button class="navbar-toggle" @click="toggleMenu">
          <span class="hamburger" :class="{ 'active': isMenuOpen }"></span>
        </button>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.navbar {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid var(--gray-100);
  position: sticky;
  top: 0;
  z-index: 1000;
  box-shadow: var(--shadow-sm);
}

.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-4) 0;
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  text-decoration: none;
  font-weight: 800;
  font-size: var(--text-xl);
  color: var(--gray-900);
}

.brand-icon {
  font-size: var(--text-2xl);
}

.brand-text {
  background: linear-gradient(135deg, var(--primary-600) 0%, var(--accent-500) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.navbar-menu {
  display: flex;
  align-items: center;
  gap: var(--space-6);
}

.nav-link {
  color: var(--gray-600);
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s ease;
  position: relative;
}

.nav-link:hover {
  color: var(--primary-600);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 0;
  height: 2px;
  background: var(--primary-500);
  transition: width 0.2s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.navbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.btn-sm {
  padding: var(--space-2) var(--space-4);
  font-size: var(--text-sm);
}

.navbar-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
}

.hamburger {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--gray-600);
  position: relative;
  transition: all 0.3s ease;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 20px;
  height: 2px;
  background: var(--gray-600);
  transition: all 0.3s ease;
}

.hamburger::before {
  top: -6px;
}

.hamburger::after {
  bottom: -6px;
}

.hamburger.active {
  background: transparent;
}

.hamburger.active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

/* 响应式设计 */
@media (max-width: 768px) {
  .navbar-menu {
    position: fixed;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    flex-direction: column;
    padding: var(--space-6);
    gap: var(--space-4);
    border-top: 1px solid var(--gray-100);
    box-shadow: var(--shadow-lg);
    transform: translateY(-100%);
    opacity: 0;
    visibility: hidden;
    transition: all 0.3s ease;
  }

  .navbar-menu.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .navbar-actions {
    display: none;
  }

  .navbar-toggle {
    display: block;
  }

  .nav-link {
    font-size: var(--text-lg);
    padding: var(--space-2) 0;
  }
}

@media (max-width: 640px) {
  .navbar-content {
    padding: var(--space-3) 0;
  }

  .brand-text {
    font-size: var(--text-lg);
  }

  .brand-icon {
    font-size: var(--text-xl);
  }
}
</style>
