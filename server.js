const express = require('express');
const next = require('next');
const path = require('path');

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = express();

  // 使用 express.json() 中间件来解析 JSON 请求体
  server.use(express.json());

  // 错误处理中间件 - 如果没有匹配的路由，则发送 404.html 或 500.html
  const statusHandlers = new Map([
    [404, (req, res) => res.sendFile(path.join(__dirname, "public", "html", '404.html'))],
    [500, (req, res) => res.sendFile(path.join(__dirname, "public", "html", '500.html'))],
  ]);

  server.use((req, res, next) => {
    const handler = statusHandlers.get(res.statusCode);
    if (handler) {
      handler(req, res);
    } else {
      next();
    }
  });

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  server.listen(3000, (err) => {
    if (err) throw err;
    console.log('> Ready on http://localhost:3000');
  });
});