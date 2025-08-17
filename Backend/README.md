# ParentNavBackend 教育顾问接口系统

## 启动方式：

1. 打开终端，进入项目目录
2. 安装依赖（如需要）：
   ```
   npm init -y
   npm install express
   ```
3. 启动项目：
   ```
   node index.js
   ```

4. 用 Postman 测试接口：

POST http://localhost:5187/api/ask  
Body > raw > JSON：

```json
{
  "userId": "user123",
  "question": "孩子注意力不集中怎么办？",
  "childInfo": {
    "age": 10
  }
}
```
