// public/js/article.js

document.addEventListener('DOMContentLoaded', function() {

    debugger
    const urlParams = new URLSearchParams(window.location.search);
    const articleName = urlParams.get('name');

    fetch(`/api/wenzhang/${articleName}`)
        .then(response => response.json())
        .then(data => {
            debugger
            console.log(data);
            document.getElementById('article-title').textContent = data.title;
            document.getElementById('article-content').innerHTML = data.content;
        })
        .catch(error => console.error('Error fetching article:', error));
});