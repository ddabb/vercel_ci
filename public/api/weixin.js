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
                response.status(200).send(`Content body: ${Content}`);
            })
        });


    } else if(request.method === 'POST'){
        response.status(200).send(` ${request.method} Hello World!`);
    }
}
