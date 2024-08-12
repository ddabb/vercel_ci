let controller; // 声明在全局作用域中，以便可以被清除

function checkIdCard() {
    // 创建一个新的 AbortController 实例，用于控制 fetch 请求
    if (controller) {
        controller.abort(); // 取消旧请求
    }
    controller = new AbortController();
    const signal = controller.signal;

    const idCardInput = document.getElementById("idCardInput").value;

    // 使用正则表达式验证输入是否符合身份证格式
    if (!/^(?:[0-9]{18}|[JZ][0-9]{16}[0-9Xx])$/i.test(idCardInput)) {
        updateUI({ message: "请输入一个有效的身份证号码" }, idCardInput);
        return;
    }

    // 如果输入符合身份证格式，继续执行
    fetch("/api/mathlogic", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ callType: "IdCard", number: idCardInput.toUpperCase() }),
        signal: signal,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            updateUI(data, idCardInput);
        })
        .catch(error => {
            if (error.name === "AbortError") {
                console.log("Fetch aborted");
            } else {
                console.error("Error:", error);
                updateUI({ message: "发生错误，请重试" }, idCardInput);
            }
        });
}

function updateUI(data, idCardInput) {
    const resultElement = document.getElementById("result");
    if (data.message && typeof data.message === 'object') {
        // 假设 data.message 是一个对象
        resultElement.textContent = `你输入的 ${idCardInput} 的验证结果是：\n`;
        resultElement.textContent += `类型：${data.message.type}\n`;
        resultElement.textContent += `签发地点：${data.message.sign}\n`;
        resultElement.textContent += `国家：${data.message.country}\n`;
        resultElement.textContent += `生日：${data.message.birthday}\n`;
        resultElement.textContent += `性别：${data.message.sex}\n`;
        resultElement.textContent += `验证状态：${data.message.isValid ? '有效' : '无效'}`;
        result湖Element.style.color = data.message.isValid ? "green" : "red";
    } else {
        resultElement.textContent = data.message;
        resultElement.style.color = "red";
    }
}