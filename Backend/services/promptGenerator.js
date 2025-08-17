function generatePrompt(question, childInfo) {
  return `请基于孩子的年龄(${childInfo.age})，专业地回答以下教育问题：${question}`;
}

module.exports = generatePrompt;
