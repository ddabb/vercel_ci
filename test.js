// 引入 showdown 库
const showdown = require('showdown');

// 安全替换字符（Unicode 私有区）
const SAFE = {
  BACKSLASH: '\\uE001',
  UNDERSCORE: '\\uE002',
  DOLLAR: '\\uE003'
};


// 精准公式检测正则
const FORMULA_REGEX = {
  block: /(?<!\\)\$\$([\s\S]+?)\$\$(?!\\)/g,
  inline: /(?<!\\)\$(?!\s)((?:\\.|[^$])+?)(?<!\s)\$(?!\\)/g
};

// 预处理：全面保护公式内容
function formulaShield(text) {
  // 使用SAFE常量来保护特殊字符
  const protectSpecialChars = (content) => content
    .replace(/\\/g, SAFE.BACKSLASH)
    .replace(/_/g, SAFE.UNDERSCORE)
    .replace(/\$/g, SAFE.DOLLAR);

  // 阶段 1：保护块公式
  let protectedText = text.replace(FORMULA_REGEX.block, (_, content) => `$$${protectSpecialChars(content)}$$`);

  // 阶段 2：保护行内公式
  protectedText = protectedText.replace(FORMULA_REGEX.inline, (_, content) => `$${protectSpecialChars(content)}$`);

  return protectedText;
}

// 后处理：精确还原公式内容
function formulaRestore(html) {
  // 还原块公式
  let restoredHtml = html.replace(/\$\$([\s\S]+?)\$\$/g, (_, content) => {
    const finalContent = content
      .replace(new RegExp(SAFE.BACKSLASH, 'g'), '\\')
      .replace(new RegExp(SAFE.UNDERSCORE, 'g'), '_')
      .replace(new RegExp(SAFE.DOLLAR, 'g'), '$');
    return `$$${finalContent}$$`;
  });

  // 还原行内公式
  restoredHtml = restoredHtml.replace(/\$([\s\S]+?)\$/g, (_, content) => {
    const finalContent = content
      .replace(new RegExp(SAFE.BACKSLASH, 'g'), '\\')
      .replace(new RegExp(SAFE.UNDERSCORE, 'g'), '_')
      .replace(new RegExp(SAFE.DOLLAR, 'g'), '$');
    return `$${finalContent}$`;
  });

  return restoredHtml;
}

// 配置终极转换器

// 配置Showdown扩展
const converter = new showdown.Converter({
  extensions: [
    { type: 'lang', filter: formulaShield },
    { type: 'output', filter: formulaRestore }
  ]
});


// 测试用例
const testCases = [
  `咱们来具体分析一下。假设地球上存在数量为 $N$ 的枪支，每支枪的质量是 $m_{\\text{bullet}}$，子弹质量为 $m_{\\text{bullet}}$，子弹射出的速度为 $v_b$，而地球的质量则是 $M_{\\text{Earth}}$。`,
  `$$E=mc^2$$ 这是著名的质能方程。`,
  `行内公式 $x + y = z$ 和块公式 $$\\sum_{i=1}^{n} i = \\frac{n(n + 1)}{2}$$ 同时存在。`,
  `这里有一个带反斜杠的公式 $\\frac{1}{2}$ 和下划线的公式 $m_{\\text{test}}$。`,
  `咱们来具体分析一下。假设地球上存在数量为 $N$ 的枪支，每支枪的质量是 $m_{\\text{bullet}}$，子弹质量为 $m_{\\text{bullet}}$，子弹射出的速度为 $v_b$，而地球的质量则是 $M_{\\text{Earth}}$`
];

// 执行测试用例
testCases.forEach((markdown, index) => {
  console.log(`测试用例 ${index + 1}:`);
  console.log('输入的 Markdown:');
  console.log(markdown);
  const html = converter.makeHtml(markdown);
  console.log('转换后的 HTML:');
  console.log(html);
  console.log('----------------------');
});