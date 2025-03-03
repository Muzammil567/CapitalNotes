# Update CSS paths
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'href="styles.css"', 'href="css/styles.css"' | Set-Content $_.FullName
}

# Update JavaScript paths
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'src="main.js"', 'src="js/main.js"' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace 'src="snake-game.js"', 'src="js/snake-game.js"' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace 'src="memory.js"', 'src="js/memory.js"' | Set-Content $_.FullName
    (Get-Content $_.FullName) -replace 'src="memory-match.js"', 'src="js/memory-match.js"' | Set-Content $_.FullName
}

# Update image paths
Get-ChildItem -Filter "*.html" | ForEach-Object {
    (Get-Content $_.FullName) -replace 'src="images/', 'src="/images/' | Set-Content $_.FullName
} 