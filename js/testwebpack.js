// testpack.js
import { leapyear, oddEven, CheckIdCard } from 'https://cdn.jsdelivr.net/gh/ddabb/mathlogic@1.1/dist/mathlogic.browser.esm.js';

document.addEventListener("DOMContentLoaded", function () {
    // 测试 leapyear 方法
    const year = 2024;
    leapyear(year).then(result => {
        console.log(`${year} is a leap year: ${result}`);
    }).catch(error => {
        console.error(`Error checking leap year: ${error.message}`);
    });

    // 测试 oddEven 方法
    const number = 13;
    oddEven(number).then(result => {
        console.log(`${number} is even: ${result}`);
    }).catch(error => {
        console.error(`Error checking odd/even: ${error.message}`);
    });

    // 测试 IdCard 方法
    const idNumber = '123456789012345678';
    CheckIdCard(idNumber).then(result => {
        console.log(`ID Card Info:`, result);
    }).catch(error => {
        console.error(`Error checking ID Card: ${error.message}`);
    });
});