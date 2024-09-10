const fs = require('fs').promises;
const path = require('path');

async function printDirectoryStructure(dirPath, indent = '', ignoredDirs = ['node_modules', ".git", "unpackage", ".next", ".vscode", ".vscode", "out"]) {
    try {
        const files = await fs.readdir(dirPath, { withFileTypes: true });
        for (const file of files) {
            if (ignoredDirs.includes(file.name)) {
                continue; // Skip ignored directories
            }

            const fullPath = path.join(dirPath, file.name);
            let output = indent + file.name;
            if (file.isDirectory()) {
                output += '/';
                console.log(output);
                // Recursively call this function for subdirectories
                await printDirectoryStructure(fullPath, indent + '  ', ignoredDirs);
            } else {
                console.log(output);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dirPath}:`, error);
    }
}

// 调用函数并传入你的项目根目录路径
(async () => {
    try {
        await printDirectoryStructure('./');
    } catch (error) {
        console.error('An error occurred:', error);
    }
})();