const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const mdFilesDirectory = path.resolve(__dirname, 'mdfiles');
const jsonOutputPath = path.resolve(__dirname, 'jsons', 'mdfiles.json');

// 提取Front-matter元数据
function extractFrontMatter(content) {
  try {
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    return match ? yaml.load(match[1]) : {};
  } catch (e) {
    console.warn('Front-matter解析错误:', e.message);
    return {};
  }
}

// 生成分类/标签统计
function generateTaxonomy(items, field) {
  return items.reduce((acc, item) => {
    const values = Array.isArray(item[field]) ? item[field] : [item[field]];
    values.forEach(value => {
      if (value) acc[value] = (acc[value] || 0) + 1;
    });
    return acc;
  }, {});
}

try {
  if (!fs.existsSync(mdFilesDirectory)) {
    throw new Error(`目录不存在: ${mdFilesDirectory}`);
  }

  // 读取并处理Markdown文件
  const mdFiles = fs.readdirSync(mdFilesDirectory, { withFileTypes: true })
    .filter(file => file.isFile() && path.extname(file.name) === '.md')
    .map(file => {
      const filePath = path.join(mdFilesDirectory, file.name);
      const stats = fs.statSync(filePath);
      const content = fs.readFileSync(filePath, 'utf8');
      const frontMatter = extractFrontMatter(content);

      return {
        name: file.name,
        title: frontMatter.title || path.basename(file.name, '.md'),
        description: frontMatter.description || '',
        category: frontMatter.category || '未分类',
        tags: frontMatter.tags || [],
        birthtime: stats.birthtime,
        updateTime: stats.mtime,
        wordCount: content.split(/\s+/).length
      };
    });

  // 按创建时间排序
  mdFiles.sort((a, b) => b.birthtime - a.birthtime);
  mdFiles.forEach((file, index) => file.order = index + 1);

  // 生成统计数据
  const taxonomy = {
    categories: generateTaxonomy(mdFiles, 'category'),
    tags: generateTaxonomy(mdFiles, 'tags')
  };

  // 写入JSON文件
  fs.writeFileSync(jsonOutputPath, JSON.stringify({
    meta: {
      generatedAt: new Date().toISOString(),
      totalFiles: mdFiles.length
    },
    taxonomy,
    files: mdFiles
  }, null, 2));

// 确保输出目录存在
const outputDir = path.resolve(__dirname);
const tagOutputDir = path.join(outputDir, 'tag');
const categoryOutputDir = path.join(outputDir, 'category');

if (!fs.existsSync(tagOutputDir)){
  fs.mkdirSync(tagOutputDir, { recursive: true });
}

if (!fs.existsSync(categoryOutputDir)){
  fs.mkdirSync(categoryOutputDir, { recursive: true });
}

function sanitizeFileName(name) {
  return name.replace(/[\/\\?%*:|"<>]/g, '-'); // 将非法字符替换为'-'
}

// 加载EJS模板
const tagsTemplate = fs.readFileSync(path.join(__dirname, 'components', 'tags.ejs'), 'utf8');
const categoriesTemplate = fs.readFileSync(path.join(__dirname, 'components', 'categories.ejs'), 'utf8');
const tagTemplate = fs.readFileSync(path.join(__dirname, 'components', 'tag.ejs'), 'utf8');
const categoryTemplate = fs.readFileSync(path.join(__dirname, 'components', 'category.ejs'), 'utf8');

// 获取header和footer内容
const headerContent = fs.readFileSync(path.join(__dirname, 'components', 'header.ejs'), 'utf8');
const footerContent = fs.readFileSync(path.join(__dirname, 'components', 'footer.ejs'), 'utf8');

// 渲染并写入标签列表页面
let renderedTagsHtml = ejs.render(tagsTemplate, { taxonomy, headerContent, footerContent, sanitizeFileName });
fs.writeFileSync(path.join(tagOutputDir, '标签列表.html'), renderedTagsHtml);

// 渲染并写入分类列表页面
let renderedCategoriesHtml = ejs.render(categoriesTemplate, { taxonomy, headerContent, footerContent, sanitizeFileName });
fs.writeFileSync(path.join(categoryOutputDir, '分类列表.html'), renderedCategoriesHtml);

// 为每个标签生成详细页面
Object.keys(taxonomy.tags).forEach(tag => {
  const articlesWithTag = mdFiles.filter(file => file.tags.includes(tag));
  let renderedTagPage = ejs.render(tagTemplate, { tag, articles: articlesWithTag, headerContent, footerContent });
  fs.writeFileSync(path.join(tagOutputDir, `${sanitizeFileName(tag)}.html`), renderedTagPage);
});

// 为每个分类生成详细页面
Object.keys(taxonomy.categories).forEach(category => {
  const articlesInCategory = mdFiles.filter(file => file.category === category);
  let renderedCategoryPage = ejs.render(categoryTemplate, { category, articles: articlesInCategory, headerContent, footerContent });
  fs.writeFileSync(path.join(categoryOutputDir, `${sanitizeFileName(category)}.html`), renderedCategoryPage);
});

console.log(`✅ 已更新: ${jsonOutputPath}`);
console.log(`📂 分类统计: ${Object.keys(taxonomy.categories).length}个`);
console.log(`🏷️ 标签统计: ${Object.keys(taxonomy.tags).length}个`);
console.log('📄 已生成: 标签列表.html, 分类列表.html 及各自的详细页面');



} catch (error) {
  console.error('❌ 处理失败:', error.message);
  process.exit(1);
}