# Setup script for LearnAI Premium Platform
Write-Host "🚀 Creating premium UI components..." -ForegroundColor Cyan

# Create folders
$folders = @(
    "src/components/ui",
    "src/components/layout",
    "src/components/auth",
    "src/components/dashboard",
    "src/components/learning",
    "src/components/analytics",
    "src/components/teacher",
    "src/components/admin"
)

foreach ($folder in $folders) {
    New-Item -ItemType Directory -Force -Path $folder | Out-Null
}

Write-Host "✅ Folders created!" -ForegroundColor Green
Write-Host "📝 Now manually create the component files from the provided code" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. I'll provide each component file separately" -ForegroundColor White
Write-Host "2. Copy and paste into the correct location" -ForegroundColor White
Write-Host "3. Save and the dev server will auto-reload" -ForegroundColor White