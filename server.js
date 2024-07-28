const express = require('express');
const app = express();

// 使用 express.json() 中间件来解析 JSON 请求体
app.use(express.json());

// 导入你的 oddEven 处理函数
const oddEvenHandler = require('./app/oddEven');

// 设置路由
app.post('/api/oddEven', oddEvenHandler);

// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});