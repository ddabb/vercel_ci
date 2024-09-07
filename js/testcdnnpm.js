import { leapyear, oddEven, CheckIdCard } from '60score-npm';

document.addEventListener('DOMContentLoaded', () => {
    const yearInput = document.getElementById('year-input');
    const leapYearResult = document.getElementById('leap-year-result');
    const numberInput = document.getElementById('number-input');
    const oddEvenResult = document.getElementById('odd-even-result');
    const idCardInput = document.getElementById('id-card-input');
    const idCardResult = document.getElementById('id-card-result');

    yearInput.addEventListener('input', () => {
        debugger
        const year = parseInt(yearInput.value, 10);
        if (!isNaN(year)) {
            leapYearResult.textContent = leapyear(year) ? 'Leap Year' : 'Not a Leap Year';
        } else {
            leapYearResult.textContent = '';
        }
    });

    numberInput.addEventListener('input', () => {
        debugger
        const number = parseInt(numberInput.value, 10);
        if (!isNaN(number)) {
            oddEvenResult.textContent = oddEven(number) ? 'Even' : 'Odd';
        } else {
            oddEvenResult.textContent = '';
        }
    });

    idCardInput.addEventListener('input', () => {
        const idCardNumber = idCardInput.value;
        if (idCardNumber.length === 18) {
            idCardResult.textContent = CheckIdCard(idCardNumber) ? 'Valid ID Card' : 'Invalid ID Card';
        } else {
            idCardResult.textContent = '';
        }
    });
});