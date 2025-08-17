const axios = require('axios');
const QIANWEN_API_KEY = process.env.QIANWEN_API_KEY;

if (!QIANWEN_API_KEY) {
  throw new Error('请在环境变量 QIANWEN_API_KEY 中配置千问API密钥');
}

async function callQianwen(question, childInfo) {
  // 按Qwen官方格式组 prompt
  const prompt = `用户提问: ${question}\n孩子信息: ${JSON.stringify(childInfo)}`;
  try {
    const response = await axios.post(
      'https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions',
      {
        model: 'qwen-plus',
        messages: [
          { role: 'system', content: '你是一个专业的家庭教育和心理辅导老师，请根据孩子的具体情况和问题给出详细建议。' },
          { role: 'user', content: prompt }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${QIANWEN_API_KEY}`
        }
      }
    );

    if (!response.data.choices || !response.data.choices[0].message.content) {
      throw new Error('千问API未返回内容！');
    }
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Qianwen API error:', error?.response?.data || error.message);
    throw new Error('Qwen调用失败: ' + (error?.response?.data?.message || error.message));
  }
}

module.exports = callQianwen;