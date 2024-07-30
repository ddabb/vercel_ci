import fs from 'fs';
import path from 'path';
export default async function handler(request, response) {
    try {
        const mdFiles = fs.readdirSync('./mdfiles', { withFileTypes: true })
       .filter((file) => file.isFile() && path.extname(file.name) === '.md')
       .map((file, index) => ({ name: file.name, order: index + 1 }));
    
        response.status(200).json(mdFiles);
    } catch (error) {
        response.status(500).json({ 具体错误: error});
    }
}