# Zone 7 district sync — scheduled-task entry point (weekly, local fallback).
# The primary automation is the GitHub Action (.github/workflows/district-sync.yml).
# Logs to sync/sync-scheduled.log. Uses the api-anything session of the
# current Windows user, else district credentials (see sync/SYNC-README).
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location (Join-Path $dir 'sync')
$stamp = Get-Date -Format 'yyyy-MM-dd HH:mm'
Add-Content sync-scheduled.log "===== sync start $stamp ====="
python3 sync_district.py >> sync-scheduled.log 2>&1
Add-Content sync-scheduled.log "===== sync end (exit $LASTEXITCODE) ====="
