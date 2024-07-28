let controller = new AbortController();
let signal = controller.signal;

function checkOddEven() {
  // 清除之前的控制器，防止内存泄漏
  if (controller) {
    controller.abort();
  }

  controller = new AbortController();
  signal = controller.signal;

  const numberInput = document.getElementById("numberInput").value;
  const number = parseInt(numberInput, 10);

  if (isNaN(number)) {
    updateUI({ message: "请输入一个有效的整数" }, numberInput);
    return;
  }

  fetch("/api/oddEven", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ number }),
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
    if (error.name === "AbortError") {
      console.log("Fetch aborted");
    } else {
      console.error("Error:", error);
      updateUI({ message: "发生错误，请重试" }, numberInput);
    }
  });
}

function updateUI(data, numberInput) {
  const resultElement = document.getElementById("result");
  if (data.message === "奇数" || data.message === "偶数") {
    resultElement.textContent = `你输入的 ${numberInput} 是一个 ${data.message}`;
    resultElement.style.setProperty('color', data.message === "奇数"? "blue" : "green");
  } else {
    resultElement.textContent = data.message;
    resultElement.style.setProperty('color', "red");
  }
 
}