import { oddEven } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.1/+esm';

let controller; // 控制器实例

document.addEventListener("DOMContentLoaded", function () {
  const yearInput = document.getElementById('numberInput');
  const resultElement = document.getElementById('result');

  // 监听输入框的值改变事件
  yearInput.addEventListener('input', () => checkOddEven(yearInput.value));

  function checkOddEven(numberInput) {
    // 如果输入为空字符串或空内容，则不执行验证
    if (!numberInput || numberInput.trim() === '') {
      resultElement.textContent = '';
      resultElement.style.color = '';
      return;
    }
    console.log(`Checking if ${numberInput} 是奇数还是偶数...`);

    // 如果之前有控制器实例，则先取消旧请求
    if (controller) {
      controller.abort(); // 取消旧请求
    }

    // 创建一个新的 AbortController 实例
    controller = new AbortController();
    const signal = controller.signal;

    oddEven(numberInput, { signal }).then(result => {
      console.log(`Result for ${numberInput}: ${result}`);

      if (result) {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 偶数`;
        resultElement.style.color = "green";
      } else {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 奇数`;
        resultElement.style.color = "blue";
      }
    }).catch(error => {
      if (error.name === 'AbortError') {
        console.log('Fetch operation aborted');
      } else {
        resultElement.textContent = ` ${error.message}`;
        resultElement.style.color = "red";
      }
    });
  }
});



