const showdown = require('showdown');

// 使用双重占位符策略
const PLACEHOLDERS = {
  BACKSLASH: '\uE001',  // Unicode私有区字符
  UNDERSCORE: '\uE002'
};

// 强化版公式匹配正则
const FORMULA_REGEX = {
  block: /(?<!\\)\$\$([\s\S]*?)\$\$(?!\\)/g,
  inline: /(?<!\\)\$((?:\\\$|\\[^$]|[^$])+?)\$(?!\\)/g
};

// 预处理：保护公式内的特殊符号
function protectFormulas(text) {
  // 处理块公式
  let processed = text.replace(FORMULA_REGEX.block, (m, content) => {
    return '$$' + content
      .replace(/\\/g, PLACEHOLDERS.BACKSLASH)  // 先保护反斜杠
      .replace(/_/g, PLACEHOLDERS.UNDERSCORE) + '$$';
  });

  // 处理行内公式
  processed = processed.replace(FORMULA_REGEX.inline, (m, content) => {
    return '$' + content
      .replace(/\\/g, PLACEHOLDERS.BACKSLASH)
      .replace(/_/g, PLACEHOLDERS.UNDERSCORE) + '$';
  });

  return processed;
}

// 后处理：恢复特殊符号
function restoreFormulas(html) {
  return html
    // 恢复块公式
    .replace(/<p>\$\$([\s\S]*?)\$\$<\/p>/g, (m, content) => {
      return `<p>$$${content
        .replace(new RegExp(PLACEHOLDERS.UNDERSCORE, 'g'), '_')
        .replace(new RegExp(PLACEHOLDERS.BACKSLASH, 'g'), '\\')}$$</p>`;
    })
    // 恢复行内公式
    .replace(/\$([\s\S]*?)\$/g, (m, content) => {
      return `$${content
        .replace(new RegExp(PLACEHOLDERS.UNDERSCORE, 'g'), '_')
        .replace(new RegExp(PLACEHOLDERS.BACKSLASH, 'g'), '\\')}$`;
    });
}

// 配置转换器
const converter = new showdown.Converter({
  literalMidWordUnderscores: true,
  backslashEscapesHTMLTags: false,
  extensions: [{
    type: 'lang',
    filter: protectFormulas
  }, {
    type: 'output',
    filter: restoreFormulas
  }]
});

// 测试用例
const markdown = `咱们来具体分析一下。假设地球上存在数量为 $N$ 的枪支，每支枪的质量是 $m_{\\text{bullet}}$，子弹质量为 $m_{\\text{bullet}}$，子弹射出的速度为 $v_b$，而地球的质量则是 $M_{\\text{Earth}}$。`;

console.log(converter.makeHtml(markdown));

const markdown1 = `公式测试：
$$P_{\\text{子弹}} = N \\cdot m_{\\text{bullet}} \\cdot v_b$$
行内公式: $E = mc^2_正常文字`;
console.log(converter.makeHtml(markdown1));