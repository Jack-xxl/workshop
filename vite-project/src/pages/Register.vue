<template>
  <div class="auth-page">
    <h1 class="title">注册新账号</h1>

    <div class="form">
      <label>邮箱</label>
      <input v-model="email" type="email" placeholder="输入邮箱" />

      <label>密码</label>
      <input v-model="password" type="password" placeholder="输入密码" />

      <button class="btn-primary" @click="handleRegister">注册</button>

      <p class="tip">
        已有账号？
        <router-link to="/login">立即登录</router-link>
      </p>

      <p v-if="message" class="msg">{{ message }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const email = ref("");
const password = ref("");
const message = ref("");

const router = useRouter();

function handleRegister() {
  if (!email.value || !password.value) {
    message.value = "❌ 邮箱和密码不能为空。";
    return;
  }

  const raw = localStorage.getItem("user-db");
  const db = raw ? JSON.parse(raw) : {};

  if (db[email.value]) {
    message.value = "❌ 该邮箱已注册，请直接登录。";
    return;
  }

  // 写入数据库
  db[email.value] = { email: email.value, password: password.value };
  localStorage.setItem("user-db", JSON.stringify(db));

  message.value = "✅ 注册成功！正在跳转到登录...";
  setTimeout(() => router.push("/login"), 800);
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
  color: #dd6b20;
}
</style>
