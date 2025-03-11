const showdown = require('showdown');

// 常量定义
const TEMP_UNDERSCORE = '\uFFF0'; // 显式命名占位符
const BLOCK_FORMULA_REGEX = /(?<!\\)\$\$((?:\\.|[^$\n])+?)(?<!\\)\$\$/g;
const INLINE_FORMULA_REGEX = /(?<!\\)\$((?:\\.|[^$\n])+?)(?<!\\)\$/g;

// 公式保护函数
function protectFormulas(text) {
  // 处理块公式
  let protected = text.replace(BLOCK_FORMULA_REGEX, (match, content) => {
    return `$$${content.replace(/_/g, TEMP_UNDERSCORE)}$$`;
  });
  // 处理行内公式
  protected = protected.replace(INLINE_FORMULA_REGEX, (match, content) => {
    return `$${content.replace(/_/g, TEMP_UNDERSCORE)}$`;
  });
  return protected;
}

// 公式恢复函数
function restoreFormulas(html) {
  return html.replace(/(\$\$?)(.*?)\1/g, (match, delim, content) => {
    return `${delim}${content.replace(new RegExp(TEMP_UNDERSCORE, 'g'), '_')}${delim}`;
  });
}

// 配置转换器
const converter = new showdown.Converter({
  literalMidWordUnderscores: true,
  extensions: [{
    type: 'lang',
    filter: protectFormulas
  }, {
    type: 'output',
    filter: restoreFormulas
  }]
});

// 测试用例
const markdown = `公式测试：
$$P_{\\text{子弹}} = N \\cdot m_{\\text{bullet}} \\cdot v_b$$
行内公式: $E = mc^2_正常文字`;
console.log(converter.makeHtml(markdown));