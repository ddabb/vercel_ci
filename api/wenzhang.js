const fs = require('fs');
const path = require('path');
const marked = require('marked');

module.exports = async function handler(request, response) {
    if (request.method !== 'GET') {
        return response.status(405).end(); // Method Not Allowed
    }

    const articleName = request.query.name;

    try {
        const mdFilesDirectory = path.join(__dirname, '..', 'mdfiles');
        const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);

        const articleData = fs.readFileSync(articlePath, 'utf8');
        const articleContent = marked(articleData);

        response.status(200).json({ title: articleName, content: articleContent });
    } catch (error) {
        console.error('Error reading article:', error);
        // 检查错误类型并相应地处理
        if (error instanceof FileNotFoundError) {
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