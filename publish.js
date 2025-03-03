const { execSync } = require('child_process')
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const ejs = require('ejs');
const xlsx = require('xlsx');
const mdFilesDirectory = path.resolve(__dirname, 'mdfiles');
const jsonOutputPath = path.resolve(__dirname, 'jsons', 'mdfiles.json');
const goodsOutputPath = path.resolve(__dirname, 'jsons', 'goodlinks.json');

const NoDescriptionListPath = path.resolve(__dirname, 'jsons', 'NoDescriptionLists.json');
const TitleAndDescPath = path.resolve(__dirname, 'jsons', 'TitleAndDescPaths.json');
const GoodsPath = path.resolve(__dirname, 'jsons', 'Goods.json');
// 假设Excel文件存放在与mdfiles同级的excelFiles目录下
const excelFilesDirectory = path.resolve(__dirname, 'excelFiles');


function prepareCheckData(mdFiles) {
  // 创建一个映射来存储按类别组织的文章
  const categoryMap = {};

  mdFiles.forEach(file => {
    if (!categoryMap[file.category]) {
      categoryMap[file.category] = [];
    }
    
    categoryMap[file.category].push({
      title: file.title,
      description: file.description || "", // 如果没有描述，则提供一个空字符串
      tags: file.tags ? [...file.tags].sort() : [], // 确保标签存在并是排序后的
      category: file.category // 添加类别信息
    });
  });

  // 将映射转换为有序数组，并对每类内的文章按标题排序
  let checkData = Object.keys(categoryMap)
    .sort() // 对分类名进行排序
    .reduce((acc, category) => {
      // 对当前分类中的文章按标题排序后加入结果数组
      acc.push(...categoryMap[category]
        .sort((a, b) => a.title.localeCompare(b.title))
        .map(article => ({
          title: article.title,
          description: article.description,
          category: article.category,
          tags: article.tags
        })));
      return acc;
    }, []);

  return checkData;
}

function readExcelFiles(directory) {
  const goodsLinks = [];

  if (fs.existsSync(directory)) {
    const files = fs.readdirSync(directory);

    files.forEach(file => {
      const filePath = path.join(directory, file);

      if (path.extname(file).toLowerCase() === '.xlsx') {
        const workbook = xlsx.readFile(filePath);
        const stats = fs.statSync(filePath);
        const sheetNames = workbook.SheetNames;

        sheetNames.forEach(sheetName => {
          const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

          // 假设Excel中的链接在'Link'列，如果有不同的结构，请根据实际情况调整
          data.forEach(row => {
            if (row.商品名称) { // 确保行中有链接
              goodsLinks.push({
                name: row.商品名称 || '未知名称', // 如果有商品名称字段则使用，否则默认值
                link: row.商品详情页URL,
                picLink: row.商品主图链接,
                monthSale: row.月销,
                unitprice: row.单价, //京东价
                handPrice: row.到手价, //到手价      
                showurl: row.联盟推广链接,
                birthtime: stats.birthtime,
                updateTime: stats.mtime,
              });
            }
          });
        });
      }
    });
  }

  return goodsLinks;
}

// 提取Front-matter元数据并计算字数
function extractFrontMatterAndCountWords(content) {
  const fmRegex = /^(\uFEFF)?(?:---|\+\+\+)\r?\n([\s\S]*?)\r?\n(?:---|\+\+\+)(?:\s*?$)/m;
  const match = content.match(fmRegex);
  
  let frontMatter = {};
  if (match) {
    try {
      frontMatter = yaml.load(match[2]); // 捕获组索引变为2
    } catch (e) {
      console.warn('YAML解析错误:', e.message);
    }
  }

  // 计算正文部分的实际字数，忽略所有类型的空白字符
  const bodyText = content.substring(match ? match[0].length : 0); // 如果没有front matter，则从头开始
  const wordCount = bodyText.replace(/\s+/g, '').length; // 移除所有空白字符后计算长度

  return { frontMatter, wordCount };
}



