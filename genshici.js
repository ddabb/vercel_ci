const fs = require('fs').promises;
const path = require('path');
const ejs = require('ejs');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function escapeHtml(unsafe) {
    return unsafe
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

async function generateStaticFiles(outputPath, dynastyTemplatePath, poetTemplatePath) {
    try {
        console.log('Importing poetryesm...');
        const { getPoetPaths, getPoetByPath } = await import('poetryesm'); // 动态导入

        console.log('Fetching poet paths...');
        const poetPaths = await getPoetPaths();
        console.log(`Found ${poetPaths.length} poet paths.`);

        const poetHtmlPath = path.resolve(outputPath, 'sghtml');
        console.log(`Creating output directory: ${poetHtmlPath}`);
        await fs.mkdir(poetHtmlPath, { recursive: true });

        async function processPoet(poetpath) {
            console.log(`Processing poet: ${poetpath}`);
            const poet = await getPoetByPath(poetpath);
            if (!poet) {
                console.error(`Poet not found at path: ${poetpath}`);
                return;
            }
            const safePoet = {
                ...poet,
                Name: escapeHtml(poet.Name || ''),
                Description: escapeHtml(poet.Description || ''),
                Dynasty: escapeHtml(poet.Dynasty || ''),
                Birth: escapeHtml(poet.Birth || ''),
                Death: escapeHtml(poet.Death || ''),
                Poems: (poet.Poems || []).map(poem => ({
                    ...poet,
                    Name: escapeHtml(poem.Name || ''),
                    Form: escapeHtml(poem.Form || ''),
                    Tags: (poem.Tags || []).map(tag => escapeHtml(tag)),
                    Contents: (poem.Contents || []).map(line => escapeHtml(line))
                }))
            };
            const poetHtml = await ejs.renderFile(poetTemplatePath, { poet: safePoet });
            const poetFilePath = path.join(poetHtmlPath, `${safePoet.Name}.html`);
            console.log(`Writing poet file: ${poetFilePath}`);
            await fs.writeFile(poetFilePath, poetHtml);
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
                    console.log(`Queue length reached limit (${limit}), waiting for one to complete...`);
                    await Promise.race(queue);
                }
            }
            console.log('Waiting for all tasks to complete...');
            await Promise.all(queue);
        }

        // 处理诗人
        console.log('Processing poets...');
        await processWithConcurrency(poetPaths, processPoet);

        // 生成朝代诗人清单
        const outputFilePath = path.join(poetHtmlPath, 'dynasties.html');
        const dynastyPoetMap = new Map();

        for (const poetPath of poetPaths) {
            const poet = await getPoetByPath(poetPath);
            if (!dynastyPoetMap.has(poet.Dynasty)) {
                dynastyPoetMap.set(poet.Dynasty, []);
            }
            dynastyPoetMap.get(poet.Dynasty).push(poet);
        }

        const dynastyPoetList = Array.from(dynastyPoetMap.entries()).map(([dynasty, poetList]) => ({
            dynasty,
            poets: poetList.map(poet => ({
                ...poet,
                Name: escapeHtml(poet.Name || '')
            }))
        }));

        console.log(`Rendering dynasty template from: ${dynastyTemplatePath}`);
        const renderedContent = await ejs.renderFile(dynastyTemplatePath, { dynastyPoetList });
        console.log(`Writing dynasties file: ${outputFilePath}`);
        await fs.writeFile(outputFilePath, renderedContent);

        console.log('Static files generation completed successfully.');
    } catch (error) {
        console.error('Error generating static files:', error);
    }
}

const argv = yargs(hideBin(process.argv))
    .option('outputPath', {
        alias: 'o',
        describe: 'Output path for generated files',
        type: 'string',
        demandOption: false, // 设置为 false 允许用户不指定输出目录
        default: './' // 默认值为当前工作目录（根目录）
    })
    .option('dynastyTemplatePath', {
        alias: 'd',
        describe: 'Path to the dynasty template file',
        type: 'string',
        default: path.join(__dirname, 'components', 'Dynasty.ejs')
    })
    .option('poetTemplatePath', {
        alias: 'p',
        describe: 'Path to the poet template file',
        type: 'string',
        default: path.join(__dirname, 'components', 'poet.ejs')
    })
    .help()
    .alias('help', 'h')
    .argv;

console.log(`Output Path: ${argv.outputPath}`);
console.log(`Dynasty Template Path: ${argv.dynastyTemplatePath}`);
console.log(`Poet Template Path: ${argv.poetTemplatePath}`);

generateStaticFiles(argv.outputPath, argv.dynastyTemplatePath, argv.poetTemplatePath);