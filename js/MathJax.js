// MathJax配置
MathJax = {
  tex: {
    inlineMath: [['$', '$'], ['\$', '\$']], // 行内公式分隔符
    displayMath: [['$$', '$$'], ['\$', '\$']], // 块级公式分隔符
    processEscapes: true,  // 启用转义符解析（如\_代替_）
    packages: {'[+]': ['text']}, // 支持 \text 宏和其他必要的包
  },
  options: {
    skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre'], // 避免干扰非公式内容
  },
  svg: {
    fontCache: 'global',  // 使用SVG渲染器提升兼容性
  },
  startup: {
    ready: () => {
      // 当MathJax准备就绪时，手动触发一次typeset
      MathJax.startup.defaultReady();
      document.addEventListener('DOMContentLoaded', function() {
        MathJax.typeset();
      });
    }
  }
};

(function() {
  var script = document.createElement('script');
  script.src = '/js/mathjax/es5/tex-mml-chtml.js'; // 确保这个路径是正确的
  script.async = true;
  script.onload = function() {
    // 确保在MathJax脚本加载完成后进行初始化
    if (document.readyState !== 'loading') {
      MathJax.typeset();
    } else {
      document.addEventListener('DOMContentLoaded', function() {
        MathJax.typeset();
      });
    }
  };
  document.head.appendChild(script);
})();