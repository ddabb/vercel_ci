let controller; // 声明在函数作用域外，以便可以被清除

function checkLeapYear() {
  // 创建一个新的 AbortController 实例，用于控制 fetch 请求
  controller = new AbortController();
  const signal = controller.signal;

  // 清除之前的控制器，防止内存泄漏
  if (controller && controller !== controller) { // 检查是否已经存在旧控制器
    controller.abort(); // 取消旧请求
  }

  const numberInput = document.getElementById("numberInput").value;

  // 使用正则表达式验证输入是否为正整数
  if (!/^\d+$/.test(numberInput)) {
    updateUI({ message: "请输入一个正整数" }, numberInput);
    return;
  }

  fetch("/api/leapyear", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: numberInput }), // 假设 numberInput 是一个字符串
    signal: signal,
  })
    .then(response => {
      if (!response.ok) {
        // 尝试获取更多的错误详情
        return response.text().then(text => {
          throw new Error(`HTTP error! status: ${response.status}, message: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      updateUI(data, numberInput); // 传递 numberInput 给 updateUI
    })
    .catch(error => {
      if (error.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error:", error.message); // 输出具体的错误信息
        updateUI({ message: error.message }, numberInput); // 传递具体的错误信息给 updateUI
      }
    });
}

function updateUI(data, numberInput) {
  const resultElement = document.getElementById("result");
  if (data.message === "闰年" || data.message === "平年") {
    resultElement.textContent = `你输入的 ${numberInput} 是一个 ${data.message}`;
    resultElement.style.color = data.message === "闰年" ? "blue" : "green";

  }
  else {
    resultElement.textContent = data.message;
    resultElement.style.color = "red";
  }


}