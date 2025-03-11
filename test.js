const showdown = require('showdown');

// Unicode 私有区安全替换字符
const SAFE = {
    BACKSLASH: '\uE001',
    UNDERSCORE: '\uE002',
    DOLLAR: '\uE003'
};

// 公式检测正则（精准匹配）
const FORMULA_REGEX = {
    block: /(?<!\\)\$\$([\s\S]+?)\$\$(?!\\)/g,
    inline: /(?<!\\)\$(?!\s)((?:\\.|[^$])+?)(?<!\s)\$(?!\\)/g
};

// 预处理：保护公式内容
function formulaShield(text) {
    // 阶段1：处理块级公式（用 $$$$ 包裹）
    let protected = text.replace(FORMULA_REGEX.block, (_, content) => {
        return `$$$$${content
            .replace(/\\/g, SAFE.BACKSLASH)
            .replace(/_/g, SAFE.UNDERSCORE)
            .replace(/\$/g, SAFE.DOLLAR)}$$$$`;
    });

    // 阶段2：处理行内公式（用 $$ 包裹）
    protected = protected.replace(FORMULA_REGEX.inline, (_, content) => {
        return `$$${content
            .replace(/\\/g, SAFE.BACKSLASH)
            .replace(/_/g, SAFE.UNDERSCORE)
            .replace(/\$/g, SAFE.DOLLAR)}$$`;
    });

    return protected;
}

// 后处理：还原公式内容
function formulaRestore(html) {
    // 处理块级公式（精准匹配 Showdown 生成的 HTML 结构）
    let restored = html.replace(/(?:<p>)?\$\$\$\$([\s\S]+?)\$\$\$\$(?:<\/p>)?/g, (_, content) => {
        const final = content
            .replace(new RegExp(SAFE.BACKSLASH, 'g'), '\\\\')
            .replace(new RegExp(SAFE.UNDERSCORE, 'g'), '_')
            .replace(new RegExp(SAFE.DOLLAR, 'g'), '$');
        return `$$${final}$$`; // 直接输出公式，跳过段落标签
    });

    // 处理行内公式
    restored = restored.replace(/\$\$([\s\S]+?)\$\$/g, (_, content) => {
        return `$${content
            .replace(new RegExp(SAFE.BACKSLASH, 'g'), '\\\\')
            .replace(new RegExp(SAFE.UNDERSCORE, 'g'), '_')
            .replace(new RegExp(SAFE.DOLLAR, 'g'), '$')}$`;
    });

    return restored;
}

// 配置 Showdown 转换器（关键配置）
const converter = new showdown.Converter({
    literalMidWordUnderscores: true,    // 保护下划线不被转换[1](@ref)
    backslashEscapesHTMLTags: false,    // 禁用反斜杠转义 HTML
    disableForced4SpacesIndentedSublists: true, // 避免列表干扰公式
    simpleLineBreaks: true,             // 简化换行符处理
    extensions: [{
        type: 'lang',
        filter: formulaShield  // 预处理扩展
    }, {
        type: 'output',
        filter: formulaRestore // 后处理扩展
    }]
});

// 测试用例
const markdown = `咱们来具体分析一下。假设地球上存在数量为 $N$ 的枪支，每支枪的质量是 $m_{\\text{bullet}}$，子弹质量为 $m_{\\text{bullet}}$，子弹射出的速度为 $v_b$，而地球的质量则是 $M_{\\text{Earth}}$`;

console.log(converter.makeHtml(markdown));