$dest = Join-Path $env:TEMP 'node-v24.18.1-win-x64.zip'
$install = Join-Path $env:LOCALAPPDATA 'Programs\nodejs-portable-24.18.1'
if (-not (Test-Path $install)) { New-Item -ItemType Directory -Path $install | Out-Null }
Write-Host "Downloading Node.js zip to $dest"
Invoke-WebRequest -Uri 'https://nodejs.org/dist/v24.18.1/node-v24.18.1-win-x64.zip' -OutFile $dest -UseBasicParsing
Write-Host 'Download complete'
Expand-Archive -Path $dest -DestinationPath $install -Force
Write-Host 'Archive extracted'
$src = Join-Path $install 'node-v24.18.1-win-x64'
if (Test-Path $src) {
  Get-ChildItem -Path $src -Force | ForEach-Object { Move-Item -Path $_.FullName -Destination $install -Force }
  Remove-Item -Path $src -Recurse -Force
}
Write-Host "Install dir: $install"
Write-Host "node.exe exists: " (Test-Path (Join-Path $install 'node.exe'))
Write-Host "npm.cmd exists: " (Test-Path (Join-Path $install 'npm.cmd'))
$userPath = [Environment]::GetEnvironmentVariable('Path','User')
if (-not $userPath) { $userPath = '' }
if ($userPath -notlike "*$install*") {
  if ($userPath -ne '') { $newPath = "$userPath;$install" } else { $newPath = $install }
  [Environment]::SetEnvironmentVariable('Path',$newPath,'User')
  Write-Host 'Added install dir to user PATH'
} else {
  Write-Host 'Install dir already in user PATH'
}
Write-Host 'User PATH after update:'
Write-Host [Environment]::GetEnvironmentVariable('Path','User')
Write-Host 'Direct node version:'
& (Join-Path $install 'node.exe') -v
Write-Host 'Direct npm version:'
& (Join-Path $install 'npm.cmd') -v
