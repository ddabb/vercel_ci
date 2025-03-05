const fs = require('fs');
const path = require('path');
const xlsx = require('xlsx');
const GoodsPath = path.resolve(__dirname, 'jsons', 'Goods.json');
// 假设Excel文件存放在与mdfiles同级的excelFiles目录下
const excelFilesDirectory = path.resolve(__dirname, 'excelFiles');
// 在写入JSON文件之前调用readExcelFiles函数获取goodsLinks
const goodsLinks = readExcelFiles(excelFilesDirectory);
const goodsOutputPath = path.resolve(__dirname, 'jsons', 'goodlinks.json');
function readExcelFiles(directory) {
    const goodsLinks = [];

    if (fs.existsSync(directory)) {
        const files = fs.readdirSync(directory);

        files.forEach(file => {
            const filePath = path.join(directory, file);

            if (path.extname(file).toLowerCase() === '.xlsx') {
                const workbook = xlsx.readFile(filePath);
                const stats = fs.statSync(filePath);
                const sheetNames = workbook.SheetNames;

                sheetNames.forEach(sheetName => {
                    const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

                    // 假设Excel中的链接在'Link'列，如果有不同的结构，请根据实际情况调整
                    data.forEach(row => {
                        if (row.商品名称) { // 确保行中有链接
                            goodsLinks.push({
                                name: row.商品名称 || '未知名称', // 如果有商品名称字段则使用，否则默认值
                                link: row.商品详情页URL,
                                picLink: row.商品主图链接,
                                monthSale: row.月销,
                                unitprice: row.单价, //京东价
                                handPrice: row.到手价, //到手价      
                                showurl: row.联盟推广链接,
                                birthtime: stats.birthtime,
                                updateTime: stats.mtime,
                            });
                        }
                    });
                });
            }
        });
    }

    return goodsLinks;
}

// 提取goodsLinks中的name和showurl字段
const goodUrls = goodsLinks.map(good => (
    good.name

));

fs.writeFileSync(GoodsPath, JSON.stringify(goodUrls, null, 2));

fs.writeFileSync(goodsOutputPath, JSON.stringify(goodsLinks, null, 2));