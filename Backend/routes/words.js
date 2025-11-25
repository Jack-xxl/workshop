// backend/routes/words.js
// 单词机相关 AI 能力：错词故事、词族扩展、小测验、鼓励语、AI 词典

const express = require("express");
const router = express.Router();

// 千问配置（和 qwenService 保持一致）
const API_KEY =
  process.env.QIANWEN_API_KEY || process.env.QWEN_API_KEY || "";

const BASE_URL =
  process.env.QWEN_BASE_URL ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

const MODEL = process.env.QWEN_TEXT_MODEL || "qwen-plus";

if (!API_KEY) {
  console.warn(
    "[words router] 警告：缺少 QIANWEN_API_KEY / QWEN_API_KEY，相关接口会返回报错。"
  );
}

// ✅ 通用调用千问函数 —— 用 Node18+ 内置的 fetch
async function callQwen(systemPrompt, userText) {
  if (!API_KEY) {
    return {
      ok: false,
      text: "（开发提示）缺少 QIANWEN_API_KEY / QWEN_API_KEY。",
    };
  }

  const body = {
    model: MODEL,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      {
        role: "user",
        content: userText,
      },
    ],
  };

  const resp = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json().catch(() => ({}));

  if (!resp.ok) {
    console.error("[words router] Qwen error:", data);
    return {
      ok: false,
      text:
        data?.error?.message ||
        data?.message ||
        "调用千问接口失败，请稍后再试。",
    };
  }

  const answer = data.choices?.[0]?.message?.content || "";
  return { ok: true, text: answer || "（千问没有返回内容）" };
}

/**
 * 1）错词故事工厂
 * POST /api/words/story
 * body: { words: string[], style, protagonist, length / lengthLevel, studentName }
 */
