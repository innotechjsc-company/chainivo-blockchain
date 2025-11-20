# ============================================
# Deploy Script cho Chainivo Blockchain (Windows)
# Auto build và chạy project với PM2
# ============================================

param(
    [Parameter(Position=0)]
    [string]$Mode = "full"
)

$ErrorActionPreference = "Stop"

# Project config
$APP_NAME = "chainivo-blockchain"
$PORT = 3000

# ============================================
# Helper Functions
# ============================================

function Print-Header {
    param([string]$Message)
    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host $Message -ForegroundColor Cyan
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host ""
}

function Print-Success {
    param([string]$Message)
    Write-Host "✓ $Message" -ForegroundColor Green
}

function Print-Error {
    param([string]$Message)
    Write-Host "✗ $Message" -ForegroundColor Red
}

function Print-Info {
    param([string]$Message)
    Write-Host "ℹ $Message" -ForegroundColor Yellow
}

function Print-Step {
    param([string]$Message)
    Write-Host "→ $Message" -ForegroundColor Cyan
}

# ============================================
# Validation Functions
# ============================================

function Test-NodeJS {
    try {
        $nodeVersion = node --version 2>$null
        if ($nodeVersion) {
            Print-Success "Node.js: $nodeVersion"
            return $true
        }
    } catch {
        Print-Error "Node.js chưa được cài đặt!"
        Print-Info "Chạy script setup-environment.ps1 để cài đặt"
        exit 1
    }
}

