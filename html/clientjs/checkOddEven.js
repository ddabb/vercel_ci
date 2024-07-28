let controller; // 声明在函数作用域外，以便可以被清除

function checkOddEven() {
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

  // 如果输入是正整数，继续执行
  fetch("/api/oddEven", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number: parseInt(numberInput, 10) }), // 将数字作为整数发送
    signal: signal,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
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
        console.error("Error:", error);
        updateUI({ message: "发生错误，请重试" }, numberInput); // 传递 numberInput 给 updateUI
      }
    });
}

function updateUI(data, numberInput) {
  const resultElement = document.getElementById("result");
  resultElement.textContent = `你输入的 ${numberInput} 是一个 ${data.message}`;
  resultElement.style.color = data.message === "奇数" ? "blue" : "green";
}