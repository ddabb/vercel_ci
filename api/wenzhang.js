const fs = require('fs');
const path = require('path');
const marked = require('marked');

export default async function handler(request, response) {
  if (request.method !== 'GET') {
    return response.status(405).end(); // Method Not Allowed
  }

  const articleName = request.query.name;

  try {
    // 使用 path.join() 和 __dirname 构建 articlePath
    const mdFilesDirectory = path.join(__dirname, '..', 'mdfiles');
    const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);

    const articleData = fs.readFileSync(articlePath, 'utf8');
    const articleContent = marked(articleData);

    response.status(200).json({ title: articleName, content: articleContent });
  } catch (error) {
    console.error('Error reading article:', error);
    response.status(404).json({ message: `Article not found${error}` });
  }
}