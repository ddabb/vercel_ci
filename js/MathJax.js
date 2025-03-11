// MathJax.js
MathJax = {
    tex: {
      inlineMath: [['$', '$'], ['\$', '\$']],  // 配置行内公式分隔符
      displayMath: [['$$', '$$'], ['\$', '\$']] // 配置块级公式分隔符
    },
    startup: {
      ready: () => {
        console.log('MathJax is loaded, ready for typesetting mathematics');
        MathJax.startup.defaultReady();
      }
    }
  };
  
  (function() {
    var script = document.createElement('script');
    script.src = '/js/mathjax/es5/tex-mml-chtml.js'; // 注意这里的路径要根据您的实际项目结构调整
    script.async = true;
    document.head.appendChild(script);
  })();