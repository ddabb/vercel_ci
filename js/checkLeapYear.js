import { leapyear } from 'https://cdn.jsdelivr.net/npm/fishbb@latest/+esm';

let controller; // 控制器实例

document.addEventListener("DOMContentLoaded", function () {
  debugger; // 启用调试

  const yearInput = document.getElementById('yearInput');
  const resultElement = document.getElementById('result');

  // 监听输入框的值改变事件
  yearInput.addEventListener('input', () => checkLeapYear(yearInput.value));

  async function checkLeapYear(numberInput) {

    // 如果输入为空字符串或空内容，则不执行验证
    if (!numberInput || numberInput.trim() === '') {
      resultElement.textContent = '';
      resultElement.style.color = '';
      return;
    }

    console.log(`Checking if ${numberInput} is a leap year...`);

    // 如果之前有控制器实例，则先取消旧请求
    if (controller) {
      controller.abort(); // 取消旧 response
    }

    // 创建一个新的 AbortController 实例
    controller = new AbortController();
    const signal = controller.signal;

    try {
      const result = await leapyear(numberInput, { signal });
      console.log(`Result for ${numberInput}: ${result}`);

      if (result) {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 闰年`;
        resultElement.style.color = "blue";
      } else {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 平年`;
        resultElement.style.color = "green";
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Fetch operation aborted');
      } else {
        resultElement.textContent = ` ${error.message}`;
        resultElement.style.color = "red";
      }
    }
  }
});