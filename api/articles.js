export default async function handler(request, response) {
    // 如果有人用除了GET以外的方法敲门，我们就不理他们
    if (request.method !== 'GET') {
      return response.status(405).end(); // Method Not Allowed
    }
  
    // 从请求中获取关键词和分页的信息
    const keyword = request.query.keyword || '';
    const pageSize = parseInt(request.query.pageSize) || 10;
    const page = parseInt(request.query.page) || 1;
    const startIndex = (page - 1) * pageSize;
  
    try {
      // 使用魔法（Node.js的fs模块）去读取我们的文章清单
      const fs = require('fs');
      const path = require('path');
  
      const data = await new Promise((resolve, reject) => {
        fs.readFile(path.join(process.cwd(), 'jsons/mdfiles.json'), 'utf8', (err, data) => {
          if (err) {
            reject(err);
          } else {
            resolve(JSON.parse(data));
          }
        });
      });
  
      let articles = data;
  
      // 如果有人提供了关键词，我们就只给他们看包含关键词的文章
      if (keyword) {
        articles = articles.filter(article => {
          return article.name.toLowerCase().includes(keyword.toLowerCase());
        });
      }
  
      // 计算总页数和当前页的文章
      const totalArticles = articles.length;
      const totalPages = Math.ceil(totalArticles / pageSize);
      const pageArticles = articles.slice(startIndex, startIndex + pageSize);
  
      // 把文章发给请求者
      response.status(200).json({ articles: pageArticles, currentPage: page, totalPages, pageSize });
    } catch (error) {
      // 如果发生错误，我们要告诉请求者
      console.error('Error reading articles:', error);
      response.status(500).json({ message: 'Error fetching articles' });
    }
  }