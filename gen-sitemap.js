const fs = require('fs').promises;
const path = require('path');

// 定义目录数组
const dirs = ['html', 'mdhtml', 'sghtml'];
const domain = 'https://www.60score.com/';

let sitemapXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
sitemapXml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';

// 遍历目录数组
const promises = dirs.map(dir => {
  return fs.readdir(path.join(__dirname, dir), { withFileTypes: true })
    .then(files => {
      // 过滤出 HTML 并为每个文件创建一个 Promise
      return files.filter(file => file.isFile() && ['.html'].includes(path.extname(file.name)))
        .map(file => {
          const filePath = path.join(dir, file.name);
          return fs.stat(filePath).then(stats => {
            const lastmod = stats.mtime.toISOString().substring(0, 10);
            const urlPath = filePath.replace(/\\/g, '/');
            return `<url><loc>${domain}${urlPath}</loc><lastmod>${lastmod}</lastmod></url>\n`;
          });
        });
    });
});

// 等待所有目录的文件列表操作完成
Promise.all(promises)
  .then(results => {
    // 等待所有 Promise 解决，以获取 URL 字符串
    return Promise.all(results.flat());
  })
  .then(urls => {
    // 将所有目录的 URL 添加到 sitemapXml
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