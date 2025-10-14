# Start Server Script pentru PowerShell
# Platformă Terapie Pro Bono ATSI

Write-Host "================================================" -ForegroundColor Cyan
Write-Host "  Pornire Server Local - ATSI Platform" -ForegroundColor Cyan
Write-Host "================================================" -ForegroundColor Cyan
Write-Host ""

# Check if Python is available
$pythonCmd = Get-Command python -ErrorAction SilentlyContinue
if (-not $pythonCmd) {
    Write-Host "ERROR: Python nu este instalat sau nu este în PATH!" -ForegroundColor Red
    Write-Host "Te rugăm să instalezi Python de la: https://www.python.org/downloads/" -ForegroundColor Yellow
    exit 1
}

Write-Host "Python găsit: $($pythonCmd.Version)" -ForegroundColor Green
Write-Host ""

# Navigate to project directory
$scriptPath = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $scriptPath

Write-Host "Director curent: $scriptPath" -ForegroundColor Gray
Write-Host ""

# Start server
Write-Host "Pornire server HTTP pe portul 8000..." -ForegroundColor Yellow
Write-Host ""
Write-Host "================================================" -ForegroundColor Green
Write-Host "  Server pornit cu succes!" -ForegroundColor Green
Write-Host "================================================" -ForegroundColor Green
Write-Host ""
Write-Host "  Accesează aplicația la: http://localhost:8000" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Apasă Ctrl+C pentru a opri serverul" -ForegroundColor Gray
Write-Host ""

# Start Python HTTP server
python -m http.server 8000

