<template>
  <div style="max-width: 520px; margin: 0 auto; padding: 36px 10px;">
    <h2 style="font-size:1.5em; margin-bottom:0.6em;">
      预约免费试听 · 体验不一样的AI成长之路
    </h2>
    <p style="margin-bottom:1.2em; color:#3067ef; font-weight:bold;">
      0元体验AI项目课堂，先体验，后决定！让孩子和家长都能直观感受AI智能坊的成长魅力。
    </p>

    <div style="background:#f5f7fa; border-radius:10px; padding: 22px; margin-bottom: 22px;">
      <h3 style="margin-top:0;">试听课你将收获：</h3>
      <ul style="margin-bottom:0.5em;">
        <li>真实体验AI项目式学习流程，不只是“编程”</li>
        <li>学会用AI工具解决一个小实际问题（或制作作品雏形）</li>
        <li>体验导师互动答疑与AI智能辅助教学</li>
        <li>了解未来成长路线和晋级通道，感受“非内卷式”教育氛围</li>
        <li>试听后可获个性化成长建议和学习报告</li>
      </ul>
      <div style="color:#e17b17; margin-top:8px;">试听不收取任何费用，名额有限，先到先得！</div>
    </div>

    <form @submit.prevent="handleSubmit" style="background:#fff;border-radius:10px;padding:18px 18px 8px 18px;">
      <div style="margin-bottom: 12px;">
        <label>家长姓名：</label>
        <input v-model="parentName" required style="width:80%;padding:6px;" />
      </div>
      <div style="margin-bottom: 12px;">
        <label>联系方式：</label>
        <input v-model="contact" type="tel" required style="width:80%;padding:6px;" />
      </div>
      <div style="margin-bottom: 12px;">
        <label>孩子姓名：</label>
        <input v-model="childName" style="width:80%;padding:6px;" />
      </div>
      <div style="margin-bottom: 12px;">
        <label>孩子年龄：</label>
        <input v-model="age" type="number" min="4" max="22" style="width:80%;padding:6px;" />
      </div>
      <button type="submit"
        style="background:#27a13a;color:#fff;padding:9px 38px;border:none;border-radius:6px;cursor:pointer;font-size:1.08em;">
        提交预约
      </button>
    </form>
    <div v-if="submitted" style="margin-top:1.2em; color:#3067ef;">
      🎉 预约成功！我们会尽快与您联系安排试听，欢迎关注官方公众号或加老师微信咨询。
    </div>
    <div style="margin-top:18px;font-size:0.98em;color:#888;">
      咨询电话：<b>400-xxxxxxx</b> &nbsp; | &nbsp; 微信/公众号咨询
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
