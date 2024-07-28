// 定义一个函数来发送请求并处理响应
async function checkOddEven() {
    // 获取用户输入的数字
    const numberInput = document.getElementById('numberInput').value;
    try {
      // 发送POST请求到服务器端点
      const response = await fetch('/api/oddEven', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ body: parseInt(numberInput, 10) })
      });
  
      // 解析响应
      const data = await response.json();
  
      // 更新页面上的内容
      document.getElementById('result').textContent = data.message;
    } catch (error) {
      console.error('Error:', error);
      document.getElementById('result').innerHTML = '发生错误，请重试';
    }
  }