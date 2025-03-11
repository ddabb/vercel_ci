// MathJax.js
MathJax = {
    tex: {
        inlineMath: [['$', '$'], ['\$', '\$']],  // 配置行内公式分隔符
        displayMath: [['$$', '$$'], ['\$', '\$']] // 配置块级公式分隔符
    }
};

(function () {
    var script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js';
    script.async = true;
    document.head.appendChild(script);
})();