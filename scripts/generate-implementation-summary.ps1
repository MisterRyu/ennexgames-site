param(
  [Parameter(Mandatory=$true,Position=0)]
  [string]$Title,

  [Parameter(Mandatory=$false,Position=1)]
  [string]$Notes = ""
)

# Usage: .\generate-implementation-summary.ps1 -Title "Short summary" -Notes "Optional longer notes"

$repoRoot = Split-Path -Parent $MyInvocation.MyCommand.Definition
Set-Location $repoRoot

# Get timestamp
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss zzz"
$tsFile = Get-Date -Format "yyyy-MM-dd-HHmmss"

# Get latest commit info
$latestCommit = git log -n 1 --pretty=format:"%h %ci %s"

# Build changelog entry
$changelogEntry = "`n## [$tsFile] $Title`n`n- Implemented: $now`n- Commit: $latestCommit`n"
if ($Notes -ne "") { $changelogEntry += "`nNotes:`n$Notes`n" }

# Append to CHANGELOG.md
$changelogPath = Join-Path $repoRoot "CHANGELOG.md"
if (-not (Test-Path $changelogPath)) { "# Changelog`n`n" | Out-File -FilePath $changelogPath -Encoding utf8 }
Add-Content -Path $changelogPath -Value $changelogEntry
Write-Host "Appended entry to CHANGELOG.md"

# Create implementation summary file
$implDir = Join-Path $repoRoot "docs\reviews\implementation"
if (-not (Test-Path $implDir)) { New-Item -ItemType Directory -Path $implDir | Out-Null }
$implFile = Join-Path $implDir ("$tsFile-implementation-summary.md")
$implContent = @"
# Implementation Summary - $($now)

Title: $Title

Commit: $latestCommit

Notes:
$Notes

Open Items Remaining:
- (list remaining tasks)

Verification:
- Method: Static review + local browser check

Generated: $now
"@

$implContent | Out-File -FilePath $implFile -Encoding utf8
Write-Host "Wrote implementation summary to: $implFile"

# Print quick next steps
Write-Host "Next: review $implFile and run 'git add CHANGELOG.md $implFile && git commit -m \"Add implementation summary: $Title\" && git push' to publish."
