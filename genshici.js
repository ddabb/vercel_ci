const fs = require('fs').promises; // 使用 fs.promises 以非阻塞方式处理文件系统
const path = require('path');
const ejs = require('ejs');

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
        // 动态导入 poetryesm 模块
        const { getPoets, getPoems, getPoemsByPoet } = await import('poetryesm');

        const poets = await getPoets(); // 使用导入的 getPoets 函数
        const poems = await getPoems(); // 使用导入的 getPoems 函数

        // 创建静态文件目录
        await fs.mkdir('sghtml', { recursive: true }); // 使用 fs.promises.mkdir 并设置 recursive 为 true

        // 渲染诗人列表
        for (const poet of poets) {
            const safePoet = {
                ...poet,
                name: escapeHtml(poet.name),
                description: escapeHtml(poet.description || ''),
            };
            const poetHtml = await ejs.renderFile(path.join(__dirname, 'components', 'poet.ejs'), { poet: safePoet });
            await fs.writeFile(`sghtml/${safePoet.name}.html`, poetHtml); // 使用 fs.promises.writeFile
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
            await fs.writeFile(`sghtml/${safePoem.name}.html`, poemHtml); // 使用 fs.promises.writeFile
        }
    } catch (error) {
        console.error('Error generating static files:', error);
    }
}

generateStaticFiles();