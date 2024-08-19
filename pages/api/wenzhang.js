import fs from 'fs';
import path from 'path';
import showdown from 'showdown';
// 引入 showdown 模块
const converter = new showdown.Converter(); // 创建 showdown 转换器实例

module.exports = async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).end();
  }

  let body = '';
  request.on('data', chunk => body += chunk.toString());
  request.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      const articleName = parsedBody.name;
      const mdFilesDirectory = path.join(process.cwd(), 'mdfiles');
      const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);

      if (!fs.existsSync(articlePath)) {
        throw new Error(`File not found: ${articlePath}`);
      }

      const articleData = fs.readFileSync(articlePath, 'utf8');
      const articleContent = converter.makeHtml(articleData); // 使用 showdown 转换 markdown
      response.status(200).json({ title: articleName, content: articleContent });
    } catch (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(`Internal Server Error: ${error.message}`);
    }
  });
};