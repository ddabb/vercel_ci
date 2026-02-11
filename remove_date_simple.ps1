# Remove date line from Markdown files

# Get all Markdown files
$files = Get-ChildItem -Path "e:\git\vercel-ci\mdfiles" -Filter "*.md" -Recurse

$count = 0
foreach ($file in $files) {
    try {
        # Read file content
        $content = Get-Content -Path $file.FullName -Encoding UTF8
        
        # Check if first line is date format
        if ($content.Count -gt 0 -and $content[0] -match '^date: \d{4}-\d{2}-\d{2}$') {
            # Remove date line
            $newContent = $content | Select-Object -Skip 1
            # Remove leading empty lines
            while ($newContent.Count -gt 0 -and $newContent[0].Trim() -eq '') {
                $newContent = $newContent | Select-Object -Skip 1
            }
            
            # Save modified content
            $newContent | Set-Content -Path $file.FullName -Encoding UTF8
            $count++
            Write-Host "Processed: $($file.Name)"
        }
    } catch {
        Write-Host "Error processing: $($file.FullName)"
        Write-Host "Error: $($_.Exception.Message)"
    }
}

Write-Host "\nCompleted. Modified $count files."