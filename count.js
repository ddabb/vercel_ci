const puppeteer = require('puppeteer');

async function getBusuanziPV(url) {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // 设置超时时间（可选）
    await page.setDefaultNavigationTimeout(60000);

    try {
        // 访问目标页面
        await page.goto(url, {
            waitUntil: 'networkidle2' // 等待页面网络请求完成
        });

        // 等待 busuanzi 元素加载（关键步骤）
        await page.waitForSelector('#busuanzi_value_page_pv', {
            timeout: 5000 // 最多等待5秒
        });

        // 获取统计数据
        const pv = await page.$eval(
            '#busuanzi_value_page_pv',
            el => el.textContent.trim()
        );

        console.log('当前页面PV值:', pv);
        return pv;

    } catch (err) {
        console.error('抓取失败:', err);
    } finally {
        await browser.close();
    }
}

// 使用示例
getBusuanziPV('https://www.60score.com/mdhtml/SEO内容生成新范式：DeepSeek关键词策略与语义匹配实战.html');