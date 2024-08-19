import fs from 'fs';
import path from 'path';

export default async function handler(request, response) {
  const imagesDirectory = path.resolve(__dirname, '..', 'img'); // 假设图片目录是 'img'
  try {
    // 检查目录是否存在
    if (!fs.existsSync(imagesDirectory)) {
      throw new Error(`Directory '${imagesDirectory}' does not exist.`);
    }
    
    // 读取图片目录中的所有文件
    const images = fs.readdirSync(imagesDirectory)
      .filter((file) => {
        const ext = path.extname(file).toLowerCase();
        return ext === '.jpg' || ext === '.jpeg' || ext === '.png' || ext === '.gif';
      })
      .map((file) => ({ src: `/img/${file}`, alt: file })); // 构建图片对象数组

    response.status(200).json(images); // 返回图片数组
  } catch (error) {
    response.status(500).json({ error: error.message + imagesDirectory });
  }
}