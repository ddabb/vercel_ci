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
  .map((file) => {
    const filePath = path.join(mdFilesDirectory, file.name);
    const stats = fs.statSync(filePath);
    return {
      name: file.name,
      birthtime: stats.birthtime, // 文件的创建时间
    };
  });

// 根据文件创建时间倒序排序
mdFiles.sort((a, b) => b.birthtime - a.birthtime);

// 添加 order 字段
mdFiles.forEach((file, index) => {
  file.order = index + 1;
});

// 将文件列表写入jsons/mdfiles.json
fs.writeFileSync(jsonOutputPath, JSON.stringify(mdFiles, null, 2));
console.log(`Updated ${jsonOutputPath}`);