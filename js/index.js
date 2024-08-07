// public/js/index.js

document.addEventListener('DOMContentLoaded', function () {
  const searchInputMD = document.getElementById('search-input-md');
  const searchButtonMD = document.getElementById('search-button-md');
  const searchInputWeixin = document.getElementById('search-input-weixin');
  const searchButtonWeixin = document.getElementById('search-button-weixin');

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


  function displayArticlesMD(articles) {
    const articleList = document.getElementById('article-list-md');
    articleList.innerHTML = ''; // 清空旧的文章列表

    articles.forEach(article => {
      const link = document.createElement('a');
      link.href = `/html/article.html?name=${encodeURIComponent(article.name.replace('.md', ''))}`;
      link.textContent = article.title || article.name.replace('.md', '');
      articleList.appendChild(link);
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



function createTimelineElement(event) {
  const eventDiv = document.createElement('div');
  eventDiv.className = `timeline-event timeline-${event.side}`;
  eventDiv.innerHTML = `
    <div class="timeline-point"></div>
    <div class="timeline-content">
      <h4 class="timeline-title">${event.title}</h4>
      <p class="timeline-date">${event.date}</p>
    </div>
  `;
  return eventDiv;
}
async function fetchAndRenderTimeline() {
  try {
    const response = await fetch('/jsons/timeline.json'); // 使用相对路径
    if (!response.ok) {
      throw new Error(`Failed to fetch timeline data: ${response.status}`);
    }
    const events = await response.json();
    // 对事件按日期降序排序
    events.sort((a, b) => new Date(b.date) - new Date(a.date));

    const timelineContainer = document.getElementById("timeline");
    timelineContainer.innerHTML = ""; // 清空现有内容
    events.forEach(event => {
      const element = createTimelineElement(event);
      timelineContainer.appendChild(element);
    });
  } catch (error) {
    console.error('Error fetching or rendering timeline:', error);
  }
}

// 初始化时间线
fetchAndRenderTimeline();

// 控制时间线的折叠
const timelineToggle = new bootstrap.Collapse('#timeline', {
  toggle: true
});

document.getElementById('toggleButton').addEventListener('click', function () {
  var chatArea = document.getElementById('chatArea');
  if (chatArea.classList.contains('show')) {
    chatArea.classList.remove('show');
  } else {
    chatArea.classList.add('show');
  }
});