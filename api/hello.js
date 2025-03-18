export default function (req, res) {
  // 处理预检请求
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
      time: new Date().toISOString(),
      message: "Hello from Vercel API"
    });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
