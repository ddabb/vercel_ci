$(document).ready(function(){
    // 初始化Datepicker插件，并设置其格式和行为
    $('.date-input').datepicker({
        format: 'yyyy-mm-dd', // 设置日期格式为YYYY-MM-DD
        autoclose: true,      // 选择日期后自动关闭日期选择器
        todayHighlight: true  // 高亮显示今天
    });

    // 将当前日期设置为默认值
    $('.date-input').datepicker('setDate', new Date());

    // 定义更新日期差的函数
    function updateDateDifference() {
        const start = new Date($('#startDate').val());
        const end = new Date($('#endDate').val());
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
        
        $('#result').text(resultText);
    }

    // 当任一日期被更改时，自动调用updateDateDifference函数更新日期差
    $('.date-input').on('changeDate', updateDateDifference);
});