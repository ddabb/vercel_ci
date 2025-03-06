

document.addEventListener('DOMContentLoaded', function () {
  const searchInputMD = document.getElementById('search-input-md');
  const searchButtonMD = document.getElementById('search-button-md');

  // 监听输入框的 keydown 事件
  searchInputMD.addEventListener('keydown', function (event) {
    // 检查是否按下了回车键
    if (event.key === 'Enter' || event.keyCode === 13) {
      // 执行与点击 "找找看" 按钮相同的操作
      searchButton.click();
    }
  });

  // 网站文章的处理
  searchButtonMD.addEventListener('click', () => {
    fetchArticlesMD(searchInputMD.value);
  });
  fetchArticlesMD(); // 初始化时加载所有文章

  async function fetchArticlesMD(keyword = '') {
    const response = await fetch(`/api/getjson?calltype=md&pageSize=12&keyword=${encodeURIComponent(keyword)}`);
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
  
    // 显示的最大页码数
    const maxDisplayedPages = 7; // 建议为奇数以便于中心对齐
  
    let startPage = Math.max(1, currentPage - Math.floor(maxDisplayedPages / 2));
    let endPage = Math.min(totalPages, startPage + maxDisplayedPages - 1);
  
    // 调整startPage以确保我们总是显示maxDisplayedPages个按钮（除非接近总页数）
    if (endPage - startPage < maxDisplayedPages - 1) {
      startPage = Math.max(1, endPage - maxDisplayedPages + 1);
    }
  
    // 首页按钮
    if (currentPage > 1) {
      addButton(pagination, 1, '首页', () => fetchAndDisplayArticles(1, pageSize));
    }
  
    // 上一页按钮
    if (currentPage > 1) {
      addButton(pagination, currentPage - 1, '上一页', () => fetchAndDisplayArticles(currentPage - 1, pageSize));
    }
  
    // 如果startPage不是1，则添加...
    if (startPage > 1) {
      addButton(pagination, null, '...');
    }
  
    for (let i = startPage; i <= endPage; i++) {
      addButton(pagination, i, i.toString(), () => fetchAndDisplayArticles(i, pageSize), i === currentPage);
    }
  
    // 如果endPage不是totalPages，则添加...
    if (endPage < totalPages) {
      addButton(pagination, null, '...');
    }
  
    // 下一页按钮
    if (currentPage < totalPages) {
      addButton(pagination, currentPage + 1, '下一页', () => fetchAndDisplayArticles(currentPage + 1, pageSize));
    }
  
    // 末页按钮
    if (currentPage < totalPages) {
      addButton(pagination, totalPages, '末页', () => fetchAndDisplayArticles(totalPages, pageSize));
    }
  }
  
  function addButton(container, pageNumber, textContent, clickHandler, isActive = false) {
    const button = document.createElement('button');
    button.textContent = textContent;
    if (pageNumber !== null) {
      button.onclick = clickHandler;
    }
    if (isActive) {
      button.classList.add('active');
    }
    container.appendChild(button);
    container.appendChild(document.createTextNode(' ')); // 添加空格间隔
  }
  
  // 确保在点击分页按钮时正确获取并展示文章
  function fetchAndDisplayArticles(page, pageSize) {
    fetch(`/api/getjson?calltype=md&page=${page}&pageSize=${encodeURIComponent(pageSize)}`)
      .then(response => response.json())
      .then(data => {
        displayArticlesMD(data.articles);
        createPaginationMD(page, data.totalPages, data.pageSize); // 更新分页控件
      });
  }
});





