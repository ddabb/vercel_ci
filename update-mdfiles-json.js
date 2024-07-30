const fs = require('fs');
const path = require('path');

const mdFilesDirectory = path.resolve(__dirname, 'mdfiles');
const jsonOutputPath = path.resolve(__dirname, 'jsons', 'mdfiles.json');

// 检查目录是否存在
if (!fs.existsSync(mdFilesDirectory)) {
  throw new Error(`Directory '${mdFilesDirectory}' does not exist.`);
}

// 读取mdfiles目录下的.md文件
const mdFiles = fs.readdirSync(mdFilesDirectory, { withFileTypes: true })
  .filter((file) => file.isFile() && path.extname(file.name) === '.md')
  .map((file, index) => ({ name: file.name, order: index + 1 }));

// 将文件列表写入jsons/mdfiles.json
fs.writeFileSync(jsonOutputPath, JSON.stringify(mdFiles, null, 2));
console.log(`Updated ${jsonOutputPath}`);