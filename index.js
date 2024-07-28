const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('欢迎来到 60score.com');
});

app.listen(3000, () => {
  console.log('服务器运行在 http://localhost:3000');
});