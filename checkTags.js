const fs = require('fs').promises;
const path = require('path');

let checkResults = {};

// 检查Markdown文件的tags和category格式
async function checkMdTags(filePath, content) {
  const errors = [];
  
  // 提取YAML front matter（忽略开头的BOM字符和空白字符）
  const yamlMatch = content.match(/^\s*---[\s\S]*?---/);
  if (!yamlMatch) {
    errors.push("缺少 YAML front matter");
    return errors;
  }
  
  const yamlContent = yamlMatch[0];
  
  // 检查是否有tags字段
  if (!/tags:/m.test(yamlContent)) {
    errors.push("缺少 tags 字段");
  }
  
  // 检查tags格式
  const tagsMatch = yamlContent.match(/tags:\s*(.*?)(?=\n\w+:|$)/ms);
  if (tagsMatch) {
    const tagsContent = tagsMatch[1].trim();
    
    // 检查是否为数组格式
    if (!/^\[.*\]$/s.test(tagsContent)) {
      errors.push("tags 格式不正确，应为数组格式: tags: [标签1, 标签2]");
    }
  }
  
  // 检查是否有category字段
  if (!/category:/m.test(yamlContent)) {
    errors.push("缺少 category 字段");
  }
  
  // 检查category格式（不应该是数组）
  const categoryMatch = yamlContent.match(/category:\s*(.*?)(?=\n\w+:|$)/ms);
  if (categoryMatch) {
    const categoryContent = categoryMatch[1].trim();
    
    // 检查是否为数组格式（不应该是数组）
    if (/^\[.*\]$/s.test(categoryContent)) {
      errors.push("category 格式不正确，不应为数组格式，应为字符串格式: category: 分类名称");
    }
  }
  
  return errors;
}

// 删除旧的检查文件
async function deleteOldCheckFile() {
  const checkJsonPath = path.join(__dirname, 'jsons', 'checkTags.json');
  try {
    await fs.unlink(checkJsonPath);
    console.log('旧的 checkTags.json 文件已被删除');
  } catch (err) {
    if (err.code === 'ENOENT') {
      // 如果文件不存在，则无需处理
      console.log('未找到旧的 checkTags.json 文件，跳过删除');
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

// 主执行函数
(async () => {
  const jsonDir = path.join(__dirname, 'jsons');
  await ensureDirectoryExist(jsonDir);
  await deleteOldCheckFile();
  
  // 读取 mdfiles 目录
  const mdFilesDir = path.join(__dirname, 'mdfiles');
  const files = await fs.readdir(mdFilesDir, { withFileTypes: true });
  
  // 过滤出 .md 文件
  const mdFiles = files.filter(file => file.isFile() && path.extname(file.name) === '.md');
  
  // 检查每个 .md 文件
  for (const file of mdFiles) {
    const filePath = path.join('mdfiles', file.name);
    const fileContent = await fs.readFile(path.join(__dirname, filePath), 'utf-8');
    
    const errors = await checkMdTags(filePath, fileContent);
    if (errors.length > 0) {
      checkResults[filePath.replace(/\\/g, '/')] = { msg: errors.join('; ') };
    }
  }
  
  // 写入结果到 JSON 文件
  if (Object.keys(checkResults).length > 0) {
    const checkJsonPath = path.join(__dirname, 'jsons', 'checkTags.json');
    await fs.writeFile(checkJsonPath, JSON.stringify(checkResults, null, 2));
    console.log('Tags检查完成，结果已保存至 jsons/checkTags.json');
  } else {
    console.log('所有文件的tags格式均正确，无需生成checkTags.json');
  }
})().catch(err => {
  console.error("处理文件时发生错误", err);
});
