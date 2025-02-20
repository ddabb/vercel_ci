const fs = require('fs').promises;
const path = require('path');

// 定义目录数组
const dirs = ['html', 'mdhtml', 'sghtml','tag','category'];
const domain = 'https://www.60score.com/';

let feedXml = '<?xml version="1.0" encoding="UTF-8"?>\n';
feedXml += '<rss version="2.0">\n';
feedXml += '<channel>\n';
feedXml += `<title>自助工具站</title>\n`;
feedXml += `<link>${domain}</link>\n`;
feedXml += `<description>自助工具站</description>\n`;
feedXml += `<language>zh-cn</language>\n`;

// 遍历目录数组
const promises = dirs.map(dir => {
  return fs.readdir(path.join(__dirname, dir), { withFileTypes: true })
    .then(files => {
      // 过滤出 HTML 文件并为每个文件创建一个 Promise
      return files.filter(file => file.isFile() && ['.html'].includes(path.extname(file.name)))
        .map(file => {
          const filePath = path.join(dir, file.name);
          return fs.stat(filePath).then(stats => {
            const lastmod = stats.mtime.toISOString();
            const urlPath = filePath.replace(/\\/g, '/');
            return `
              <item>
                <title>${file.name.replace('.html', '')}</title>
                <link>${domain}${urlPath}</link>
                <description>Description for ${file.name}</description>
                <pubDate>${lastmod}</pubDate>
                <guid>${domain}${urlPath}</guid>
              </item>\n`;
          });
        });
    });
});

// 等待所有目录的文件列表操作完成
Promise.all(promises)
  .then(results => {
    // 等待所有 Promise 解决，以获取 item 字符串
    return Promise.all(results.flat());
  })
  .then(items => {
    // 将所有目录的 item 添加到 feedXml
    feedXml += items.join('');
    feedXml += '</channel>\n';
    feedXml += '</rss>';

    // 写入文件
    return fs.writeFile('feed.xml', feedXml);
  })
  .then(() => {
    console.log('RSS feed generated successfully.');
  })
  .catch(err => {
    console.error("处理文件时发生错误", err);
    throw err;
  });