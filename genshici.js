const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function generateStaticFiles() {
    try {
        const { getPoetPaths, getPoemPaths, getPoetByPath, getPoemByPath } = await import('poetryesm');

        const poetPaths = await getPoetPaths();
        const poemPaths = await getPoemPaths();

        await fs.mkdir('poethtml', { recursive: true });
        await fs.mkdir('poemhtml', { recursive: true });

        async function processPoet(poetpath) {
            console.log(`Processing poet: ${poetpath}`);
            const poet = await getPoetByPath(poetpath);
            const safePoet = {
                ...poet,
                name: escapeHtml(poet.name),
                description: escapeHtml(poet.description || ''),
            };
            const poetHtml = await ejs.renderFile(path.join(__dirname, 'components', 'poet.ejs'), { poet: safePoet });
            await fs.writeFile(`poethtml/${safePoet.name}.html`, poetHtml);
        }

        async function processPoem(poempath) {
            console.log(`Processing poem: ${poempath}`);
            const poem = await getPoemByPath(poempath);
            const safePoem = {
                ...poem,
                name: escapeHtml(poem.name),
                contents: poem.contents.map(line => escapeHtml(line)),
                poetName: escapeHtml(poem.poetName),
                authors: poem.authors ? poem.authors.map(author => escapeHtml(author)) : undefined,
            };
            const poemHtml = await ejs.renderFile(path.join(__dirname, 'components', 'poem.ejs'), { poem: safePoem });
            await fs.writeFile(`poemhtml/${safePoem.name}.html`, poemHtml);
        }

        const limit = 10;
        const queue = [];

        async function processWithConcurrency(tasks, processFn) {
            for (const task of tasks) {
                const promise = processFn(task).finally(() => {
                    queue.splice(queue.indexOf(promise), 1);
                });
                queue.push(promise);

                if (queue.length >= limit) {
                    await Promise.race(queue);
                }
            }
            await Promise.all(queue);
        }

        // 处理诗人
        await processWithConcurrency(poetPaths, processPoet);

        // 处理诗歌
        await processWithConcurrency(poemPaths, processPoem);

        console.log('Static files generation completed successfully.');
    } catch (error) {
        console.error('Error generating static files:', error);
    }
}

generateStaticFiles();