import { calculateRetirement } from 'https://cdn.jsdelivr.net/npm/fishbb@1.0.14/+esm';

document.getElementById('submit').addEventListener('click', function () {
    var year = document.getElementById('year').value;
    var month = document.getElementById('month').value;
    var type = document.getElementById('type').value;

    try {
        const { result, result_time, result_month } = calculateRetirement(year, month, type);
        document.getElementById('result').textContent = result;
        document.getElementById('result_time').textContent = result_time;
        document.getElementById('result_month').textContent = result_month;
    } catch (error) {
        alert(error.message);
    }
});

document.getElementById('reset').addEventListener('click', function () {
    document.getElementById('year').value = "";
    document.getElementById('month').value = "";
    document.getElementById('type').value = "";
    document.getElementById('result').textContent = "";
    document.getElementById('result_time').textContent = "";
    document.getElementById('result_month').textContent = "";
});