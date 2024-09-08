import { CheckIdCard } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.1/+esm';

let controller; // 控制器实例

document.addEventListener("DOMContentLoaded", function () {
    const idCardInput = document.getElementById('idCardInput');
    const resultElement = document.getElementById('result');

    // 监听输入框的值改变事件
    idCardInput.addEventListener('input', () => CheckShenfen(idCardInput.value));

    function CheckShenfen(numberInput) {
        // 如果输入为空字符串或空内容，则不执行验证
        if (!numberInput || numberInput.trim() === '') {
            resultElement.textContent = '';
            resultElement.style.color = '';
            return;
        }

        console.log(`Checking if ${numberInput} is a leap year...`);

        // 如果之前有控制器实例，则先取消旧请求
        if (controller) {
            controller.abort(); // 取消旧请求
        }

        // 创建一个新的 AbortController 实例
        controller = new AbortController();
        const signal = controller.signal;

        CheckIdCard(numberInput, { signal }).then(result => {
            console.log(`Result for ${numberInput}: ${result}`);
            let message = result;
            try {
                // 尝试解析 message 为 JSON 对象
                message = JSON.parse(result);
            } catch (e) {
                // 如果解析失败，则 message 保持为字符串
            }

            if (typeof message === 'object' && message !== null) {
                // 假设 message 是一个对象
                let output = `你输入的 ${numberInput} 的验证结果是：\n`;
                output += `类型：${message.type}\n`;
                output += `签发地点：${message.sign}\n`;
                output += `国家：${message.country}\n`;
                output += `生日：${message.birthday}\n`;
                output += `性别：${message.sex}\n`;
                output += `验证状态：${message.isValid ? '有效' : '无效'}`;

                // 使用 <pre> 标签确保文本按行显示且靠左对齐
                resultElement.innerHTML = `<pre>${output}</pre>`;
                resultElement.style.color = message.isValid ? "green" : "red";
            } else {
                // 如果 message 不是一个对象，显示原始的 message
                resultElement.textContent = message;
                resultElement.style.color = "red";
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



// let controller; // 声明在全局作用域中，以便可以被清除

// function checkIdCard() {
//     // 创建一个新的 AbortController 实例，用于控制 fetch 请求
//     if (controller) {
//         controller.abort(); // 取消旧请求
//     }
//     controller = new AbortController();
//     const signal = controller.signal;

//     const idCardInput = document.getElementById("idCardInput").value;

//     // 使用正则表达式验证输入是否符合身份证格式
//     if (!/^(?:[0-9]{18}|[JZ][0-9]{16}[0-9Xx])$/i.test(idCardInput)) {
//         updateUI({ message: "请输入一个有效的身份证号码" }, idCardInput);
//         return;
//     }

//     // 如果输入符合身份证格式，继续执行
//     fetch("/api/mathlogic", {
//         method: "POST",
//         headers: {
//             "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ callType: "IdCard", number: idCardInput.toUpperCase() }),
//         signal: signal,
//     })
//         .then(response => {
//             if (!response.ok) {
//                 throw new Error(`HTTP error! status: ${response.status}`);
//             }
//             return response.json();
//         })
//         .then(data => {
//             updateUI(data, idCardInput);
//         })
//         .catch(error => {
//             if (error.name === "AbortError") {
//                 console.log("Fetch aborted");
//             } else {
//                 console.error("Error:", error);
//                 updateUI({ message: "发生错误，请重试" }, idCardInput);
//             }
//         });
// }

// function updateUI(data, idCardInput) {
//     const resultElement = document.getElementById("result");
//     let message = data.message;

//     try {
//         // 尝试解析 message 为 JSON 对象
//         message = JSON.parse(message);
//     } catch (e) {
//         // 如果解析失败，则 message 保持为字符串
//     }

//     if (typeof message === 'object' && message !== null) {
//         // 假设 message 是一个对象
//         let output = `你输入的 ${idCardInput} 的验证结果是：\n`;
//         output += `类型：${message.type}\n`;
//         output += `签发地点：${message.sign}\n`;
//         output += `国家：${message.country}\n`;
//         output += `生日：${message.birthday}\n`;
//         output += `性别：${message.sex}\n`;
//         output += `验证状态：${message.isValid ? '有效' : '无效'}`;

//         // 使用 <pre> 标签确保文本按行显示且靠左对齐
//         resultElement.innerHTML = `<pre>${output}</pre>`;
//         resultElement.style.color = message.isValid ? "green" : "red";
//     } else {
//         // 如果 message 不是一个对象，显示原始的 message
//         resultElement.textContent = message;
//         resultElement.style.color = "red";
//     }
// }