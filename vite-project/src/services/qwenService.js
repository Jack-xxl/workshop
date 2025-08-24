// // 统一走 /api 代理
// import axios from "axios";

// export async function askAi(question, age) {
//   const { data } = await axios.post("/api/ask", { question, age });
//   return data; // { answer: "..." }
// }

// vite-project/src/services/qwenService.js (or wherever this lives)
import axios from "axios";

// Vercel injects this at build time. In dev you can leave it empty and use your vite proxy.
const BASE = import.meta.env.VITE_API_BASE || "";

// Create a client that points to Render in production, and stays relative in dev.
const http = axios.create({
  baseURL: BASE ? BASE.replace(/\/+$/, "") : "", // e.g. https://workshop-bwwp.onrender.com
  headers: { "Content-Type": "application/json" },
});

export async function askAi(question, age) {
  const { data } = await http.post("/api/ask", { question, age });
  return data; // { answer: "..." }
}
