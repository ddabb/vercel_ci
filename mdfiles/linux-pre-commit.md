#!/bin/sh

# 安装 coreutils(如果尚未安装)
if ! command -v realpath >/dev/null 2>&1 || ! command -v cygpath >/dev/null 2>&1; then
    if [ "$(uname)" = "Darwin" ]; then
        # macOS
        brew install coreutils
    elif [ "$(uname)" = "Linux" ]; then
        # Linux
        sudo apt-get install coreutils
    else
        # Windows (Cygwin)
        apt-cyg install coreutils
    fi
fi

# 使用 cygpath 将 Windows 风格的路径转换为 Unix 风格的路径
# 对于非 Windows 系统，cygpath 可能不可用，因此我们使用 realpath
if [ "$(uname)" = "Darwin" ] || [ "$(uname)" = "Linux" ]; then
    NODE_SCRIPT=$(realpath "../NodeAgent/update-mdfiles-json.js")
    JSON_OUTPUT_PATH=$(realpath "../NodeAgent/jsons/mdfiles.json")
else
    NODE_SCRIPT=$(cygpath -u "../NodeAgent/update-mdfiles-json.js")
    JSON_OUTPUT_PATH=$(cygpath -u "../NodeAgent/jsons/mdfiles.json")
fi

# 输出绝对路径
echo "Absolute path of Node.js script: $NODE_SCRIPT"
echo "Absolute path of generated JSON file: $JSON_OUTPUT_PATH"

# 检查 Node.js 脚本是否存在
if [ ! -f "$NODE_SCRIPT" ]; then
    echo "Node.js script not found: $NODE_SCRIPT"
    exit 1
fi

# 检查 Node.js 是否可用
if command -v node >/dev/null 2>&1; then
    # 执行 Node.js 脚本
    node "$NODE_SCRIPT"
else
    echo "Node.js is not installed or not in PATH."
    exit 1
fi

# 检查生成的 JSON 文件是否存在
if [ -f "$JSON_OUTPUT_PATH" ]; then
    # 将生成的 mdfiles.json 添加到暂存区
    git add "$JSON_OUTPUT_PATH"
    # 自动提交更改
    git commit -m "Update mdfiles.json"
else
    echo "Generated JSON file not found: $JSON_OUTPUT_PATH"
    exit 1
fi

exit 0