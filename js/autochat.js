import { chat } from 'https://cdn.jsdelivr.net/npm/fishbb@latest/+esm';
document.getElementById('sendButton').addEventListener('click', async function () {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();

    if (message) {
        const chatOutput = document.getElementById('chatOutput');
        const userMessageElement = document.createElement('div');
        userMessageElement.className = 'message user-message';
        userMessageElement.innerHTML = `
        <div class="message-container">
          <div class="message-text">
            <p>${message}</p>
          </div>
          <div class="avatar-container">
            <img src="/user.png" alt="User Avatar" class="avatar bg-success rounded-circle">
          </div>
        </div>
      `;
        chatOutput.appendChild(userMessageElement);
        adjustChatContainerHeight();

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
        adjustChatContainerHeight();
        const result = await chat('hfr0hjaEDPYL', 'rodneyxiong', message);
        // 移除思考提示
        chatOutput.removeChild(thinkingMessage);
        const botMessageElement = document.createElement('div');
        botMessageElement.className = 'message bot-message';
        botMessageElement.innerHTML = `
                <div class="avatar bg-primary rounded-circle"></div>
                <div class="message-text">
                    <p>${result}</p>
                </div>
            `;
        chatOutput.appendChild(botMessageElement);
        adjustChatContainerHeight();

    }

});

// 为输入框添加键盘事件监听器
document.getElementById('messageInput').addEventListener('keyup', function (event) {
    if (event.key === 'Enter') {
        // 模拟点击发送按钮
        document.getElementById('sendButton').click();
    }
});

const toggleButton = document.getElementById('toggleChatArea');
if (toggleButton) {
    toggleButton.addEventListener('click', toggleChatArea);
} else {
    console.error('Element with ID "toggleChatArea" not found.');
}


function adjustChatContainerHeight() {
    debugger
    const chatContainer = document.querySelector('.chat-container');
    if (chatContainer) {
        chatContainer.style.height = 'auto'; // 重置高度为自动
        const newHeight = chatContainer.scrollHeight; // 获取新的实际高度
        console.log("newHeight" + newHeight);
        chatContainer.style.height = newHeight + 'px'; // 设置新的高度
    } else {
        console.error('Element with class "chat-container" not found.');
    }

}

function toggleChatArea() {
    debugger
    const chatAreaContainer = document.getElementById('chatAreaContainer');
    if (chatAreaContainer) {
        if (chatAreaContainer.style.display === 'none') {
            chatAreaContainer.style.display = 'block';
        } else {
            chatAreaContainer.style.display = 'none';
        }
    } else {
        console.error('Element with ID "chatAreaContainer" not found.');
    }
}