// public/js/index.js

document.addEventListener('DOMContentLoaded', function () {


















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
  toggle: false
});

document.getElementById('toggleButton').addEventListener('click', function () {
  var chatArea = document.getElementById('chatArea');
  if (chatArea.classList.contains('show')) {
    chatArea.classList.remove('show');
  } else {
    chatArea.classList.add('show');
  }
});