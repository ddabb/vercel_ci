export default async function handler(request, response) {
  try {

    response.status(200).send('欢迎来到 60score.com');
  } catch (error) {
    console.error('捕获到全局错误:', error.message);
    response.status(500).send(`发生内部服务器错误。${error.message}`);
  }
}