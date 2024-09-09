// script.js
import { chat } from 'https://cdn.jsdelivr.net/npm/fishbb@latest/+esm';
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('query-form');
    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const input = document.getElementById('query-input');
        const responseDiv = document.getElementById('response');

        try {
            const result = await chat('hfr0hjaEDPYL', 'rodneyxiong', input.value);
            responseDiv.innerHTML = `<p>${result}</p>`; // 假设结果有一个 text 属性
        } catch (error) {
            console.error('Failed to fetch chat completion:', error);
            responseDiv.innerHTML = '<p>There was an error processing your request.</p>';
        }
    });
});