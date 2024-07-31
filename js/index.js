// public/js/index.js

document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
  
    // 当有人按下“找找看”按钮，我们就去魔法书里找文章
    searchButton.addEventListener('click', () => {
      fetchArticles(searchInput.value);
    });
  
    fetchArticles(); // 初始化时加载所有文章

    async function fetchArticles(keyword = '') {
        const response = await fetch(`/api/articles?keyword=${encodeURIComponent(keyword)}`);
        const data = await response.json();
        displayArticles(data.articles);
        createPagination(data.currentPage, data.totalPages, data.pageSize);
    }


  
    function displayArticles(articles) {
      const articleList = document.getElementById('article-list');
      articleList.innerHTML = ''; // 清空旧的文章列表

      articles.forEach(article => {
          const link = document.createElement('a');
          link.href = `/html/article.html?name=${encodeURIComponent(article.name.replace('.md', ''))}`;
          link.textContent = article.title || article.name.replace('.md', '');
          articleList.appendChild(link);
          articleList.appendChild(document.createElement('br'));
      });
  }
  
    // 创建分页的函数
    function createPagination(currentPage, totalPages, pageSize) {
      const pagination = document.getElementById('pagination');
      pagination.innerHTML = ''; // 清空旧的分页
  
      for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('button');
        button.textContent = i;
        button.onclick = () => {
          fetch(`/api/articles?page=${i}&pageSize=${pageSize}`)
            .then(response => response.json())
            .then(data => {
              displayArticles(data.articles);
            });
        };
  
        if (i === currentPage) {
          button.classList.add('active');
        }
  
        pagination.appendChild(button);
        pagination.appendChild(document.createTextNode(' ')); // 添加空格间隔
      }
    }
  });