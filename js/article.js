document.addEventListener('DOMContentLoaded', function() {
    debugger;
    const urlParams = new URLSearchParams(window.location.search);
    const encodedArticleName = urlParams.get('name'); // 假设 articleName 是 URL 编码的
  
    // 解码 articleName
    const decodedArticleName = decodeURIComponent(encodedArticleName);
  
    // 创建一个包含中文名称的 JSON 对象
    const jsonData = { name: decodedArticleName };
  
    // 发送 POST 请求，将 JSON 对象转换为字符串，并设置请求头
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
      document.getElementById('article-title').textContent = data.title;
      document.getElementById('article-content').innerHTML = data.content;
    })
    .catch(error => {
      console.error('Error fetching article:', error);
    });
  });