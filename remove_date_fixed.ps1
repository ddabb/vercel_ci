# 移除Markdown文件顶部的日期行脚本

# 获取包含日期格式的所有Markdown文件
$files = Get-ChildItem -Path "e:\git\vercel-ci\mdfiles" -Filter "*.md" -Recurse

$count = 0
foreach ($file in $files) {
    try {
        # 读取文件内容
        $content = Get-Content -Path $file.FullName -Encoding UTF8
        
        # 检查是否包含日期行
        if ($content.Count -gt 0 -and $content[0] -match '^date: \d{4}-\d{2}-\d{2}$') {
            # 移除日期行和可能的空行
            $newContent = $content | Select-Object -Skip 1
            # 移除开头的空行
            while ($newContent.Count -gt 0 -and $newContent[0].Trim() -eq '') {
                $newContent = $newContent | Select-Object -Skip 1
            }
            
            # 保存修改后的内容
            $newContent | Set-Content -Path $file.FullName -Encoding UTF8
            $count++
            Write-Host "已处理文件: $($file.Name)"
        }
    } catch {
        Write-Host "处理文件时出错: $($file.FullName)"
        Write-Host "错误信息: $($_.Exception.Message)"
    }
}

Write-Host "\n处理完成，共修改了 $count 个文件。"