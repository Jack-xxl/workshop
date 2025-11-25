// backend/routes/askAI.js —— 正式版：AI学习 & 项目创作助手（解除限制）
const express = require("express");
const router = express.Router();

const API_KEY = process.env.QIANWEN_API_KEY || process.env.QWEN_API_KEY;
const MODEL = process.env.QWEN_MODEL || "qwen-plus";

function ageGuidance(age) {
  const a = Number(age);
  if (Number.isNaN(a))
    return "用大众化语言，分步骤讲解，必要时举例说明。";
  if (a <= 9)
    return "用儿童能理解的语言，举例多、比喻清楚、语气亲切。";
  if (a <= 12)
    return "用小学高年级口吻，逻辑清晰、循序渐进，加入互动小练习。";
  if (a <= 15)
    return "用初中生水平解释原理，可给简单例题或项目任务。";
  if (a <= 18)
    return "用高中生水平解释知识点，可结合AI、编程或社会现实。";
  return "面向成人学习者，提供系统化学习路径与实践方法。";
}

router.post("/", async (req, res) => {
  try {
    const { question, age, mode } = req.body || {};
    if (!question) return res.status(400).json({ error: "question required" });
    if (!API_KEY)
      return res.json({ answer: "（提示）后端缺少 QIANWEN_API_KEY，请在 .env 中配置。" });

    const isProject = mode === "project";
    const roleIntro = isProject
      ? "你是“AI 创变营·项目创作助手”，帮助学生构思和完善自己的AI小项目。"
      : "你是“AI 创变营·学习助手”，帮助学生在各个学科上提高理解和实践能力，也能提供AI项目创意。";

    const systemPrompt = [
      roleIntro,
      "",
      "【你能帮助的范围包括】",
      "1️⃣ 学科学习：语文、数学、英语、物理、化学、生物、编程、AI基础、逻辑思维。",
      "2️⃣ 学习效率：学习规划、时间管理、记忆方法、错题整理、思维导图。",
      "3️⃣ AI项目创作：帮学生构思AI学习伴侣、AI记忆系统、AI任务规划师等。",
      "4️⃣ 给出项目目标、功能列表、实现思路、提示词模板、UI创意或交互方案。",
      "",
      "【请注意安全范围】",
      "不能提供：医疗诊断、心理治疗、违法、色情、暴力、政治等内容。",
      "如遇到此类请求，请礼貌拒绝并引导回学习或创意话题。",
      "",
      "【输出要求】",
      `- 难度与口吻：${ageGuidance(age)}`,
      "- 条理清晰，用分点或标题组织。",
      "- 尽量提供具体步骤、模板或示例。",
      "- 若问题涉及项目，请输出：项目目标、用户群、核心功能、AI提示词与实现步骤。",
    ].join("\n");

    const userPrompt = `学生提问：${question}`;

    const r = await fetch(
      "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: MODEL,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt },
          ],
          temperature: 0.7,
        }),
      }
    );

    if (!r.ok) {
      const text = await r.text();
      console.error("[QWEN ERROR]", r.status, text);
      return res.status(502).json({ error: `qwen ${r.status}`, detail: text });
    }

    const data = await r.json();
    const answer =
      data?.choices?.[0]?.message?.content ||
      "AI 暂时没有返回内容，请稍后再试。";

    res.json({ answer });
  } catch (e) {
    console.error("[ASK ERROR]", e);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;