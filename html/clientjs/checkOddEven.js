function checkOddEven() {
  const controller = new AbortController();
  const signal = controller.signal;

  // 清除之前的控制器，防止内存泄漏
  if (controller) {
    controller.abort();
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
    body: JSON.stringify({ body: numberInput.toString() }), // 将BigInt转换为字符串
    signal: signal,
  })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })
    .then(data => {
      updateUI(data, numberInput);
    })
    .catch(error => {
      if (event.name === "AbortError") {
        console.log("Fetch aborted");
      } else {
        console.error("Error:", error);
        updateUI({ message: "发生错误，请重试" }, numberInput);
      }
    });
}