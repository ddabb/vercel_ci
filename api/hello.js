const xml2js = require('xml2js');
const fetch = require('node-fetch');

export default async function handler(request, response) {
  try {
    if (request.method === 'POST') {
      let body = '';
      request.on('data', (chunk) => {
        body += chunk.toString(); // 转换Buffer到string
      });
      request.on('end', async () => {
        try {
          const parsedXML = await xml2js.parseStringPromise(body, { explicitArray: false });
          const { Content } = parsedXML.xml;
          try {
            const res = await fetch('https://yuanqi.tencent.com/openapi/v1/agent/chat/completions', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer uHut6fq9nNa0a2cFjviRyj1ED10ZXVsf',
              },
              body: JSON.stringify({
                assistant_id: 'hfr0hjaEDPYL',
                user_id: 'rodneyxiong',
                stream: false,
                messages: [
                  {
                    role: 'user',
                    content: [
                      {
                        type: 'text',
                        text: Content, // 将Content替换为body
                      },
                    ],
                  },
                ],
              }),
            });

            if (!res.ok) {
              throw new Error(`HTTP error! status: ${res.status}`);
            }

            const jsonResponse = await res.json();
            response.status(200).send(`Chat completion: ${jsonResponse}`);
          } catch (err) {
            console.error('Error sending chat completion request:', err);
            response.status(500).send('Error sending chat completion request');
          }
        } catch (err) {
          console.error('Error parsing XML:', err);
          response.status(500).send('Error parsing XML');
        }
      });
    } else {
      response.status(200).send(` ${request.method} Hello World!`);
    }
  } catch (globalErr) {
    console.error('Global error caught:', globalErr);
    response.status(500).send('An internal server error occurred');
  }
}