const fs = require('fs');
const path = require('path');
const marked = require('marked');

module.exports = async function handler(request, response) {
    debugger
    if (request.method!== 'POST') {
        return response.status(405).end(); // Method Not Allowed
    }

    const articleName = request.body.name; // 从请求体中获取 name 参数

    try {
        const mdFilesDirectory = path.join(__dirname, '..', 'dfiles');
        const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);

        const articleData = fs.readFileSync(articlePath, 'utf8');
        const articleContent = marked(articleData);

        response.status(200).json({ title: articleName, content: articleContent });
    } catch (error) {
        console.error('Error reading article:', error);
        // 检查错误类型并相应地处理
        if (error.code === 'ENOENT') {  // 使用 'ENOENT' 错误码来检测文件未找到错误
            response.status(404).json({
                message: `Article not found: ${articleName}`,
                errorDetails: {
                    mdFilesDirectory,
                    articlePath
                }
            });
        } else {
            response.status(500).json({
                message: 'Internal Server Error',
                errorDetails: {
                    mdFilesDirectory,
                    articlePath,
                    error: error.message
                }
            });
        }
    }
};