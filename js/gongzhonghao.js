
document.addEventListener('DOMContentLoaded', function () {

  const searchInputWeixin = document.getElementById('search-input-weixin');
  const searchButtonWeixin = document.getElementById('search-button-weixin');

  // 公众号文章的处理
  searchButtonWeixin.addEventListener('click', () => {
    fetchArticlesWeixin(searchInputWeixin.value);
  });
  fetchArticlesWeixin(); // 初始化时加载所有文章

  async function fetchArticlesWeixin(keyword = '') {
    const response = await fetch(`/api/articles?calltype=weixin&keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    displayArticlesWeixin(data.articles);
    createPaginationWeixin(data.currentPage, data.totalPages, data.pageSize);
  }

  function displayArticlesWeixin(articles) {
    const articleList = document.getElementById('article-list-weixin');
    articleList.innerHTML = ''; // 清空旧的文章列表

    articles.forEach(article => {
      const link = document.createElement('a');
      link.href = article.url;
      link.textContent = article.title;
      link.target = "_blank";
      articleList.appendChild(link);
    });
  }

  function createPaginationWeixin(currentPage, totalPages, pageSize) {
    const pagination = document.getElementById('pagination-weixin');
    pagination.innerHTML = ''; // 清空旧的分页

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.onclick = () => {
        fetch(`/api/articles?calltype=weixin&page=${i}&pageSize=${pageSize}`)
          .then(response => response.json())
          .then(data => {
            displayArticlesWeixin(data.articles);
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








