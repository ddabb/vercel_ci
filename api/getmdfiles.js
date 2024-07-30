import fs from 'fs';
import path from 'path';
export default async function handler(request, response) {
    const mdFiles = fs.readdirSync('./mdfiles', { withFileTypes: true })
     .filter((file) => file.isFile() && path.extname(file.name) === '.md')
     .map((file, index) => ({ name: file.name, order: index + 1 }));
    
    response.status(200).json(mdFiles);
}