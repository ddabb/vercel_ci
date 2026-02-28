const fs = require('fs').promises;
const fs1 = require('fs');
const path = require('path');
const ejs = require('ejs');
const yaml = require('js-yaml');
const MarkdownIt = require('markdown-it');
const mathjax = require('markdown-it-mathjax3'); // 用于支持数学公式
const jsonFilePath = path.join(__dirname, 'jsons', 'goodlinks.json');
let notFoundGoodsArticles = [];

async function readDirFile(filePath) {
  console.log(`Reading Markdown file: ${filePath}`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    throw error;
  }
}

// 提取 Markdown 文件的 Front Matter
const FRONT_MATTER_REGEX = /^(\uFEFF)?(?:---|\+\+\+)\r?\n([\s\S]*?)\r?\n(?:---|\+\+\+)(?:\s*$)/m;

const extractFrontMatter = (content) => {
  const match = content.match(FRONT_MATTER_REGEX);
  if (!match) return { metadata: {}, cleanedContent: content };

  try {
    return {
      metadata: yaml.load(match[2].trimEnd()), // 处理尾部空行
      cleanedContent: content.slice(match[0].length) // 直接切片提升性能
    };
  } catch (e) {
    console.error(`YAML解析失败: ${e.message}`, match[2]);
    return { metadata: {}, cleanedContent: content };
  }
};

// 配置 markdown-it
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  linkify: true, // 自动将 URL 转换为链接
  typographer: false // 禁用智能排版（避免 `_` 被解析为斜体）
});

// 使用 markdown-it-mathjax3 插件支持数学公式
md.use(mathjax);

async function convertMarkdownToHtml(markdownContent, stats) {
  const { metadata, cleanedContent } = extractFrontMatter(markdownContent);
  let goodLinksData = {};
  try {
    const jsonData = await readDirFile(jsonFilePath);
    goodLinksData = JSON.parse(jsonData);
  } catch (error) {
    console.error(`Error reading or parsing goodlinks.json: ${error.message}`);
  }

  // 构建 goodsinfo 对象
  let goodsInfo = {};
  if (metadata.goodsName) {
    const targetGood = goodLinksData.find(good => good.name.trimEnd() === metadata.goodsName.trimEnd());
    if (targetGood) {
      goodsInfo = {
        name: targetGood.name,
        link: targetGood.link,
        picLink: `https://${targetGood.picLink}`,
        monthSale: targetGood.monthSale,
        unitprice: targetGood.unitprice,
        handPrice: targetGood.handPrice,
        showurl: targetGood.showurl
      };
    } else {
      console.error(`没有找到商品信息：${metadata.goodsName}`);
      notFoundGoodsArticles.push({
        title: metadata.title || '无标题',
        description: metadata.description || '',
        goodsName: metadata.goodsName
      });
    }
  }

  // 使用 markdown-it 转换 Markdown 内容
  const contentHtml = md.render(cleanedContent);

  return {
    content: contentHtml,
    meta: {
      title: metadata.title || '无标题',
      description: metadata.description || '',
      updateTime: stats.mtime,
      goodsInfo: goodsInfo,
      tags: Array.isArray(metadata.tags) ? metadata.tags.map(tag => String(tag).trim()).filter(Boolean) : [],
      category: metadata.category || '未分类'
    }
  };
}

async function ensureComponentsDirectory(componentsDirectory) {
  console.log(`Ensuring components directory exists: ${componentsDirectory}`);
  try {
    await fs.access(componentsDirectory);
  } catch (error) {
    await fs.mkdir(componentsDirectory);
    console.log(`Created ${componentsDirectory}`);
  }
}

async function readEjsFile(filePath) {
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading EJS file: ${filePath}`, error);
    throw error;
  }
}

async function updateHtmlFile(htmlFilePath, htmlContent, outputFilePath) {
  console.log(`Updating HTML file: ${outputFilePath}`);
  try {
    const headerContent = await readEjsFile(path.join(__dirname, 'components', 'header.ejs'));
    const footerContent = await readEjsFile(path.join(__dirname, 'components', 'footer.ejs'));
    const updatedHtml = await ejs.renderFile(htmlFilePath, {
      articleContent: htmlContent.content,
      meta: htmlContent.meta,
      headerContent: headerContent,
      footerContent: footerContent
    }, { escape: false });
    await fs.writeFile(outputFilePath, updatedHtml);
  } catch (error) {
    console.error(`Error updating HTML file: ${outputFilePath}`, error);
    throw error;
  }
}

async function emptyDirectory(directoryPath) {
  console.log(`Emptying directory: ${directoryPath}`);
  try {
    const files = await fs.readdir(directoryPath);
    const removePromises = files.map(file => fs.unlink(path.join(directoryPath, file)));
    await Promise.all(removePromises);
    console.log(`Successfully emptied directory: ${directoryPath}`);
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Directory does not exist: ${directoryPath}`);
    } else {
      console.error(`Error emptying directory: ${directoryPath}`, error);
      throw error;
    }
  }
}

async function mdToHtml(mdFilesDirectory = 'mdfiles', genhtmlDirectory = 'mdhtml', htmlTemplatePath = 'components/article.ejs') {
  console.log('Starting mdToHtml process...');
  const componentsDirectory = path.join(__dirname, 'components');

  try {
    await ensureComponentsDirectory(componentsDirectory);
    await emptyDirectory(genhtmlDirectory);
    const mdFiles = await fs.readdir(mdFilesDirectory, { withFileTypes: true });
    const markdownFiles = mdFiles
      .filter((file) => file.isFile() && path.extname(file.name) === '.md')
      .map((file) => file.name);

    console.log(`Found ${markdownFiles.length} Markdown files.`);

    for (const fileName of markdownFiles) {
      const mdFilePath = path.join(mdFilesDirectory, fileName);
      const markdownContent = await readDirFile(mdFilePath);
      const stats = fs1.statSync(mdFilePath);
      const htmlContent = await convertMarkdownToHtml(markdownContent, stats);
      const outputFilePath = path.join(genhtmlDirectory, `${path.basename(fileName, '.md')}.html`);
      await updateHtmlFile(htmlTemplatePath, htmlContent, outputFilePath); // 修正了这里
    }

    const notFindGoodsJsonPath = path.join(__dirname, 'jsons', 'NotFindGoods.json');
    await fs.writeFile(notFindGoodsJsonPath, JSON.stringify(notFoundGoodsArticles, null, 2));
    console.log('Finished mdToHtml process...');
  } catch (error) {
    console.error('Error during mdToHtml process:', error);
  }
}

if (require.main === module) {
  mdToHtml();
}