import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
    const mdFilesDirectory = path.resolve(__dirname, '..', 'mdfiles');
  try {
    // 假设你的 Node.js 应用程序是从项目的根目录启动的

    
    // 检查目录是否存在
    if (!fs.existsSync(mdFilesDirectory)) {
      throw new Error(`Directory '${mdFilesDirectory}' does not exist.`);
    }
    
    const mdFiles = fs.readdirSync(mdFilesDirectory, { withFileTypes: true })
      .filter((file) => file.isFile() && path.extname(file.name) === '.md')
      .map((file, index) => ({ name: file.name, order: index + 1 }));

    response.status(200).json(mdFiles);
  } catch (error) {
    response.status(500).json({ 具体错误: error.message+mdFilesDirectory });
  }
}