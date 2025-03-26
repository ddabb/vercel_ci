const markdownIt = require('markdown-it');
const markdownItMathjax = require('markdown-it-mathjax3');
const yaml = require('js-yaml');
const fs = require('fs').promises;
const path = require('path');

require('dotenv').config({ path: '.env.development.local' }); // 使用开发环境变量

const { createClient } = require('@supabase/supabase-js');
// 创建 Supabase 客户端
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
// 初始化 markdown-it
const md = new markdownIt({
    html: true, // 允许 HTML 标签
    linkify: true, // 自动将 URL 转换为链接
    typographer: false // 禁用智能排版（避免 `_` 被解析为斜体）
});

// 使用 markdown-it-mathjax 插件支持数学公式
md.use(markdownItMathjax);

// 定义 Front Matter 正则表达式
const FRONT_MATTER_REGEX = /^(\uFEFF)?(?:---|\+\+\+)\r?\n([\s\S]*?)\r?\n(?:---|\+\+\+)(?:\s*$)/m;

// 提取 Front Matter
function extractFrontMatter(content) {
    const match = content.match(FRONT_MATTER_REGEX);
    if (!match) return { metadata: {}, cleanedContent: content };

    try {
        return {
            metadata: yaml.load(match[2].trimEnd()), // 处理尾部空行
            cleanedContent: content.slice(match[0].length) // 直接切片提升性能
        };
    } catch (e) {
        console.error(`YAML解析失败: ${e.message}`, match[2]);
        return { metadata: {}, cleanedContent: content };
    }
}

// 定义路径
const mdFilesDirectory = path.resolve(__dirname, 'mdfiles');
const outputDirectory = path.resolve(__dirname, 'static', 'mdfiles');
const articleListJsonPath = path.resolve(__dirname, 'jsons', 'articleList.json');

async function processMarkdownFile(filePath) {
    try {
        console.log(`Processing ${filePath}`);
        const content = await fs.readFile(filePath, 'utf8');

        // 提取 Front Matter 和 清理后的内容
        const { metadata, cleanedContent } = extractFrontMatter(content);

        // 将清理后的内容转换为 HTML
        const htmlContent = md.render(cleanedContent);

        // 准备输出数据
        const outputData = {
            content: htmlContent,
            meta: metadata
        };



        // 准备插入到数据库的数据
        const dbData = {
            title: metadata.title,
            category: metadata.category,
            goodsname: metadata.goodsName,
            tags: metadata.tags,
            description: metadata.description,
            content: htmlContent,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        // 先检查文章是否存在
        const { data: existingData, error: selectError } = await supabase
            .from('mdfiles')
            .select('title')
            .eq('title', dbData.title)
            .single();

        if (selectError) {
            if (selectError.code === 'PGRST116') { // 未找到记录
                // 文章不存在，插入新数据
                const { data: insertResult, error: insertError } = await supabase
                    .from('mdfiles')
                    .insert([dbData])
                    .select();
                if (insertError) {
                    console.error('数据插入失败:', insertError);
                } else {
                    console.log('数据插入成功:', insertResult);
                }
            } else {
                console.error('查询文章是否存在时出错:', selectError);
            }
        } else {
            // 文章存在，更新数据
            const { data: updateResult, error: updateError } = await supabase
                .from('mdfiles')
                .update({
                    ...dbData,
                    updated_at: new Date().toISOString()
                })
                .eq('title', dbData.title)
                .select();
            if (updateError) {
                console.error('数据更新失败:', updateError);
            } else {
                console.log('数据更新成功:', updateResult);
            }
        }

        // 返回文件名和元数据
        return {
            fileName: path.basename(filePath),
            meta: metadata
        };
    } catch (err) {
        console.error(`Error processing file ${filePath}:`, err);
        return null;
    }
}

async function generateArticleList(articleInfos) {
    try {
        const articleList = articleInfos.filter(info => info !== null).map(info => ({
            fileName: info.fileName.replace('.md', '.html'), // 调整为.html后缀
            title: info.meta.title || info.fileName.replace('.md', ''),
            category: info.meta.category || '未分类',
            updateTime: info.meta.updateTime || new Date().toISOString(), // 使用当前时间作为默认值
            description: info.meta.description || ''
        }));

        await fs.mkdir(path.dirname(articleListJsonPath), { recursive: true });
        await fs.writeFile(articleListJsonPath, JSON.stringify({ articles: articleList }, null, 2));
        console.log('Generated articleList.json');
    } catch (err) {
        console.error('Error generating articleList.json:', err);
    }
}

(async () => {
    try {
        const files = await fs.readdir(mdFilesDirectory);
        const markdownFiles = files.filter(file => path.extname(file) === '.md');

        const articleInfos = [];
        for (const file of markdownFiles) {
            const filePath = path.join(mdFilesDirectory, file);
            const articleInfo = await processMarkdownFile(filePath);
            if (articleInfo) {
                articleInfos.push(articleInfo);
            }
        }


    } catch (err) {
        console.error('Error during markdown processing:', err);
    }
})();