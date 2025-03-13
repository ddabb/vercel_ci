const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
// 定义目录数组中的目标目录
const targetDir = 'mdhtml';
const domain = 'https://www.60score.com/';
const jsonOutputPath = path.join(__dirname, 'jsons', 'hot.json');

async function getBusuanziPV(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setDefaultNavigationTimeout(60000);

    try {
        await page.goto(url, { waitUntil: 'networkidle2' });
        await page.waitForSelector('#busuanzi_value_page_pv', { timeout: 5000 });
        const pv = await page.$eval('#busuanzi_value_page_pv', el => el.textContent.trim());
        console.log(`获取到的pv值是: ${pv}`);
        return pv;
    } catch (err) {
        console.error(`抓取失败 (${url}):`, err);
        return 0; // 如果抓取失败或没有找到元素，默认返回0
    } finally {
        await browser.close();
    }
}

async function generateHotJson() {
    let totalFiles = 0, currentFile = '', successCount = 0, failCount = 0;
    const hotItems = [];
    console.log('开始读取目录...');
    const files = await fs.readdir(path.join(__dirname, targetDir), { withFileTypes: true });
    totalFiles = files.length;
    console.log(`总共发现 ${totalFiles} 个文件`);

    let fileIndex = 0; // 初始化计数器
    for (const file of files.filter(file => file.isFile() && ['.html'].includes(path.extname(file.name)))) {
        fileIndex++; // 在每次循环时递增计数器
        currentFile = path.join(targetDir, file.name);
        const url = `${domain}${path.relative(__dirname, currentFile).replace(/\\/g, '/')}`;
        console.log(`正在处理第 ${fileIndex} 个文件: ${currentFile}`);

        const pv = await getBusuanziPV(url);
        if (parseInt(pv, 10) > 0) { // 只添加有访问量的文章
            hotItems.push({ url, pv: parseInt(pv, 10) });
            successCount++;
        } else {
            failCount++;
        }
    }

    // 根据PV值降序排序
    hotItems.sort((a, b) => b.pv - a.pv);

    // 写入hot.json
    await fs.writeFile(jsonOutputPath, JSON.stringify(hotItems, null, 4));
    console.log(`热门文章JSON生成成功。成功处理: ${successCount}, 失败处理: ${failCount}`);
}

generateHotJson().catch(console.error);