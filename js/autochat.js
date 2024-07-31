document.getElementById('sendButton').addEventListener('click', function() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        const chatOutput = document.getElementById('chatOutput');
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.innerHTML = `
            <div class="message-text">
                <p>${message}</p>
            </div>
            <div class="avatar bg-success rounded-circle"></div>
        `;
        chatOutput.appendChild(userMessageElement);

        messageInput.value = ''; // 清空输入框

        // 显示思考提示
        const thinkingMessage = document.createElement('div');
        thinkingMessage.className = 'message bot-message';
        thinkingMessage.innerHTML = `
            <div class="avatar bg-primary rounded-circle"></div>
            <div class="message-text">
                <p>机器人正在思考...</p>
            </div>
        `;
        chatOutput.appendChild(thinkingMessage);

        // 发送请求到API
        fetch('/api/aichat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.text())
        .then(data => {
            // 移除思考提示
            chatOutput.removeChild(thinkingMessage);

            const botMessageElement = document.createElement('div');
            botMessageElement.className = 'message bot-message';
            botMessageElement.innerHTML = `
                <div class="avatar bg-primary rounded-circle"></div>
                <div class="message-text">
                    <p>${data}</p>
                </div>
            `;
            chatOutput.appendChild(botMessageElement);
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
});

// 为输入框添加键盘事件监听器
document.getElementById('messageInput').addEventListener('keyup', function(event) {
    if (event.key === 'Enter') {
        // 模拟点击发送按钮
        document.getElementById('sendButton').click();
    }
});