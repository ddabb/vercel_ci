document.addEventListener('DOMContentLoaded', function () {
  const urlParams = new URLSearchParams(window.location.search);
  const encodedArticleName = urlParams.get('name'); // 假设 articleName 是 URL 编码的

  const decodedArticleName = decodeURIComponent(encodedArticleName);

  const jsonData = { name: decodedArticleName };

  fetch('/api/wenzhang', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(jsonData)
  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then(data => {
      console.log(data);
      document.querySelector('title').textContent = data.title; // 更新 <title> 标签
      document.getElementById('article-title').textContent = data.title; // 新增：更新文章标题
      document.getElementById('article-content').innerHTML = data.content;
    })
    .catch(error => {
      console.error('Error fetching article:', error);
    });
});