// 清空指定目录
function emptyDirectory(dirPath) {
  if (fs.existsSync(dirPath)) {
    const files = fs.readdirSync(dirPath);
    files.forEach(function (file) {
      const filePath = path.join(dirPath, file);
      try {
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath); // 删除文件
        } else {
          emptyDirectory(filePath); // 递归删除子目录
          fs.rmdirSync(filePath); // 删除空目录
        }
      } catch (err) {
        console.error(`无法删除 ${filePath}:`, err.message);
      }
    });
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
      const { frontMatter, wordCount } = extractFrontMatterAndCountWords(content);

      return {
        name: file.name,
        title: frontMatter.title || path.basename(file.name, '.md'),
        description: frontMatter.description || '',
        goodsName: frontMatter.goodsName,
        category: frontMatter.category || '未分类',
        tags: frontMatter.tags || [],
        birthtime: stats.birthtime,
        updateTime: stats.mtime,
        wordCount: wordCount 
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
  // 在写入JSON文件之前调用readExcelFiles函数获取goodsLinks
  const goodsLinks = readExcelFiles(excelFilesDirectory);
  // 获取没有描述的文章标题列表和销售映射关系
  const NoDescriptionList = mdFiles.filter(file => !file.description).map(file => file.title);

  // 在处理完mdFiles之后，找到有描述但无商品链接的文章，并保存到TitleAndDescPath
  const articlesWithTitleAndDesc = mdFiles.filter(file => file.description && !file.goodsName).map(file => ({
    title: file.title,
    description: file.description
  }));

  fs.writeFileSync(TitleAndDescPath, JSON.stringify(articlesWithTitleAndDesc, null, 2));

  // 提取goodsLinks中的name和showurl字段
  const goodUrls = goodsLinks.map(good => (
  good.name

 ));

  fs.writeFileSync(GoodsPath, JSON.stringify(goodUrls, null, 2));

  // 写入JSON文件
  fs.writeFileSync(jsonOutputPath, JSON.stringify({
    meta: {
      generatedAt: new Date().toISOString(),
      totalFiles: mdFiles.length
    },
    taxonomy,
    files: mdFiles,
    goodsLinks

  }, null, 2));



  // 写入JSON文件
  fs.writeFileSync(NoDescriptionListPath, JSON.stringify(NoDescriptionList, null, 2));

  fs.writeFileSync(goodsOutputPath, JSON.stringify(goodsLinks, null, 2));
  // 使用准备好的函数生成check.json所需的数据
  const checkJsonData = prepareCheckData(mdFiles);

  // 写入check.json文件
  const checkOutputPath = path.resolve(__dirname, 'jsons', 'check.json');
  fs.writeFileSync(checkOutputPath, JSON.stringify(checkJsonData, null, 2));
  // 确保输出目录存在
  const outputDir = path.resolve(__dirname);
  const tagOutputDir = path.join(outputDir, 'tag');
  const categoryOutputDir = path.join(outputDir, 'category');
  emptyDirectory(tagOutputDir);
  emptyDirectory(categoryOutputDir);

  if (!fs.existsSync(tagOutputDir)) {
    fs.mkdirSync(tagOutputDir, { recursive: true });
  }

  if (!fs.existsSync(categoryOutputDir)) {
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


  console.log(`✅ 已更新: ${checkOutputPath}`);
  console.log(`✅ 已更新: ${jsonOutputPath}`);
  console.log(`📂 分类统计: ${Object.keys(taxonomy.categories).length}个`);
  console.log(`🏷️ 标签统计: ${Object.keys(taxonomy.tags).length}个`);
  console.log('📄 已生成: 标签列表.html, 分类列表.html 及各自的详细页面');

  console.log('\n📄 转换 Markdown 到 HTML...')
  execSync('node md2html.js', { stdio: 'inherit' })

  console.log('\n📻 生成 RSS 订阅...')
  execSync('node rss.js', { stdio: 'inherit' })

  console.log('\n🗺️ 生成网站地图...')
  execSync('node sitemap.js', { stdio: 'inherit' })

  console.log('\n🗺️ 进行SEO检查...')
  execSync('node seocheck.js', { stdio: 'inherit' })
  console.log('\n✅ 所有任务已完成！')



} catch (error) {
  console.error('❌ 处理失败:', error.message);
  process.exit(1);
}