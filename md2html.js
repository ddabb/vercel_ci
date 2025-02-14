const fs = require('fs').promises;
const path = require('path');
const showdown = require('showdown');
const ejs = require('ejs');
const yaml = require('js-yaml');

const converter = new showdown.Converter();

async function readMarkdownFile(filePath) {
  console.log(`Reading Markdown file: ${filePath}`);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch (error) {
    console.error(`Error reading file: ${filePath}`, error);
    throw error;
  }
}

// 新增元数据提取
const extractFrontMatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? yaml.load(match[1]) : {};
};

// 修改转换函数
function convertMarkdownToHtml(markdownContent) {
  const { title, description, tags,category } = extractFrontMatter(markdownContent);
  return {
    content: converter.makeHtml(markdownContent.replace(/^---\n[\s\S]*?\n---/, '')),
    meta: { title, description, tags,category }
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

async function mdToHtml(mdFilesDirectory = 'mdfiles', genhtmlDirectory = 'mdhtml', htmlTemplatePath = 'components/article.ejs') {
  console.log('Starting mdToHtml process...');
  const componentsDirectory = path.join(__dirname, 'components');

  try {
    await ensureComponentsDirectory(componentsDirectory);

    const mdFiles = await fs.readdir(mdFilesDirectory, { withFileTypes: true });
    const markdownFiles = mdFiles
      .filter((file) => file.isFile() && path.extname(file.name) === '.md')
      .map((file) => file.name);

    console.log(`Found ${markdownFiles.length} Markdown files.`);

    for (const fileName of markdownFiles) {
      const mdFilePath = path.join(mdFilesDirectory, fileName);
      let htmlContent;
      const markdownContent = await readMarkdownFile(mdFilePath);
      htmlContent = convertMarkdownToHtml(markdownContent);
      // 生成单独的 .html 文件
      const outputFilePath = path.join(genhtmlDirectory, `${path.basename(fileName, '.md')}.html`);
      await updateHtmlFile(htmlTemplatePath, htmlContent, outputFilePath);
    }

    console.log('Finished mdToHtml process...:');
  } catch (error) {
    console.error('Error during mdToHtml process:', error);
  }
}

if (require.main === module) {
  mdToHtml();
}