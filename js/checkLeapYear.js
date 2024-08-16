import { leapyear } from 'https://cdn.jsdelivr.net/gh/ddabb/mathlogic@1.1/dist/mathlogic.browser.esm.js';
let controller; // 声明在函数作用域外，以便可以被清除

document.addEventListener("DOMContentLoaded", function () {
  const yearInput = document.getElementById('yearInput');
  const resultElement = document.getElementById('result');

  // 监听输入框的值改变事件
  yearInput.addEventListener('input', () => checkLeapYear(yearInput.value));

  function checkLeapYear(numberInput) {
    console.log(`Checking if ${numberInput} is a leap year...`);

    // 创建一个新的 AbortController 实见，用于控制 fetch 请求
    controller = new AbortController();
    const signal = controller.signal;

    // 清除之前的控制器，防止内存泄漏
    if (controller.signal) {
      controller.abort(); // 取消旧请求
    }

    leapyear(numberInput, { signal }).then(result => {
      console.log(`Result for ${numberInput}: ${result}`);

      if (result) {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 闰年`;
        resultElement.style.color = "blue";
      } else {
        resultElement.textContent = `你输入的 ${numberInput} 是一个 平年`;
        resultElement.style.color = "green";
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