MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\\(', '\\)']], // 行内公式分隔符
    displayMath: [['$$', '$$'], ['\\[', '\\]']], // 块级公式分隔符
    processEscapes: true,  // 启用转义符解析（如\_代替_）
    packages: {'[+]': ['text']}, // 支持 \text 宏
    macros: {
      "\\text": "\\text{#1}"  // 支持中文文本标签
    }
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'] // 避免干扰非公式内容
  },
  svg: {
    fontCache: 'global'  // 使用SVG渲染器提升兼容性
  }
};

(function() {
  var script = document.createElement('script');
  script.src = '/js/mathjax/es5/tex-mml-chtml.js'; // 确保这个路径是正确的
  script.async = true;
  document.head.appendChild(script);
})();