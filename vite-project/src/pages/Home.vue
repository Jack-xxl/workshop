<template>
  <div style="max-width:700px;margin:2em auto;padding:2em 1em;background:#fff;border-radius:1.5em;box-shadow:0 2px 16px rgba(0,0,0,0.07);">
    <!-- 顶部LOGO和主标题 -->
    <h1 style="text-align:center;color:#2d3748;font-size:2.3em;font-weight:800;margin-bottom:0.5em;">
      AI创变营 · 青少年AI创新孵化平台
    </h1>
    <p style="text-align:center;color:#1a202c;font-size:1.2em;margin-bottom:2em;">
      让孩子动手用AI做项目，解决真实问题，拒绝内卷和焦虑，孩子用能力赢未来！
    </p>
    <!-- 导航主按钮 -->
    <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:1em;margin-bottom:2em;">
      <router-link class="main-nav-btn" to="/faq">核心优势</router-link>
      <router-link class="main-nav-btn" to="/courses">成长路线&课程体系</router-link>
      <router-link class="main-nav-btn" to="/showcase">成果与展示</router-link>
      <router-link class="main-nav-btn" to="/incubation">企业孵化与合作</router-link>
      <router-link class="main-nav-btn" to="/signup">立即报名</router-link>
      <router-link class="main-nav-btn" to="/trial">预约免费试听</router-link>
      <router-link class="main-nav-btn special" to="/ai-ask">AI智能答疑</router-link>
    </div>
    <!-- 品牌主优势横幅 -->
    <ul style="background:#f7fafc;padding:1.2em 1em;border-radius:1em;margin-bottom:2em;font-size:1.08em;">
      <li>🌟 从零基础到创新项目，AI能力和作品双收</li>
      <li>🌟 导师+AI全程陪伴，学习不孤单</li>
      <li>🌟 优秀者直通企业实习、孵化、融资与合作平台</li>
    </ul>
    <!-- Footer -->
    <footer style="text-align:center;margin-top:2em;color:#718096;">
      <div>AI创变营 · 青少年AI创新孵化平台 © 2024</div>
      <div style="margin-top:0.5em;">官方公众号｜联系我们</div>
    </footer>
  </div>
</template>

<style>
.main-nav-btn {
  display:inline-block;
  background:#3182ce;
  color:#fff;
  font-size:1.08em;
  padding:0.8em 1.5em;
  border-radius:0.7em;
  font-weight:600;
  margin:0.3em 0.2em;
  text-decoration:none;
  transition:background .18s;
}
.main-nav-btn:hover,
.main-nav-btn.special:hover {
  background:#2b6cb0;
}
.special {
  background:#f6ad55;
  color:#1a202c;
}
.special:hover {
  background:#dd6b20;
  color:#fff;
}
</style>
