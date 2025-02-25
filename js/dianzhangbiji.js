

document.addEventListener('DOMContentLoaded', function () {
  const searchInputMD = document.getElementById('search-input-md');
  const searchButtonMD = document.getElementById('search-button-md');


  // 网站文章的处理
  searchButtonMD.addEventListener('click', () => {
    fetchArticlesMD(searchInputMD.value);
  });
  fetchArticlesMD(); // 初始化时加载所有文章

  async function fetchArticlesMD(keyword = '') {
    const response = await fetch(`/api/articles?calltype=md&keyword=${encodeURIComponent(keyword)}`);
    const data = await response.json();
    displayArticlesMD(data.articles);
    createPaginationMD(data.currentPage, data.totalPages, data.pageSize);
  }

  // function displayArticlesMD(articles) {
  //   const articleList = document.getElementById('article-list-md');
  //   articleList.innerHTML = ''; // 清空旧的文章列表

  //   articles.forEach(article => {
  //     // 使用encodeURIComponent对文章名称进行编码
  //     const encodedArticleName = encodeURIComponent(article.name.replace('.md', '.html'));
  //     const link = document.createElement('a');
  //     // 构建直接指向mdhtml文件夹中HTML文件的链接
  //     link.href = `/mdhtml/${encodedArticleName}`;
  //     link.textContent = article.title || article.name.replace('.md', '');
  //     articleList.appendChild(link);
  //   });
  // }

  function displayArticlesMD(articles) {
    const articleList = document.getElementById('article-list-md');
    articleList.innerHTML = ''; // 清空旧的文章列表
  
    articles.forEach(article => {
      const encodedArticleName = encodeURIComponent(article.name.replace('.md', '.html'));
      
      const container = document.createElement('div'); // 创建一个容器
      
      const categoryText = document.createElement('span'); // 类别文本元素
      categoryText.textContent = article.category;
      categoryText.style.cursor = 'pointer'; // 改变鼠标指针形状，暗示可点击性
      categoryText.onclick = () => {
        window.location.href = `../category/${encodeURIComponent(article.category)}.html`;
      };
      
      const link = document.createElement('a');
      link.href = `/mdhtml/${encodedArticleName}`;
      link.textContent = article.title || article.name.replace('.md', '');
      
      container.appendChild(categoryText);
      container.appendChild(link);
  
      articleList.appendChild(container);
    });
  }

  // 创建分页的函数
  function createPaginationMD(currentPage, totalPages, pageSize) {
    const pagination = document.getElementById('pagination-md');
    pagination.innerHTML = ''; // 清空旧的分页

    for (let i = 1; i <= totalPages; i++) {
      const button = document.createElement('button');
      button.textContent = i;
      button.onclick = () => {
        fetch(`/api/articles?calltype=md&page=${i}&pageSize=${pageSize}`)
          .then(response => response.json())
          .then(data => {
            displayArticlesMD(data.articles);
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





