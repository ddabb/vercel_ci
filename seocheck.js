const fs = require('fs').promises;
const path = require('path');
const dirs = ['html', 'mdhtml', 'category','tag','sghtml'];

let checkResults = {};

// 检查HTML内容函数
async function checkHtmlContent(filePath, content) {
  const errors = [];
  if (!/<h1/.test(content)) errors.push("缺少 <h1> 标签");
  if (!/<meta\s+name="keywords"/i.test(content)) errors.push("缺少 <meta name=\"keywords\"> 标签");
  if (!/<meta\s+name="description"/i.test(content)) errors.push("缺少 <meta name=\"description\"> 标签");

  if (errors.length > 0) {
    checkResults[filePath] = { msg: errors.join('; ') };
  }
}

// 删除旧的 check.json 文件
async function deleteOldCheckFile() {
  const checkJsonPath = path.join(__dirname, 'jsons', 'checkSeo.json');
  try {
    await fs.unlink(checkJsonPath);
    console.log('旧的 checkSeo.json 文件已被删除');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // 如果文件不存在，则无需处理
      console.log('未找到旧的 checkSeo.json 文件，跳过删除');
    } else {
      throw err;
    }
  }
}

// 确保 jsons 目录存在
async function ensureDirectoryExist(dirPath) {
  try {
    await fs.access(dirPath);
    console.log(`${dirPath} 目录已存在`);
  } catch {
    await fs.mkdir(dirPath, { recursive: true });
    console.log(`${dirPath} 目录已创建`);
  }
}

(async () => {
  const jsonDir = path.join(__dirname, 'jsons');
  await ensureDirectoryExist(jsonDir);
  await deleteOldCheckFile();

  // 遍历目录数组
  const promises = dirs.map(async dir => {
    const files = await fs.readdir(path.join(__dirname, dir), { withFileTypes: true });
    // 过滤出 HTML 并为每个文件创建一个 Promise
    const htmlFiles = files.filter(file => file.isFile() && ['.html'].includes(path.extname(file.name)));
    return Promise.all(htmlFiles.map(async file => {
      const filePath = path.join(dir, file.name);
      const fileContent = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
      await checkHtmlContent(filePath.replace(/\\/g, '/'), fileContent);
    }));
  });

  // 等待所有操作完成并写入结果到 check.json
  await Promise.all(promises);
  if (Object.keys(checkResults).length > 0) {
    const checkJsonPath = path.join(__dirname, 'jsons', 'checkSeo.json');
    await fs.writeFile(checkJsonPath, JSON.stringify(checkResults, null, 2));
    console.log('SEO检查完成，结果已保存至 jsons/checkSeo.json');
  } else {
    console.log('所有文件均符合SEO要求，无需生成checkSeo.json');
  }
})().catch(err => {
  console.error("处理文件时发生错误", err);
});