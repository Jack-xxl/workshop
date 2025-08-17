<template>
  <div style="max-width: 720px; margin: 40px auto;">
    <h2>AI 问答（仅限 Python / Scratch / AI 学习）</h2>

    <div style="display:flex; gap:8px; margin-top:12px; align-items:center;">
      <input
        v-model="question"
        placeholder="请输入与 Python / Scratch / AI 学习相关的问题"
        style="flex:1; padding:8px; border:1px solid #ddd; border-radius:8px;"
        @keyup.enter="submit"
      />
      <select v-model="age" style="padding:8px; border:1px solid #ddd; border-radius:8px;">
        <option value="">年龄</option>
        <option>8</option><option>9</option><option>10</option><option>11</option><option>12</option>
        <option>13</option><option>14</option><option>15</option><option>16</option><option>17</option>
        <option>18</option><option>19</option><option>20</option><option>25</option><option>30</option>
      </select>
      <button :disabled="loading" @click="submit" style="padding:8px 16px; border-radius:8px;">
        {{ loading ? "思考中…" : "提问" }}
      </button>
    </div>

    <p v-if="error" style="color:#d33; margin-top:12px;">{{ error }}</p >
    <pre v-if="answer" style="margin-top:12px; white-space:pre-wrap;">{{ answer }}</pre>
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
  if (!q) { error.value = "请输入问题"; return; }

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