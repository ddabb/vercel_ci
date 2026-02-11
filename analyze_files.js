const fs = require('fs');
const path = require('path');

/**
 * 简化的文件分析工具
 * 分析Markdown文件并生成mdfiles_reorganized.json
 */

function analyzeFiles() {
    console.log('开始分析文件...');
    
    const mdfilesPath = 'e:\\git\\vercel-ci\\mdfiles';
    
    // 读取所有Markdown文件
    const files = fs.readdirSync(mdfilesPath).filter(file => file.endsWith('.md'));
    console.log(`找到 ${files.length} 个Markdown文件`);

    const categories = {};
    const tags = {};

    // 遍历所有文件
    files.forEach(file => {
        try {
            const filePath = path.join(mdfilesPath, file);
            const content = fs.readFileSync(filePath, 'utf8');
            
            // 提取分类
            const categoryMatch = content.match(/^category:\s*(.+)$/m);
            if (categoryMatch) {
                const category = categoryMatch[1].trim();
                categories[category] = (categories[category] || 0) + 1;
            }
            
            // 提取标签
            const tagsMatch = content.match(/^tags:\s*\[(.*)\]$/m);
            if (tagsMatch) {
                const tagsString = tagsMatch[1];
                const fileTags = tagsString.split(',').map(tag => tag.trim());
                fileTags.forEach(tag => {
                    tags[tag] = (tags[tag] || 0) + 1;
                });
            }
        } catch (error) {
            console.error(`处理文件 ${file} 时出错:`, error.message);
        }
    });

    // 生成重组后的结构
    generateReorganizedStructure(files.length, categories, tags);
}

/**
 * 生成重组后的分类结构
 */
function generateReorganizedStructure(totalFiles, categories, tags) {
    console.log('\n=== 生成重组后的分类结构 ===');
    
    // 构建简单的分类结构
    const reorganized = {
        meta: {
            generatedAt: new Date().toISOString(),
            totalFiles: totalFiles,
            reorganizedAt: new Date().toISOString(),
            reorganizationVersion: '1.0'
        },
        taxonomy: {
            categories: categories,
            tags: tags
        }
    };

    // 保存重组后的结构
    const outputPath = path.join(__dirname, 'jsons', 'mdfiles_reorganized.json');
    fs.writeFileSync(outputPath, JSON.stringify(reorganized, null, 2), 'utf8');
    console.log(`重组后的分类结构已保存到: ${outputPath}`);

    return reorganized;
}

// 运行分析
analyzeFiles();