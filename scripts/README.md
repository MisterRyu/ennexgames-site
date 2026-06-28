generate-implementation-summary.ps1

Purpose

A small PowerShell helper to append a short implementation entry to `CHANGELOG.md` and scaffold a timestamped implementation summary file under `docs/reviews/implementation/`.

Usage

Open PowerShell at the repository root and run:

```powershell
.
\scripts\generate-implementation-summary.ps1 -Title "Short summary of work" -Notes "Optional longer description and follow-up items"
```

The script will:
- Append a brief entry to `CHANGELOG.md` with a timestamp and latest commit reference.
- Create `docs/reviews/implementation/<timestamp>-implementation-summary.md` with a minimal template.

Follow-up

After running the script, commit and push the generated files:

```powershell
git add CHANGELOG.md docs/reviews/implementation/<timestamp>-implementation-summary.md
git commit -m "Add implementation summary: <Short summary>"
git push origin main
```

Notes

- This script is intentionally minimal to remain dependency-free. It requires `git` in PATH and PowerShell (Windows).
- We can extend this script to auto-populate more fields (affected files, diff summary) if desired.
