const fs = require('fs');
const path = require('path');
const marked = require('marked');

module.exports = async function handler(request, response) {
  debugger
  if (request.method !== 'POST') {
    return response.status(405).end();
  }

  let body = '';

  request.on('data', chunk => {
    body += chunk.toString();
  });

  request.on('end', () => {
    try {
      const parsedBody = JSON.parse(body);
      console.log('Parsed body:', parsedBody);
      const articleName = parsedBody.name;
      console.log('Article name:', articleName);
      const mdFilesDirectory = path.join(__dirname, '..', 'dfiles');
      console.log('MD files directory:', mdFilesDirectory);
      const articlePath = path.join(mdFilesDirectory, `${articleName}.md`);
      console.log('Article path:', articlePath);
      const articleData = fs.readFileSync(articlePath, 'utf8');
      console.log('Article data:', articleData);
      const articleContent = marked(articleData);
      console.log('Article content:', articleContent);
      response.status(200).json({ title: articleName, content: articleContent });
    } catch (error) {
      console.error(error);
      response.writeHead(500, { 'Content-Type': 'text/plain' });
      response.end(`Internal Server Error: ${error.message}`);
    }
  });
};