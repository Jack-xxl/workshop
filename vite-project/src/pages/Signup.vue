<template>
  <div style="max-width: 460px; margin: 0 auto; padding: 32px 10px;">
    <h2 style="font-size:1.5em; margin-bottom:0.5em;">
      立即报名 · 抢占AI时代的起跑线
    </h2>
    <p style="margin-bottom:1em; color:#335;">
      填写信息，即可预约免费试听课或申请成为首批AI创新营学员！名额有限，报名即享专属成长规划建议、课程大礼包和平台优先推荐资格。
    </p>
    <form @submit.prevent="handleSubmit" style="background:#f5f6fa; border-radius:10px; padding:22px;">
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
      <div style="margin-bottom: 12px;">
        <label>课程意向：</label>
        <select v-model="intention" style="width:82%;padding:6px;">
          <option value="AI兴趣启蒙（6-9岁）">AI兴趣启蒙（6-9岁）</option>
          <option value="AI项目实战（10岁及以上）">AI项目实战（10岁及以上）</option>
          <option value="AI少年实验室（高阶晋级）">AI少年实验室（高阶晋级）</option>
        </select>
      </div>
      <div style="margin-bottom: 12px;">
        <label>留言（可选）：</label>
        <textarea v-model="msg" style="width:80%;padding:6px;"></textarea>
      </div>
      <button type="submit"
        style="background:#3067ef;color:#fff;padding:10px 40px;border:none;border-radius:6px;cursor:pointer;font-size:1.1em;">
        提交报名
      </button>
    </form>
    <div v-if="submitted" style="margin-top:1.5em; color:#27a13a;">
      🎉 报名成功！我们将在24小时内联系您，欢迎关注官方公众号或加老师微信，获取更多课程与福利信息。
    </div>
    <div style="margin-top:22px;font-size:0.98em;color:#888;">
      如有疑问，可联系客服：<b>400-xxxxxxx</b> 或加微信咨询老师。
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
