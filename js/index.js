// public/js/index.js

document.addEventListener('DOMContentLoaded', function () {
  const searchInput = document.getElementById('search-input');
  const searchButton = document.getElementById('search-button');

  // 当有人按下“找找看”按钮，我们就去魔法书里找文章
  searchButton.addEventListener('click', () => {
    fetchArticles(searchInput.value);
  });

  fetchArticles(); // 初始化时加载所有文章

  async function fetchArticles(keyword = '') {
    const response = await fetch(`/api/articles?calltype=md&keyword=${encodeURIComponent(keyword)}`);
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
      // articleList.appendChild(document.createElement('br'));
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
        fetch(`/api/articles?calltype=md&page=${i}&pageSize=${pageSize}`)
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