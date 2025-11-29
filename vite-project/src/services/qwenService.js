// 统一走 /api 代理
import api from "./api";

export async function askAi(question, age) {
  const { data } = await api.post("/ask", { question, age });
  return data; // { answer: "..." }
}