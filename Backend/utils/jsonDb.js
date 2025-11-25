// backend/utils/jsonDb.js
const fs = require("fs");
const path = require("path");

function getFilePath(fileName) {
  const dataDir = path.join(__dirname, "..", "data");
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir);
  }
  return path.join(dataDir, fileName);
}

function readJson(fileName) {
  const fullPath = getFilePath(fileName);
  if (!fs.existsSync(fullPath)) return [];
  const raw = fs.readFileSync(fullPath, "utf-8");
  if (!raw.trim()) return [];
  try {
    return JSON.parse(raw);
  } catch (e) {
    console.error("readJson parse error:", e);
    return [];
  }
}

function writeJson(fileName, data) {
  const fullPath = getFilePath(fileName);
  fs.writeFileSync(fullPath, JSON.stringify(data, null, 2), "utf-8");
}

module.exports = {
  readJson,
  writeJson,
};
