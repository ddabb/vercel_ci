const fs = require('fs').promises;
const fs1 = require('fs');
const path = require('path');
const showdown = require('showdown');
const ejs = require('ejs');
const yaml = require('js-yaml');
// 新增：引入用于读取JSON文件的fs模块
const jsonFilePath = path.join(__dirname, 'jsons', 'goodlinks.json');
let notFoundGoodsArticles = [];

const converter = new showdown.Converter({
  extensions: [
    {
      type: 'lang',
      regex: /(\$\$(.*?)\$\$)/g, // 匹配块级公式
      replace: '<span class="math display">$2</span>'
    },
    {
      type: 'lang',
      regex: /(\$(.*?)\$)/g, // 匹配行内公式
      replace: '<span class="math inline">$2</span>'
    }
  ]
});

async function readDirFile(filePath) {
  console.log(`Reading Markdown file: ${filePath}`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    throw error;
  }
}

// 配置增强型正则（预编译提升性能）
const FRONT_MATTER_REGEX = /^(\uFEFF)?(?:---|\+\+\+)\r?\n([\s\S]*?)\r?\n(?:---|\+\+\+)(?:\s*$)/m;

// 元数据提取优化版（单次解析完成数据提取与内容清理）
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

// 整合型转换函数（避免重复处理）
async function convertMarkdownToHtml(markdownContent,stats) {
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
        picLink: `https://${targetGood.picLink}`, // 追加 https:// 前缀
        monthSale: targetGood.monthSale,
        unitprice: targetGood.unitprice,
        handPrice: targetGood.handPrice,
        showurl: targetGood.showurl
      };
    } else {
      console.error(`没有找到商品信息：${metadata.goodsName}`);
      // 将找不到商品链接的文章信息添加到notFoundGoodsArticles数组中
      notFoundGoodsArticles.push({
        title: metadata.title || '无标题',
        description: metadata.description || '',
        goodsName: metadata.goodsName
      });
    }
  }


  return {
    content: converter.makeHtml(cleanedContent),
    meta: {
      title: metadata.title || '无标题',
      description: metadata.description || '',
      updateTime: stats.mtime,
      goodsInfo: goodsInfo, // 替换原有的 goodsLink
      tags: metadata.tags?.filter(Boolean) || [],
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
    console.log('Please copy header.ejs and footer.ejs from the package to this directory.');
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
    if (error.code === 'ENOENT') { // 目录不存在的情况
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
    // 新增：清空输出目录
    await emptyDirectory(genhtmlDirectory);
    const mdFiles = await fs.readdir(mdFilesDirectory, { withFileTypes: true });
    const markdownFiles = mdFiles
      .filter((file) => file.isFile() && path.extname(file.name) === '.md')
      .map((file) => file.name);

    console.log(`Found ${markdownFiles.length} Markdown files.`);

    for (const fileName of markdownFiles) {
      const mdFilePath = path.join(mdFilesDirectory, fileName);
      let htmlContent;
      const markdownContent = await readDirFile(mdFilePath);
      const stats = fs1.statSync(mdFilePath);
      htmlContent = await convertMarkdownToHtml(markdownContent,stats);
      // 生成单独的 .html 文件
      const outputFilePath = path.join(genhtmlDirectory, `${path.basename(fileName, '.md')}.html`);
      await updateHtmlFile(htmlTemplatePath, htmlContent, outputFilePath);
    }
  // 在所有Markdown文件处理完毕后，将找不到商品的文章信息写入NotFindGoods.json
  const notFindGoodsJsonPath = path.join(__dirname, 'jsons', 'NotFindGoods.json');
  await fs.writeFile(notFindGoodsJsonPath, JSON.stringify(notFoundGoodsArticles, null, 2));
    console.log('Finished mdToHtml process...:');
  } catch (error) {
    console.error('Error during mdToHtml process:', error);
  }
}

if (require.main === module) {
  mdToHtml();
}