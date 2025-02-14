const fs = require('fs').promises;
const path = require('path');
const showdown = require('showdown');
const ejs = require('ejs');
const { minify } = require('html-minifier');
const yaml = require('js-yaml');

// 初始化Showdown转换器（文献3）
const converter = new showdown.Converter({
  tables: true,
  tasklists: true,
  metadata: true,
  extensions: [{
    type: 'output',
    regex: /<h([1-6])/g,
    replace: (match, level) => `<h${level} id="heading-${level}"`
  }]
});

// 提取Front-matter元数据（文献5）
const extractFrontMatter = (content) => {
  const match = content.match(/^---\n([\s\S]*?)\n---/);
  return match ? yaml.load(match[1]) : {};
};

// HTML压缩配置（文献3）
const htmlMinOptions = {
  collapseWhitespace: true,
  removeComments: true,
  minifyCSS: true,
  minifyJS: true,
  processConditionalComments: true
};

async function mdToHtml(
  mdFilesDirectory = 'mdfiles',
  genhtmlDirectory = 'mdhtml',
  htmlTemplatePath = 'components/article.ejs'
) {
  try {
    // 并行处理文件（文献2）
    const files = await fs.readdir(mdFilesDirectory, { withFileTypes: true });
    const markdownFiles = files
      .filter(file => file.isFile() && path.extname(file.name) === '.md')
      .map(file => path.join(mdFilesDirectory, file.name));

    console.log(`Found ${markdownFiles.length} Markdown files`);

    // 使用Promise.all并行处理（文献1）
    await Promise.all(markdownFiles.map(async mdFilePath => {
      try {
        const [markdownContent, header, footer] = await Promise.all([
          fs.readFile(mdFilePath, 'utf8'),
          fs.readFile(path.join(__dirname, 'components/header.ejs'), 'utf8'),
          fs.readFile(path.join(__dirname, 'components/footer.ejs'), 'utf8')
        ]);

        // 提取元数据（文献5）
        const { title = path.basename(mdFilePath, '.md'), description = '', keywords = [] } = extractFrontMatter(markdownContent);
        
        // 转换Markdown（文献3）
        const content = converter.makeHtml(markdownContent.replace(/^---\n[\s\S]*?\n---/, ''));
        
        // 生成HTML（文献4）
        const html = await ejs.renderFile(htmlTemplatePath, {
          meta: { title, description, keywords },
          articleContent: content,
          headerContent: header,
          footerContent: footer,
          canonical: `https://yourdomain.com/${path.basename(mdFilePath, '.md')}`
        }, { async: true });

        // 压缩并写入文件（文献3）
        const outputPath = path.join(genhtmlDirectory, `${path.basename(mdFilePath, '.md')}.html`);
        await fs.writeFile(outputPath, minify(html, htmlMinOptions));
        
        console.log(`Generated: ${outputPath}`);
      } catch (error) {
        console.error(`Error processing ${mdFilePath}:`, error.message);
      }
    }));

    console.log('Process completed');
  } catch (error) {
    console.error('Critical error:', error.message);
    process.exit(1);
  }
}

// 添加SEO优化模板示例（文献4）
/*
<!-- components/article.ejs -->
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <title><%= meta.title %></title>
  <meta name="description" content="<%= meta.description %>">
  <meta name="keywords" content="<%= meta.keywords.join(',') %>">
  <link rel="canonical" href="<%= canonical %>">
  <%- headerContent %>
</head>
<body>
  <article class="markdown-body">
    <%- articleContent %>
  </article>
  <%- footerContent %>
</body>
</html>
*/