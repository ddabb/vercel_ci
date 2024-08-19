document.addEventListener('DOMContentLoaded', function() {
    // 设置输入框的默认值为当前日期
    const today = new Date();
    const todayString = today.toISOString().substring(0, 10); // 获取格式化的日期字符串
    document.getElementById('startDate').value = todayString;
    document.getElementById('endDate').value = todayString;

    // 定义更新日期差的函数
    function updateDateDifference() {
        const start = new Date(document.getElementById('startDate').value);
        const end = new Date(document.getElementById('endDate').value);
        const diff = end - start;
        const days = Math.ceil(diff / (1000 * 60 * 60 * 24));

        // 使用Intl.DateTimeFormat API来格式化日期，以适应用户的地区设置
        const formattedStart = new Intl.DateTimeFormat('default', {year: 'numeric', month: 'long', day: 'numeric'}).format(start);
        const formattedEnd = new Intl.DateTimeFormat('default', {year: 'numeric', month: 'long', day: 'numeric'}).format(end);

        // 构建结果显示文本，包含具体日期
        let resultText;
        if (diff >= 0) {
            resultText = `从 ${formattedStart} 到 ${formattedEnd} 共有 ${days} 天。`;
        } else {
            resultText = `从 ${formattedEnd} 回溯到 ${formattedStart} 需要 ${Math.abs(days)} 天。`;
        }

        document.getElementById('result').textContent = resultText;
    }

    // 监听输入框的变化并自动更新日期差
    document.getElementById('startDate').addEventListener('change', updateDateDifference);
    document.getElementById('endDate').addEventListener('change', updateDateDifference);

    // 调用一次函数以初始化结果展示
    updateDateDifference();
});