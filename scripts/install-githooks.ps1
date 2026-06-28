# Install Git hooks from .githooks into .git/hooks
# Usage: .\scripts\install-githooks.ps1

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $repoRoot

$source = Join-Path $repoRoot '.githooks'
$dest = Join-Path $repoRoot '.git\hooks'

if (-not (Test-Path $source)) {
  Write-Error ".githooks directory not found. Create .githooks/post-commit first."
  exit 1
}

Get-ChildItem -Path $source -File | ForEach-Object {
  $target = Join-Path $dest $_.Name
  Copy-Item -Path $_.FullName -Destination $target -Force
  # Ensure LF line endings and executable bit where applicable (Git for Windows)
  Write-Host "Installed hook: $($_.Name) -> $target"
}

Write-Host "Git hooks installed. If using Unix-like shell, ensure hooks are executable:"
Write-Host "  chmod +x .git/hooks/*"
Write-Host "Set SKIP_IMPL_HOOK=1 to disable the automatic generation if desired."
