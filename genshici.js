import fs from 'fs';
import path from 'path';
import ejs from 'ejs';
import { getPoets, getPoems, getPoemsByPoet } from 'poetryesm'; // 导入正确的函数

async function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function generateStaticFiles() {
    try {
        const poets = await getPoets(); // 使用导入的 getPoets 函数
        const poems = await getPoems(); // 使用导入的 getPoets 函数

        // 创建静态文件目录
        if (!fs.existsSync('sghtml')) {
            fs.mkdirSync('sghtml');
        }

        // 渲染诗人列表
        for (const poet of poets) {
            const safePoet = {
                ...poet,
                name: escapeHtml(poet.name),
                description: escapeHtml(poet.description || ''),
            };
            const poetHtml = await ejs.renderFile(path.join(__dirname, 'components', 'poet.ejs'), { poet: safePoet });
            fs.writeFileSync(`sghtml/${safePoet.name}.html`, poetHtml);
        }

        // 渲染诗作列表
        for (const poem of poems) {
            const safePoem = {
                ...poem,
                name: escapeHtml(poem.name),
                contents: poem.contents.map(line => escapeHtml(line)),
                poetName: escapeHtml(poem.poetName),
                // 假设 poem.authors 是一个包含所有作者名字的数组
                authors: poem.authors ? poem.authors.map(author => escapeHtml(author)) : undefined,
            };
            const poemHtml = await ejs.renderFile(path.join(__dirname, 'components', 'poem.ejs'), { poem: safePoem });
            fs.writeFileSync(`sghtml/${safePoem.name}.html`, poemHtml);
        }
    } catch (error) {
        console.error('Error generating static files:', error);
    }
}

generateStaticFiles();