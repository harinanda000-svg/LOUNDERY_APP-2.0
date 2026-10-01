$install = 'C:\Users\harin\AppData\Local\Programs\nodejs-portable-24.18.1'
Write-Host "Install dir: $install"
Write-Host "Exists node.exe: " (Test-Path (Join-Path $install 'node.exe'))
Write-Host "Exists npm.cmd: " (Test-Path (Join-Path $install 'npm.cmd'))
Write-Host "Persistent user PATH:"
Write-Host ([Environment]::GetEnvironmentVariable('Path','User'))
Write-Host "Process PATH before update:"
Write-Host $env:Path
$env:Path = "$env:Path;$install"
Write-Host "Process PATH after update:"
Write-Host $env:Path
Write-Host "Direct node version:"
& "$install\node.exe" -v
Write-Host "Direct npm version:"
& "$install\npm.cmd" -v
if (Get-Command node -ErrorAction SilentlyContinue) { Write-Host "node on PATH:" (node -v) } else { Write-Host "node on PATH missing" }
if (Get-Command npm -ErrorAction SilentlyContinue) { Write-Host "npm on PATH:" (npm -v) } else { Write-Host "npm on PATH missing" }
