// 获取DOM元素
const markdownInput = document.getElementById('markdown-input');
const preview = document.getElementById('preview');
const copyButton = document.getElementById('copy-button');

// Markdown转换函数
function convertToHTML(md) {
    let html = md;

    // Headers
    html = html.replace(/^### (.*$)/gm, '<h3>$1</h3>');
    html = html.replace(/^## (.*$)/gm, '<h2>$1</h2>');
    html = html.replace(/^# (.*$)/gm, '<h1>$1</h1>');

    // Bold
    html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    html = html.replace(/__(.*?)__/g, '<strong>$1</strong>');

    // Italic
    html = html.replace(/\*(.*?)\*/g, '<em>$1</em>');
    html = html.replace(/_(.*?)_/g, '<em>$1</em>');

    // Lists
    html = html.replace(/^\s*\d+\.\s+(.*)$/gm, '<ol><li>$1</li></ol>');
    html = html.replace(/^\s*[\-\*]\s+(.*)$/gm, '<ul><li>$1</li></ul>');

    // Links
    html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');

    // Code blocks
    html = html.replace(/```([\s\S]*?)```/g, '<pre><code>$1</code></pre>');

    // Inline code
    html = html.replace(/`([^`]+)`/g, '<code>$1</code>');

    // Paragraphs
    html = html.replace(/\n\n([^<].*)/g, '<p>$1</p>');

    return html;
}

// 实时预览
markdownInput.addEventListener('input', function() {
    preview.innerHTML = convertToHTML(this.value);
});

// 复制富文本
copyButton.addEventListener('click', function() {
    const htmlContent = preview.innerHTML;

    // 创建一个临时容器来保存HTML内容
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // 使用Clipboard API复制富文本
    try {
        const clipboardData = new DataTransfer();
        clipboardData.setData('text/html', htmlContent);
        clipboardData.setData('text/plain', tempDiv.textContent);

        navigator.clipboard.write([
            new ClipboardItem({
                'text/html': new Blob([htmlContent], { type: 'text/html' }),
                'text/plain': new Blob([tempDiv.textContent], { type: 'text/plain' })
            })
        ]).then(() => {
            alert('富文本已复制到剪贴板！');
        }).catch(err => {
            console.error('复制失败:', err);
            fallbackCopy(tempDiv.textContent);
        });
    } catch (err) {
        console.error('复制失败:', err);
        fallbackCopy(tempDiv.textContent);
    }
});

// 降级复制方案
function fallbackCopy(text) {
    const textarea = document.createElement('textarea');
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    try {
        document.execCommand('copy');
        alert('内容已复制到剪贴板（纯文本格式）');
    } catch (err) {
        console.error('复制失败:', err);
        alert('复制失败，请手动复制');
    }
    document.body.removeChild(textarea);
}