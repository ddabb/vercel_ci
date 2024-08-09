const express = require('express');
const app = express();

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

const statusHandlers = new Map([
  [404, () => res.sendFile(path.join(__dirname, "html", '404.html'))],
  [500, () => res.sendFile(path.join(__dirname, "html", '500.html'))],

]);
// 错误处理中间件 - 如果没有匹配的路由，则发送 404.html
app.use((req, res, next) => {
  const handler = statusHandlers.get(res.statusCode);
  if (handler) {
    handler();
  } else {
    next();
  }
});


// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});