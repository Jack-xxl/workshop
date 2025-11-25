// backend/services/qwenService.js
// 统一封装：跟通义千问对话（文字 + 可选图片）

const fs = require("fs");
const path = require("path");

const QWEN_API_KEY =
  process.env.QIANWEN_API_KEY || process.env.QWEN_API_KEY || "";

const QWEN_BASE_URL =
  process.env.QWEN_BASE_URL ||
  "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";

// 文字模型 / 多模态模型
const QWEN_TEXT_MODEL = process.env.QWEN_TEXT_MODEL || "qwen-plus";
const QWEN_VL_MODEL = process.env.QWEN_VL_MODEL || "qwen-vl-max";

/**
 * 把本地图片路径或 localhost 地址，转换成 data URL（base64）
 * 兼容三种情况：
 *   1）"http://localhost:3100/uploads/xxx.jpg"
 *   2）"/uploads/xxx.jpg"
 *   3）"uploads/xxx.jpg"
 * 如果是公网 URL，则直接返回原 URL（给通义远程拉取）
 */
function toDataUrlIfLocal(imageUrl) {
  try {
    if (!imageUrl) return null;

    let filePath = null;
    let mime = "image/jpeg";

    // 公网 URL，直接返回，不转 base64
    if (/^https?:\/\//i.test(imageUrl) && !/localhost|127\.0\.0\.1/.test(imageUrl)) {
      return imageUrl;
    }

    // 如果是 localhost 的 URL，提取 pathname 部分
    if (/^https?:\/\/(localhost|127\.0\.0\.1)/i.test(imageUrl)) {
      const u = new URL(imageUrl);
      const rel = u.pathname.replace(/^\/+/, ""); // 去掉开头的 /
      filePath = path.join(__dirname, "..", rel); // ../uploads/xxx.jpg
    } else {
      // 非 http 开头，当作相对路径
      const rel = imageUrl.replace(/^\/+/, "");
      filePath = path.join(__dirname, "..", rel);
    }

    if (!fs.existsSync(filePath)) {
      console.warn("[qwenService] local image not found:", filePath);
      return null;
    }

    const ext = (filePath.split(".").pop() || "jpg").toLowerCase();
    if (ext === "png") mime = "image/png";
    else if (ext === "webp") mime = "image/webp";
    else mime = "image/jpeg";

    const buf = fs.readFileSync(filePath);
    const b64 = buf.toString("base64");
    return `data:${mime};base64,${b64}`;
  } catch (err) {
    console.error("[qwenService] convert local image failed:", err);
    return null;
  }
}

/**
 * 调用通义千问
 * @param {Object} options
 * @param {string} options.text      学生输入的文字
 * @param {string} options.mode      speaking / listening / reading / writing / mistakes
 * @param {string|null} options.imageUrl  题目图片地址（可为空）
 * @returns {Promise<string>}        模型返回的文字答案
 */
async function chatWithAgent({ text, mode, imageUrl }) {
  if (!QWEN_API_KEY) {
    throw new Error("缺少 QIANWEN_API_KEY / QWEN_API_KEY，请先在 .env 里配置。");
  }

  const systemPrompt = `
你是一位面向 9-16 岁学生的耐心英语老师，名字叫 Lily。
请用温暖、简洁、鼓励式的方式给出反馈，尽量用学生能理解的语言。

- 如果模式是 "speaking"，重点纠正口语句子、语法和表达自然度。
- "listening" 可以根据学生回答判断是否听懂，并给出简单解释。
- "reading" 以讲解生词、句子结构和段落大意为主。
- "writing" 重点修改语法、拼写、用词和句子衔接，并给出一份「改写后范文」或「更好的表达」。
- 如果有题目图片（作文照片或试卷），请先根据图片内容理解题目，再结合学生输入给出批改建议。
- 回复结构尽量清晰，可以用【问题概括】【修改建议】【更好的表达】【鼓励】这样的分段形式。
`;

  // 这里把本地地址转成 data URL；如果是公网 URL 则直接用原 URL
  const imageDataUrl = imageUrl ? toDataUrlIfLocal(imageUrl) : null;
  const hasImage = !!imageDataUrl;

  // === 组装 user 的 content（文字 + 可选图片） ===
  const userContent = [];

  // 文字内容（必选）
  userContent.push({
    type: "text",
    text: `当前学习模式：${mode || "unknown"}。\n学生的输入：${text}`,
  });

  // 如果有图片，就追加一个 image_url（注意：type 必须是 "image_url"）
  if (hasImage) {
    userContent.push({
      type: "image_url",
      image_url: {
        url: imageDataUrl,
      },
    });
  }

  const body = {
    model: hasImage ? QWEN_VL_MODEL : QWEN_TEXT_MODEL,
    messages: [
      {
        role: "system",
        content: [{ type: "text", text: systemPrompt }],
      },
      {
        role: "user",
        content: userContent,
      },
    ],
  };

  const resp = await fetch(QWEN_BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${QWEN_API_KEY}`,
    },
    body: JSON.stringify(body),
  });

  const data = await resp.json();

  if (!resp.ok) {
    console.error("[Qwen-VL Error]", data);
    const msg =
      data.error?.message ||
      data.message ||
      "调用通义千问接口失败，请稍后重试。";
    throw new Error(msg);
  }

  // 兼容两种返回格式：string 或 [{type,text}...]
  let content = data.choices?.[0]?.message?.content ?? "";

  if (Array.isArray(content)) {
    content = content
      .filter((c) => c.type === "text" && typeof c.text === "string")
      .map((c) => c.text)
      .join("\n\n");
  }

  if (typeof content !== "string") {
    content = String(content ?? "");
  }

  return content;
}

module.exports = {
  chatWithAgent,
};