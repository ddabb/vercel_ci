import http from 'http';

export default async function handler(request, response) {
    try {
        const weatherData = await new Promise((resolve, reject) => {
            https.get('https://t.weather.itboy.net/api/weather/city/101010100', (res) => {
                let data = '';

                // A chunk of data has been received.
                res.on('data', (chunk) => {
                    data += chunk;
                });

                // The whole response has been received. Print out the result.
                res.on('end', () => {
                    resolve(data);
                });
            }).on("error", (err) => {
                console.error('请求错误:', err);
                reject(new Error(`请求错误 ${err}`));
            });
        });

        response.status(200).send(weatherData);
    } catch (error) {
        console.error('捕获到全局错误:', error.message);
        response.status(500).send(`发生内部服务器错误。${error.message}`);
    }
}