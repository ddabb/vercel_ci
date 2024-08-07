const fs = require('fs').promises; // 使用 fs.promises API，它返回 Promises
const path = require('path');

// 基础目录
const baseHtmlDir = 'html';
const domain = 'https://www.60score.com'; // 替换为你的域名

// 创建站点地图的开头
let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// 遍历HTML文件目录
fs.readdir(baseHtmlDir, { withFileTypes: true })
  .then(files => {
    // 过滤出 HTML 文件，并为每个文件创建一个 Promise
    const promises = files.filter(file => file.isFile() && path.extname(file.name) === '.html')
      .map(file => {
        const filePath = path.join(baseHtmlDir, file.name);
        return fs.stat(filePath).then(stats => {
          const lastmod = stats.mtime.toISOString().substring(0, 10);
          return `<url><loc>${domain}/${file.name}</loc><lastmod>${lastmod}</lastmod></url>\n`;
        });
      });

    // 等待所有文件的 stat 操作完成
    return Promise.all(promises);
  })
  .then(urls => {
    // 所有文件处理完成，将 URL 添加到 sitemapXml
    sitemapXml += urls.join('');
    sitemapXml += '</urlset>';

    // 写入文件
    return fs.writeFile('sitemap.xml', sitemapXml);
  })
  .then(() => {
    console.log('Sitemap generated successfully.');
  })
  .catch(err => {
    console.error("处理文件时发生错误", err);
    throw err;
  });