router.post("/story", async (req, res) => {
  try {
    const body = req.body || {};
    const {
      words = [],
      style = "funny",
      protagonist = "学生",
      studentName = "同学",
    } = body;

    // 兼容 length / lengthLevel 两个字段
    const length = body.length || body.lengthLevel || "short";

    const cleanWords = (Array.isArray(words) ? words : [])
      .map((w) => String(w || "").trim())
      .filter(Boolean);

    if (!cleanWords.length) {
      return res.status(400).json({ ok: false, error: "words 不能为空" });
    }

    let styleZh = "幽默搞笑";
    if (style === "mystery") styleZh = "悬疑紧张";
    if (style === "scifi") styleZh = "科幻未来";

    let lengthDesc = "80-120 字左右";
    if (length === "medium") lengthDesc = "150-250 字左右";
    if (length === "long") lengthDesc = "300-400 字左右";

    const systemPrompt = `
你是一名擅长讲故事、同时懂得单词记忆方法的英语老师。
你会把学生记不住的单词编进一个英文小故事里，帮助他记忆。
故事表达要简单，适合中学生水平。`;

    const userPrompt = `
请用下面这些英文单词，写一个 ${styleZh} 风格的小故事，长度控制在 ${lengthDesc}：
目标主角：${studentName}（${protagonist}）
必须尽量全部用到的单词：
${cleanWords.join(", ")}
要求：
1. 故事主要用英文写，单词拼写正确。
2. 适当可以在括号里加简短中文提示，帮助记忆。
3. 每个目标单词至少出现 1 次。
4. 故事要有简单的开头、发展和结尾。
5. 最后用 2~3 句中文，解释这些单词在故事里的意思，给一个记忆小窍门。`;

    const result = await callQwen(systemPrompt, userPrompt);
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.text });
    }

    res.json({ ok: true, text: result.text });
  } catch (err) {
    console.error("[words router] /story error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

/**
 * 2）举一反三：词族 / 近义词 / 反义词
 * POST /api/words/family
 * body: { word, examples }
 */
router.post("/family", async (req, res) => {
  try {
    const { word, examples = [] } = req.body || {};
    if (!word) {
      return res.status(400).json({ ok: false, error: "word 必填" });
    }

    const systemPrompt = `
你是一名擅长给中国学生讲解单词的英语老师。
回答时请使用简体中文解释，适量使用英文单词本身。
尽量条理清晰，分点输出。`;

    const userPrompt = `
目标单词：${word}
如果有例句，请参考（可以没有）：
${(examples || []).join("\n")}
请帮学生做一个「举一反三」的单词家族梳理，包含：
1. 词根 / 词缀（如果能确定的话），以及由此延伸出来的常见同源词（每个简单解释一下）
2. 常见近义词（每个给出中文含义，简单区分用法差异）
3. 常见反义词（每个给出中文含义）
4. 小贴士：用一两句话教学生怎么快速区分这些近义词 / 反义词
要求：
- 输出用中文为主，英文单词保持原文
- 用列表分段，方便阅读
`;

    const result = await callQwen(systemPrompt, userPrompt);
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.text });
    }

    res.json({ ok: true, text: result.text });
  } catch (err) {
    console.error("[words router] /family error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

/**
 * 3）错词小测验
 * POST /api/words/quiz
 * body: { words: string[] }
 */
router.post("/quiz", async (req, res) => {
  try {
    const { words = [] } = req.body || {};
    const cleanWords = (Array.isArray(words) ? words : [])
      .map((w) => String(w || "").trim())
      .filter(Boolean);

    if (!cleanWords.length) {
      return res.status(400).json({ ok: false, error: "words 不能为空" });
    }

    const systemPrompt = `
你是一名英语老师，正在给学生做小测验。
学生是中国中学生，用中文解释题干，用英文作答。`;

    const userPrompt = `
请用下面这些单词设计一份小测验，一共 3~5 题：
目标单词：
${cleanWords.join(", ")}
题型可以包含：
- 中译英（给中文短句，让学生写出英语单词）
- 选词填空（给句子 + 3~4 个备选单词）
- 简单单选题（考察近义词或反义词）
要求：
1. 题干用中文，空格处用「____」表示
2. 每道题后面不要直接给出答案，把正确答案集中放在最后「参考答案」部分
3. 输出格式便于直接复制到聊天或文档里
`;

    const result = await callQwen(systemPrompt, userPrompt);
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.text });
    }

    res.json({ ok: true, text: result.text });
  } catch (err) {
    console.error("[words router] /quiz error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

/**
 * 4）学习小结 + 鼓励语
 * POST /api/words/summary
 * body: { learnedCount, hardCount, streak, wordsToday, studentName }
 */
router.post("/summary", async (req, res) => {
  try {
    const {
      learnedCount = 0,
      hardCount = 0,
      streak = 1,
      wordsToday = [],
      studentName = "",
    } = req.body || {};

    const systemPrompt = `
你是一名温柔又专业的英语老师。
现在要给学生写一段今天的学习反馈与鼓励，用简体中文，适当穿插几个英文单词。`;

    const userPrompt = `
请根据下面的信息，给学生写一段 120~200 字的学习小结和鼓励，语气积极、真诚：
学生名字（可空）：${studentName || "这位同学"}
今天学习的单词数量（掌握）：${learnedCount}
目前错词 / 薄弱单词数量：${hardCount}
连续学习天数（估计）：${streak}
今天涉及到的一些单词（可选）：${(wordsToday || []).join(", ")}
请包含：
1. 对他今天表现的肯定（不要敷衍，要具体）
2. 一两个小建议，比如：如何复习错词、如何用故事 / 例句记单词
3. 一句暖心的鼓励结语
`;

    const result = await callQwen(systemPrompt, userPrompt);
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.text });
    }

    res.json({ ok: true, text: result.text });
  } catch (err) {
    console.error("[words router] /summary error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

/**
 * 5）AI 词典：批量查单词音标 / 释义 / 例句
 * POST /api/words/lookup
 * body: { words: string[] }
 * 返回：{ ok: true, items: [{ word, phonetic, meaning, examples: [..] }] }
 */
router.post("/lookup", async (req, res) => {
  try {
    const { words = [] } = req.body || {};

    const cleanWords = (Array.isArray(words) ? words : [])
      .map((w) => String(w || "").trim().toLowerCase())
      .filter(Boolean);

    if (!cleanWords.length) {
      return res.status(400).json({ ok: false, error: "words 不能为空" });
    }

    const systemPrompt = `
你是一部面向中国学生的英汉学习词典 API。
你只返回严格的 JSON，不要解释，不要多余文字。`;

    const userPrompt = `
请对下面这些英文单词给出简要词典信息，用「JSON 数组」返回，不要有任何注释或自然语言。
输入单词数组：
${JSON.stringify(cleanWords)}
要求返回的 JSON 结构为（这是示例，请按实际单词填写）：
[
  {
    "word": "apple",
    "phonetic": "ˈæpl",
    "meaning": "苹果；苹果树",
    "example": "She ate an apple."
  }
]
具体要求：
1. 数组长度与输入单词数相同，按相同顺序。
2. phonetic：国际音标，字符串。如果不确定可以用空字符串 ""。
3. meaning：用简体中文，概括常见释义，可以用分号隔开。
4. example：每个单词给一个简单英文例句，适合中学生。
⚠️ 只输出 JSON，本身必须是合法 JSON，不能带任何多余说明。`;

    const result = await callQwen(systemPrompt, userPrompt);
    if (!result.ok) {
      return res.status(500).json({ ok: false, error: result.text });
    }

    let parsed;

    try {
      // 先直接尝试整体 parse
      parsed = JSON.parse(result.text);
    } catch (e) {
      // 有时候模型前后会多输出点说明，尝试截取第一个 "[" 到最后一个 "]"
      const text = result.text || "";
      const start = text.indexOf("[");
      const end = text.lastIndexOf("]");
      if (start !== -1 && end !== -1 && end > start) {
        try {
          parsed = JSON.parse(text.slice(start, end + 1));
        } catch (e2) {
          console.error(
            "[words router] /lookup JSON parse failed 2nd time",
            e2
          );
        }
      }
    }

    if (!Array.isArray(parsed)) {
      // 解析失败就兜底：只返回最基础信息，避免前端直接炸掉
      const fallback = cleanWords.map((w) => ({
        word: w,
        phonetic: "",
        meaning: "（AI 词典解析失败，暂时只保存单词本身）",
        examples: [],
      }));
      return res.json({ ok: true, items: fallback, warn: "parse_failed" });
    }

    const items = parsed.map((item, idx) => ({
      word: item.word || cleanWords[idx] || "",
      phonetic: item.phonetic || "",
      meaning: item.meaning || "",
      examples: item.example ? [String(item.example)] : [],
    }));

    res.json({ ok: true, items });
  } catch (err) {
    console.error("[words router] /lookup error", err);
    res.status(500).json({ ok: false, error: "服务器内部错误" });
  }
});

module.exports = router;
