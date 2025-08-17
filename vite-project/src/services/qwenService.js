// 统一走 /api 代理
import axios from "axios";

export async function askAi(question, age) {
  const { data } = await axios.post("/api/ask", { question, age });
  return data; // { answer: "..." }
}