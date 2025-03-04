const fs = require('fs').promises;
const path = require('path');
const dirs = ['html', 'mdhtml', 'category','tag','sghtml'];

let urls = [];

// 生成 URL 函数
function generateUrl(filePath) {
  return `https://www.60score.com/${filePath.replace(/\\/g, '/')}`;
}

(async () => {
  // 遍历目录数组
  const promises = dirs.map(async dir => {
    const files = await fs.readdir(path.join(__dirname, dir), { withFileTypes: true });
    // 过滤出 HTML 并为每个文件生成一个 URL
    const htmlFiles = files.filter(file => file.isFile() && ['.html'].includes(path.extname(file.name)));
    htmlFiles.forEach(file => {
      const filePathRelativeToRoot = path.join(dir, file.name);
      urls.push(generateUrl(filePathRelativeToRoot));
    });
  });

  // 等待所有操作完成并写入结果到 必应.txt
  await Promise.all(promises);
  if (urls.length > 0) {
    const bingFilePath = path.join(__dirname, '必应.txt');
    await fs.writeFile(bingFilePath, urls.join('\n'), 'utf-8');
    console.log(`URL列表已保存至 ${bingFilePath}`);
  } else {
    console.log('未找到任何HTML文件，因此无需生成必应.txt');
  }
})().catch(err => {
  console.error("处理文件时发生错误", err);
});