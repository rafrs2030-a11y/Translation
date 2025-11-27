# سكربت PowerShell لتشغيل إرسال الإيميلات الترحيبية
$ErrorActionPreference = "Continue"

Write-Host "🚀 بدء تشغيل سكربت إرسال الإيميلات الترحيبية..." -ForegroundColor Cyan
Write-Host ""

# الانتقال إلى مجلد المشروع
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
$projectRoot = Split-Path -Parent $scriptPath
Set-Location $projectRoot

# تشغيل السكربت
Write-Host "📧 تشغيل السكربت..." -ForegroundColor Yellow
Write-Host ""

node scripts/send-welcome-email-to-all-users.js

Write-Host ""
Write-Host "✨ انتهى التنفيذ." -ForegroundColor Green

