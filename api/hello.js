export default function (req, res) {
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      time: new Date().toISOString(),
      message: "这是来自于www.60score.com的消息"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
