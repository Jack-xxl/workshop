// backend/routes/askAI.js  —— 只回答 Python / Scratch / AI 学习相关，按年龄分层
const express = require("express");
const router = express.Router();

const API_KEY = process.env.QIANWEN_API_KEY || process.env.QWEN_API_KEY;
const MODEL = process.env.QWEN_MODEL || "qwen-plus";

// Node≥18 自带 fetch；若报错可取消下一行注释安装 node-fetch：npm i node-fetch
// const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

function ageGuidance(age) {
  const a = Number(age);
  if (Number.isNaN(a)) return "用大众化语言，分步骤讲解，必要时给出示例和练习。";
  if (a <= 9) return "用小学生能懂的语言，讲概念比喻多一点，步骤非常细，配少量Scratch或可视化例子。";
  if (a <= 12) return "用五六年级口吻，先Scratch再逐步过渡到Python，给短小练习和项目点子。";
  if (a <= 15) return "初中生水平，Python为主，适当介绍AI/数据/模型概念，附练习与项目路线。";
  if (a <= 18) return "高中生水平，可引入Numpy/Pandas/基础ML，强调数学/逻辑，提供项目与资料。";
  return "面向成人学习者，给系统化学习路径、资料清单与实践项目（含工具与环境建议）。";
}

const SCOPE = [
  "Python 编程",
  "Scratch 编程",
  "AI/人工智能学习（概念、入门、工具、项目实践、伦理与安全）",
  "为学习AI做准备的数学/逻辑/统计与学习方法",
].join("、");

const OFF_SCOPE_REPLY = "我专注于 Python、Scratch 和 AI 学习相关的问题。请换个与这些主题相关的问题试试～";

router.post("/", async (req, res) => {
  try {
    const { question, age } = req.body || {};
    if (!question) return res.status(400).json({ error: "question required" });
    if (!API_KEY)   return res.json({ answer: `（开发提示）缺少 API Key。` });

    // 强约束：只回答指定范围；越界时礼貌拒答并引导
    const system = [
      "你是“AI 学习助手”。严格只回答与以下范围有关的问题：",
      `【范围】${SCOPE}。`,
      "遇到越界问题（娱乐、情感、时政、八卦、生活咨询等），不要作答，回复简短礼貌的拒答，并给出3个与学习AI相关的可提问示例。",
      "回答风格：清晰、分点、可操作；必要时给示例代码/项目任务；字数适中。",
      `难度与口吻：${ageGuidance(age)}`
    ].join("\n");

    const user = [
      `用户问题：${question}`,
      age ? `用户年龄：${age}` : "用户年龄：未提供",
      "请按照上述范围与风格回答；若越界仅返回拒答与引导示例。"
    ].join("\n");

    const r = await fetch("https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          { role: "system", content: system },
          { role: "user", content: user }
        ],
        temperature: 0.5
      }),
    });

    if (!r.ok) {
      const text = await r.text();
      console.error("[QWEN ERROR]", r.status, text);
      return res.status(502).json({ error: `qwen ${r.status}`, detail: text });
    }

    const data = await r.json();
    const answer =
      data?.choices?.[0]?.message?.content ??
      data?.choices?.[0]?.text ??
      OFF_SCOPE_REPLY;

    return res.json({ answer });
  } catch (e) {
    console.error("[ASK] error:", e);
    res.status(500).json({ error: "server error" });
  }
});

module.exports = router;