const fs = require('fs');
const path = require('path');
const marked = require('marked');

module.exports = async function handler(request, response) {
    debugger
    if (request.method!== 'POST') {
        return response.status(405).end(); 
    }

    let body = '';

    request.on('data', chunk => {
        body += chunk.toString();
    });

    request.on('end', () => {
        try {
            const parsedBody = JSON.parse(body);
            const articleName = parsedBody.name;

            const mdFilesDirectory = path.join(__dirname, '..', 'dfiles');
            const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);

            const articleData = fs.readFileSync(articlePath, 'utf8');
            const articleContent = marked(articleData);

            response.status(200).json({ title: articleName, content: articleContent });
        } catch (error) {
            console.error('Error reading article:', error);
            let statusCode = 500;
            let message = 'Internal Server Error';
            if (error.code === 'ENOENT') {
                statusCode = 404;
                message = `Article not found: ${articleName}`;
            }

            response.status(statusCode).json({
                message,
                errorDetails: {
                    mdFilesDirectory,
                    articlePath,
                    error: error.message
                }
            });
        }
    });
};