function Test-Bun {
    try {
        $bunVersion = bun --version 2>$null
        if ($bunVersion) {
            Print-Success "Bun: $bunVersion"
            return $true
        }
    } catch {
        Print-Error "Bun chưa được cài đặt!"
        Print-Info "Cài đặt Bun: powershell -c `"irm bun.sh/install.ps1 | iex`""
        exit 1
    }
}

function Test-PM2 {
    try {
        $pm2Version = pm2 --version 2>$null
        if ($pm2Version) {
            Print-Success "PM2: $pm2Version"
            return $true
        }
    } catch {
        Print-Error "PM2 chưa được cài đặt!"
        Print-Info "Chạy script setup-environment.ps1 để cài đặt"
        exit 1
    }
}

function Test-ProjectRoot {
    if (-not (Test-Path "package.json")) {
        Print-Error "Không tìm thấy package.json!"
        Print-Info "Vui lòng chạy script từ thư mục gốc của project"
        exit 1
    }
    Print-Success "Tìm thấy package.json"
}

# ============================================
# Build Functions
# ============================================

function Install-Dependencies {
    Print-Step "Đang cài đặt dependencies..."
    
    if ((Test-Path "bun.lockb") -or (Test-Path "bun.lock")) {
        bun install --frozen-lockfile
    } else {
        bun install
    }
    
    Print-Success "Dependencies đã được cài đặt thành công!"
}

function Build-Project {
    Print-Step "Đang build project..."
    
    # Xóa build cũ nếu có
    if (Test-Path ".next") {
        Print-Info "Xóa build cũ..."
        Remove-Item -Recurse -Force .next
    }
    
    # Build project
    bun run build
    
    Print-Success "Build thành công!"
}

# ============================================
# PM2 Functions
# ============================================

function New-EcosystemConfig {
    if (-not (Test-Path "ecosystem.config.js")) {
        Print-Step "Tạo file ecosystem.config.js..."
        
        $ecosystemConfig = @"
module.exports = {
  apps: [
    {
      name: 'chainivo-blockchain',
      script: 'bun',
      args: 'start',
      cwd: './',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      error_file: './logs/pm2-error.log',
      out_file: './logs/pm2-out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      time: true
    }
  ]
};
"@
        
        $ecosystemConfig | Out-File -FilePath "ecosystem.config.js" -Encoding utf8
        
        Print-Success "Đã tạo ecosystem.config.js"
    } else {
        Print-Info "ecosystem.config.js đã tồn tại"
    }
}

function New-LogsDir {
    if (-not (Test-Path "logs")) {
        New-Item -ItemType Directory -Path "logs" | Out-Null
        Print-Success "Đã tạo thư mục logs"
    }
}

function Test-PM2Process {
    $pm2List = pm2 list 2>$null
    return $pm2List -match $APP_NAME
}

function Stop-PM2Process {
    if (Test-PM2Process) {
        Print-Step "Đang dừng process PM2 cũ..."
        pm2 delete $APP_NAME 2>$null
        Print-Success "Đã dừng process cũ"
    }
}

function Start-PM2Process {
    Print-Step "Đang khởi động ứng dụng với PM2..."
    
    if (Test-Path "ecosystem.config.js") {
        pm2 start ecosystem.config.js
    } else {
        pm2 start bun --name $APP_NAME -- start
    }
    
    Print-Success "Ứng dụng đã được khởi động thành công!"
}

function Save-PM2Config {
    Print-Step "Lưu PM2 config..."
    pm2 save
    Print-Success "Đã lưu PM2 config"
}

function Show-PM2Status {
    Write-Host ""
    Print-Info "PM2 Process Status:"
    pm2 list
    Write-Host ""
}

# ============================================
# Deployment Modes
# ============================================

function Deploy-Full {
    Print-Header "FULL DEPLOYMENT (Install + Build + Deploy)"
    
    Test-NodeJS
    Test-Bun
    Test-PM2
    Test-ProjectRoot
    
    Install-Dependencies
    Build-Project
    New-EcosystemConfig
    New-LogsDir
    Stop-PM2Process
    Start-PM2Process
    Save-PM2Config
    Show-PM2Status
    
    Print-Header "DEPLOYMENT HOÀN THÀNH"
    Print-Success "Ứng dụng đang chạy tại: http://localhost:$PORT"
    Print-Info "Xem logs: pm2 logs $APP_NAME"
    Print-Info "Dừng ứng dụng: pm2 stop $APP_NAME"
    Print-Info "Khởi động lại: pm2 restart $APP_NAME"
}

function Deploy-Quick {
    Print-Header "QUICK DEPLOYMENT (Build + Deploy)"
    
    Test-NodeJS
    Test-Bun
    Test-PM2
    Test-ProjectRoot
    
    Build-Project
    New-EcosystemConfig
    New-LogsDir
    Stop-PM2Process
    Start-PM2Process
    Save-PM2Config
    Show-PM2Status
    
    Print-Header "DEPLOYMENT HOÀN THÀNH"
    Print-Success "Ứng dụng đang chạy tại: http://localhost:$PORT"
}

function Deploy-Restart {
    Print-Header "RESTART DEPLOYMENT"
    
    Test-PM2
    
    if (Test-PM2Process) {
        Print-Step "Đang khởi động lại ứng dụng..."
        pm2 restart $APP_NAME
        Print-Success "Đã khởi động lại thành công!"
    } else {
        Print-Error "Không tìm thấy process PM2: $APP_NAME"
        Print-Info "Chạy script với tham số 'full' để deploy mới"
        exit 1
    }
    
    Show-PM2Status
}

function Deploy-Stop {
    Print-Header "STOP DEPLOYMENT"
    
    Test-PM2
    Stop-PM2Process
    
    Print-Success "Ứng dụng đã được dừng"
}

function Show-Logs {
    Print-Header "PM2 LOGS"
    
    Test-PM2
    
    if (Test-PM2Process) {
        pm2 logs $APP_NAME --lines 50
    } else {
        Print-Error "Không tìm thấy process PM2: $APP_NAME"
        exit 1
    }
}

function Show-Status {
    Print-Header "PM2 STATUS"
    
    Test-PM2
    Show-PM2Status
    
    if (Test-PM2Process) {
        Print-Info "Chi tiết process:"
        pm2 describe $APP_NAME
    }
}

# ============================================
# Usage
# ============================================

function Show-Usage {
    Write-Host "Usage:" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 [MODE]"
    Write-Host ""
    Write-Host "Modes:" -ForegroundColor Cyan
    Write-Host "  full      - Full deployment (bun install + build + deploy)"
    Write-Host "  quick     - Quick deployment (build + deploy, skip bun install)"
    Write-Host "  restart   - Restart PM2 process (no build)"
    Write-Host "  stop      - Stop PM2 process"
    Write-Host "  logs      - Show PM2 logs"
    Write-Host "  status    - Show PM2 status"
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor Cyan
    Write-Host "  .\deploy.ps1 full     # Deployment lần đầu"
    Write-Host "  .\deploy.ps1 quick    # Deploy nhanh sau khi sửa code"
    Write-Host "  .\deploy.ps1 restart  # Khởi động lại ứng dụng"
    Write-Host "  .\deploy.ps1 logs     # Xem logs"
}

# ============================================
# Main Execution
# ============================================

switch ($Mode.ToLower()) {
    "full" {
        Deploy-Full
    }
    "quick" {
        Deploy-Quick
    }
    "restart" {
        Deploy-Restart
    }
    "stop" {
        Deploy-Stop
    }
    "logs" {
        Show-Logs
    }
    "status" {
        Show-Status
    }
    { $_ -in "help", "--help", "-h" } {
        Show-Usage
    }
    default {
        Print-Error "Mode không hợp lệ: $Mode"
        Write-Host ""
        Show-Usage
        exit 1
    }
}

