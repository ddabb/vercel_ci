const fs = require('fs');
const path = require('path');
const imgDir = path.join(__dirname, 'img'); // 假设img文件夹位于项目根目录
const outputFilePath = path.join(__dirname,'jsons' ,'photos.json');

function isImageFile(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.gif'].includes(ext);
}

// 读取现有images.json的内容，如果存在的话
let existingImages;
try {
    existingImages = JSON.parse(fs.readFileSync(outputFilePath, 'utf-8'));
} catch (e) {
    existingImages = [];
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    let fileList = []; // 统一存储所有图片

    files.forEach(function (file) {
        const filepath = path.join(dir, file);
        const stat = fs.statSync(filepath);
        if (stat.isDirectory()) {
            fileList.push(...walkDir(filepath));
        } else if (isImageFile(filepath)) {
            const relativePath = path.relative(imgDir, filepath);
            const url = `/img/${relativePath.split(path.sep).join('/')}`;
            // 查找existingImages中是否有对应项
            const existingImage = existingImages.find(img => img.src === url);
            if (existingImage && existingImage.alt !== undefined && existingImage.alt !== '') {
                // 如果有对应的非空alt，则添加到列表
                fileList.push({
                    src: url,
                    alt: existingImage.alt
                });
            } else {
                // 没有找到或者alt为空，则优先级更高，放在列表前面
                fileList.unshift({
                    src: url,
                    alt: ''
                });
            }
        }
    });

    return fileList;
}

function updateImagesJson() {
    const images = walkDir(imgDir);

    // 更新images.json，删除不存在的图片条目
    const updatedImages = images.filter(image => {
        // 提取imgDir下的相对路径
        const imagePath = path.join(imgDir, image.src.replace('/img/', ''));
        return fs.existsSync(imagePath);
    });

    const jsonData = JSON.stringify(updatedImages, null, 4);
    fs.writeFileSync(outputFilePath, jsonData, 'utf-8');
    console.log(`Updated ${outputFilePath}`);
}

updateImagesJson();