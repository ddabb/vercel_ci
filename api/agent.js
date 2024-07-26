import https from 'https';
const xml2js = require('xml2js');
async function sendRequest(content) {
  try {
    // 定义请求的配置对象
    const options = {
      hostname: 'yuanqi.tencent.com',
      port: 443,
      path: '/openapi/v1/agent/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer uHut6fq9nNa0a2cFjviRyj1ED10ZXVsf'
      }
    };

    // 定义请求体
    const requestBody = JSON.stringify({
      assistant_id: 'hfr0hjaEDPYL',
      user_id: 'rodneyxiong',
      stream: false,
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'text',
              text: content
            }
          ]
        }
      ]
    });

    // 创建 HTTPS 请求
    const req = https.request(options, (res) => {
      let data = '';

      // 接收数据片段
      res.on('data', (chunk) => {
        data += chunk;
      });

      // 所有数据片段接收完毕
      res.on('end', () => {
        if (res.statusCode === 200) {
          return JSON.parse(data);
        } else {
          console.error('请求失败，状态码:', res.statusCode);
          throw new Error(`请求失败，状态码: ${res.statusCode}`);
        }
      });
    });

    // 请求错误处理
    req.on('error', (error) => {
      console.error('请求遇到问题:', error.message);
      throw new Error(`请求遇到问题: ${error.message}`);
    });

    // 写入请求体
    req.write(requestBody);
    req.end();
  } catch (error) {
    console.error('捕获到全局错误:', error.message);
    throw error;
  }
}

export default async function handler(request, response) {


  try {

    request.on('data', (chunk) => {
        body += chunk.toString(); // 转换Buffer到string
    });
    request.on('end', async () => {
        try {
            const parsedXML = await xml2js.parseStringPromise(body, { explicitArray: false });
            const { Content } = parsedXML.xml;
            const res = await sendRequest(Content);
            response.status(200).send(res);
        } catch (err) {
            console.error('Error parsing XML:', err);
            response.status(500).send('Error parsing XML');
        }
    });

  
  } catch (error) {
    response.status(500).send(`sendRequest发生内部服务器错误。${error.message}`);
  }
}