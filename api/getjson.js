// src/api/getjson.js
import fs from 'fs';
import path from 'path';
import { log } from 'console'; // 引入 console.log 函数

export default async function handler(req, res) {
  log('getjson API called:', req.query); // 使用 log 函数输出日志
  // 只接受GET请求
  if (req.method !== 'GET') {
    return res.status(405).end(); // Method Not Allowed
  }

  const { keyword = '', pageSize = 20, page = 1 } = req.query;
  const startIndex = (parseInt(page) - 1) * parseInt(pageSize);

  try {
    const dataPath = path.join(process.cwd(), 'src', 'jsons', 'articleList.json');
    const jsonData = await fs.promises.readFile(dataPath, 'utf8');
    let articles = JSON.parse(jsonData).articles;

    // 如果提供了关键词，则进行过滤
    if (keyword) {
      const lowerCaseKeyword = keyword.toLowerCase();
      articles = articles.filter(article => 
        article.title.toLowerCase().includes(lowerCaseKeyword) ||
        article.category.toLowerCase().includes(lowerCaseKeyword) ||
        (article.description && article.description.toLowerCase().includes(lowerCaseKeyword))
      );
    }

    // 计算总页数和当前页的文章
    const totalArticles = articles.length;
    const totalPages = Math.ceil(totalArticles / parseInt(pageSize));
    const pageArticles = articles.slice(startIndex, startIndex + parseInt(pageSize));

    // 返回结果
    return res.status(200).json({ articles: pageArticles, currentPage: parseInt(page), totalPages, pageSize });
  } catch (error) {
    console.error('Error reading articles:', error); // 使用 console.error 输出错误日志
    return res.status(500).json({ message: 'Error fetching articles' });
  }
}