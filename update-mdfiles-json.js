const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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

//  // 创建输出目录
//  const outputDir = path.resolve(__dirname, 'classify');
//  if (!fs.existsSync(outputDir)){
//    fs.mkdirSync(outputDir);
//  }

//  // 生成tags.html
//  let tagsHtmlContent = '<html><head><title>Tags</title></head><body><h1>Tags</h1><ul>';
//  Object.keys(taxonomy.tags).forEach(tag => {
//    const encodedTag = encodeURIComponent(tag);
//    tagsHtmlContent += `<li><a href="/tags/${encodedTag}/">${tag} (${taxonomy.tags[tag]})</a></li>`;
//  });
//  tagsHtmlContent += '</ul></body></html>';
//  fs.writeFileSync(path.join(outputDir, 'tags.html'), tagsHtmlContent);

//  // 为每个标签生成详细页面
//  Object.keys(taxonomy.tags).forEach(tag => {
//    const articlesWithTag = mdFiles.filter(file => file.tags.includes(tag));
//    let tagPageContent = '<html><head><title>Tag: ' + tag + '</title></head><body><h1>Articles with Tag: ' + tag + '</h1><ul>';
//    articlesWithTag.forEach(article => {
//      tagPageContent += `<li><a href="/article/${encodeURIComponent(article.name)}/">${article.title}</a></li>`;
//    });
//    tagPageContent += '</ul><a href="/tags.html">Back to Tags</a></body></html>';
//    fs.writeFileSync(path.join(outputDir, `tag-${encodeURIComponent(tag)}.html`), tagPageContent);
//  });

//  // 类似地，生成categories.html以及每个分类的具体内容页面
//  let categoriesHtmlContent = '<html><head><title>Categories</title></head><body><h1>Categories</h1><ul>';
//  Object.keys(taxonomy.categories).forEach(category => {
//    const encodedCategory = encodeURIComponent(category);
//    categoriesHtmlContent += `<li><a href="/categories/${encodedCategory}/">${category} (${taxonomy.categories[category]})</a></li>`;
//  });
//  categoriesHtmlContent += '</ul></body></html>';
//  fs.writeFileSync(path.join(outputDir, 'categories.html'), categoriesHtmlContent);

//  Object.keys(taxonomy.categories).forEach(category => {
//    const articlesInCategory = mdFiles.filter(file => file.category === category);
//    let categoryPageContent = '<html><head><title>Category: ' + category + '</title></head><body><h1>Articles in Category: ' + category + '</h1><ul>';
//    articlesInCategory.forEach(article => {
//      categoryPageContent += `<li><a href="/article/${encodeURIComponent(article.name)}/">${article.title}</a></li>`;
//    });
//    categoryPageContent += '</ul><a href="/categories.html">Back to Categories</a></body></html>';
//    fs.writeFileSync(path.join(outputDir, `category-${encodeURIComponent(category)}.html`), categoryPageContent);
//  });

//  console.log(`✅ 已更新: ${jsonOutputPath}`);
//  console.log(`📂 分类统计: ${Object.keys(taxonomy.categories).length}个`);
//  console.log(`🏷️ 标签统计: ${Object.keys(taxonomy.tags).length}个`);
//  console.log('📄 已生成: tags.html, categories.html, 及各自的详细页面');



} catch (error) {
  console.error('❌ 处理失败:', error.message);
  process.exit(1);
}