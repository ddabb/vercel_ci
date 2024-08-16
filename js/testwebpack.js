import { leapyear, oddEven, CheckIdCard } from 'https://cdn.jsdelivr.net/gh/ddabb/mathlogic@1.1/dist/mathlogic.browser.esm.js';

document.addEventListener("DOMContentLoaded", function () {
    const leapYearResultElement = document.getElementById('leap-year-result');
    const oddEvenResultElement = document.getElementById('odd-even-result');
    const idCardResultElement = document.getElementById('id-card-result');

    const yearInput = document.getElementById('year-input');
    const numberInput = document.getElementById('number-input');
    const idCardInput = document.getElementById('id-card-input');

    // 监听输入框的值改变事件
    yearInput.addEventListener('input', () => checkLeapYear(yearInput.value));
    numberInput.addEventListener('input', () => checkOddEven(numberInput.value));
    idCardInput.addEventListener('input', () => checkIdCard(idCardInput.value));

    function checkLeapYear(year) {
        leapyear(year).then(result => {
            leapYearResultElement.textContent = `${year} is a leap year: ${result}`;
        }).catch(error => {
            leapYearResultElement.textContent = `Error checking leap year: ${error.message}`;
        });
    }

    function checkOddEven(number) {
        oddEven(number).then(result => {
            oddEvenResultElement.textContent = `${number} is even: ${result}`;
        }).catch(error => {
            oddEvenResultElement.textContent = `Error checking odd/even: ${error.message}`;
        });
    }

    function checkIdCard(idNumber) {
        CheckIdCard(idNumber).then(result => {
            idCardResultElement.textContent = `ID Card Info: ${JSON.stringify(result)}`;
        }).catch(error => {
            idCardResultElement.textContent = `Error checking ID Card: ${error.message}`;
        });
    }
});