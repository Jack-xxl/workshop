<template>
  <div class="auth-page">
    <h1 class="title">登录账号</h1>

    <div class="form">
      <label>用户名</label>
      <input v-model="username" type="text" placeholder="输入用户名" @keyup.enter="handleLogin" />

      <label>密码</label>
      <input v-model="password" type="password" placeholder="输入密码" @keyup.enter="handleLogin" />

      <button class="btn-primary" @click="handleLogin" :disabled="loading">
        {{ loading ? "登录中..." : "登录" }}
      </button>

      <p v-if="message" :class="['msg', messageType]">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { login } from "../services/authService";

const username = ref("");
const password = ref("");
const message = ref("");
const messageType = ref("error");
const loading = ref(false);

const router = useRouter();
const route = useRoute();

async function handleLogin() {
  if (!username.value || !password.value) {
    message.value = "❌ 请输入用户名和密码";
    messageType.value = "error";
    return;
  }

  loading.value = true;
  message.value = "";

  try {
    await login(username.value, password.value);
    message.value = "✅ 登录成功！正在跳转...";
    messageType.value = "success";
    
    // Redirect to intended page or home
    const redirect = route.query.redirect || "/";
    setTimeout(() => router.push(redirect), 800);
  } catch (err) {
    message.value = `❌ ${err.message || "登录失败，请检查用户名和密码"}`;
    messageType.value = "error";
    loading.value = false;
  }
}
</script>

<style scoped>
.auth-page {
  max-width: 360px;
  margin: 2rem auto;
  padding: 1.5rem;
  background: #ffffff;
  border-radius: 1rem;
  box-shadow: 0 2px 18px rgba(0, 0, 0, 0.06);
}

.title {
  text-align: center;
  margin-bottom: 1rem;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

input {
  border: 1px solid #cbd5e0;
  border-radius: 0.5rem;
  padding: 0.45rem;
  font-size: 0.95rem;
}

.btn-primary {
  background: #3182ce;
  color: white;
  border: none;
  padding: 0.5rem;
  border-radius: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background: #2b6cb0;
}

.tip {
  font-size: 0.85rem;
  text-align: center;
  color: #4a5568;
}

.msg {
  margin-top: 0.4rem;
  text-align: center;
  font-size: 0.9rem;
}

.msg.error {
  color: #e53e3e;
}

.msg.success {
  color: #38a169;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
