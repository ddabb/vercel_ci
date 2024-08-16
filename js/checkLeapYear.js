import { leapyear } from '<script src="https://cdn.jsdelivr.net/gh/ddabb/60score@latest/dist/60score.browser.esm.js"></script>';

let controller; // 控制器实例

document.addEventListener("DOMContentLoaded", function () {
  const yearInput = document.getElementById('yearInput');
  const resultElement = document.getElementById('result');

  // 监听输入框的值改变事件
  yearInput.addEventListener('input', () => checkLeapYear(yearInput.value));

  function checkLeapYear(numberInput) {
    console.log(`Checking if ${numberInput} is a leap year...`);

    // 如果之前有控制器实例，则先取消旧请求
    if (controller) {
      controller.abort(); // 取消旧请求
    }

    // 创建一个新的 AbortController 实例
    controller = new AbortController();
    const signal = controller.signal;

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