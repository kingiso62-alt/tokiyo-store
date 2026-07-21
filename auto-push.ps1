#!/usr/bin/env pwsh
# ============================================
# TOKIYO STORE - Auto Git Push Script
# Waxay si toos ah u push garayaa GitHub-ka
# marka isbeddel kasta oo code-ka ku dhaco
# ============================================

$projectRoot = "c:\Users\hp\Desktop\TOKIYO STORE"
$token = $env:GITHUB_TOKEN  # Set this in your environment: $env:GITHUB_TOKEN = "your_token"
$repoUrl = "https://kingiso62-alt:$token@github.com/kingiso62-alt/tokiyo-store.git"
$branch = "main"
$watchPath = $projectRoot
$debounceSeconds = 3

if (-not $token) {
    Write-Host "❌ TOKEN LAMA HELIN! Marka hore ku run garee:" -ForegroundColor Red
    Write-Host '   $env:GITHUB_TOKEN = "ghp_..."' -ForegroundColor Yellow
    Write-Host "Kadibna script-kan mar labaad bilow." -ForegroundColor Yellow
    exit 1
}

Write-Host "🚀 TOKIYO STORE Auto-Push Started!" -ForegroundColor Cyan
Write-Host "📁 Watching: $watchPath" -ForegroundColor Yellow
Write-Host "🔗 Repo: github.com/kingiso62-alt/tokiyo-store" -ForegroundColor Green
Write-Host "⏳ Debounce: ${debounceSeconds}s after last change" -ForegroundColor Gray
Write-Host "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━" -ForegroundColor DarkGray
Write-Host "Press Ctrl+C to stop." -ForegroundColor Red
Write-Host ""

# File system watcher
$watcher = New-Object System.IO.FileSystemWatcher
$watcher.Path = $watchPath
$watcher.Filter = "*.*"
$watcher.IncludeSubdirectories = $true
$watcher.NotifyFilter = [System.IO.NotifyFilters]::LastWrite -bor [System.IO.NotifyFilters]::FileName

# Exclude patterns
$excludePatterns = @("node_modules", ".git", "dist", ".vite", "*.log")

$lastEventTime = [DateTime]::MinValue
$timer = $null

function Should-Exclude($path) {
    foreach ($pattern in $excludePatterns) {
        if ($path -like "*$pattern*") { return $true }
    }
    return $false
}

function Do-Push {
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
    Write-Host ""
    Write-Host "[$timestamp] 📝 Isbeddel ayaa la ogaaday..." -ForegroundColor Yellow
    
    Set-Location $projectRoot
    
    # Stage all changes
    git add . 2>&1 | Out-Null
    
    # Check if there's anything to commit
    $status = git status --porcelain
    if (-not $status) {
        Write-Host "  ⚪ Wax isbeddel ah kuma jiro, push loo baahna" -ForegroundColor Gray
        return
    }
    
    # Commit
    $commitMsg = "Auto-update: $timestamp"
    git commit -m $commitMsg 2>&1 | Out-Null
    Write-Host "  ✅ Commit: $commitMsg" -ForegroundColor Green
    
    # Push
    Write-Host "  ⬆️  GitHub-ka waa la push garayaa..." -ForegroundColor Cyan
    $result = git push $repoUrl $branch 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  🎉 GUUL! GitHub + Vercel ayaa hadda update ah!" -ForegroundColor Green
        Write-Host "  🌐 https://github.com/kingiso62-alt/tokiyo-store" -ForegroundColor Blue
    } else {
        Write-Host "  ❌ Push-ku wuu ku guul daray: $result" -ForegroundColor Red
    }
}

# Watch events
$action = {
    $path = $Event.SourceEventArgs.FullPath
    $changeType = $Event.SourceEventArgs.ChangeType
    
    if (Should-Exclude $path) { return }
    
    $global:lastEventTime = [DateTime]::Now
}

Register-ObjectEvent $watcher "Changed" -Action $action | Out-Null
Register-ObjectEvent $watcher "Created" -Action $action | Out-Null
Register-ObjectEvent $watcher "Deleted" -Action $action | Out-Null
Register-ObjectEvent $watcher "Renamed" -Action $action | Out-Null

$watcher.EnableRaisingEvents = $true

# Main loop — debounce
try {
    while ($true) {
        Start-Sleep -Seconds 1
        
        if ($lastEventTime -ne [DateTime]::MinValue) {
            $elapsed = ([DateTime]::Now - $lastEventTime).TotalSeconds
            if ($elapsed -ge $debounceSeconds) {
                $global:lastEventTime = [DateTime]::MinValue
                Do-Push
            }
        }
    }
} finally {
    $watcher.EnableRaisingEvents = $false
    $watcher.Dispose()
    Write-Host "Auto-push stopped." -ForegroundColor Red
}
