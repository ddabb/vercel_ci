const xml2js = require('xml2js');
export default function handler(request, response) {
  if (request.method === 'POST') {
    let body = '';
    request.on('data', (chunk) => {
      body += chunk.toString(); // 转换Buffer到string
    });
    request.on('end', () => {
      xml2js.parseString(body, { explicitArray: false }, (err, result) => {
        if (err) {
          response.status(500).send('Error parsing XML');
          return;
        }
        const { Content } = result.xml;
        axios.post('https://yuanqi.tencent.com/openapi/v1/agent/chat/completions', {
          assistant_id: 'hfr0hjaEDPYL',
          user_id: 'rodneyxiong',
          stream: false,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: Content // 将Content替换为body
                }
              ]
            }
          ]
        }, {
          headers: {
            'Authorization': 'Bearer uHut6fq9nNa0a2cFjviRyj1ED10ZXVsf'
          }
        })
          .then((res) => {
            response.status(200).send(`Chat completion: ${res.data}`);
          })
          .catch((err) => {
            response.status(500).send('Error sending chat completion request');
          });
      })
    });


  } else {
    response.status(200).send(` ${request.method} Hello World!`);
  }
}
