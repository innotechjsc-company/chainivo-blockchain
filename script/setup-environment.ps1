# ============================================
# Setup Script cho Chainivo Blockchain (Windows)
# Auto install: Git, Node.js 22.18, Bun, PM2
# ============================================

$ErrorActionPreference = "Stop"

# Node.js version target
$NODE_VERSION = "22.18.0"

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
# Git Installation
# ============================================

function Test-Git {
    try {
        $gitVersion = (git --version 2>$null) -split ' ' | Select-Object -Last 1
        if ($gitVersion) {
            Print-Success "Git đã được cài đặt (version: $gitVersion)"
            return $true
        }
    } catch {
        Print-Info "Git chưa được cài đặt"
        return $false
    }
}

function Install-Git {
    Print-Step "Đang cài đặt Git..."
    
    # Kiểm tra Chocolatey
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Print-Error "Chocolatey chưa được cài đặt. Vui lòng cài Chocolatey trước:"
        Print-Info "https://chocolatey.org/install"
        Print-Info "Hoặc tải Git từ: https://git-scm.com/download/win"
        exit 1
    }
    
    choco install git -y
    
    Print-Success "Git đã được cài đặt thành công!"
}

# ============================================
# NVM & Node.js Installation
# ============================================

function Test-NVM {
    $nvmPath = "$env:USERPROFILE\.nvm"
    if (Test-Path "$nvmPath\nvm.exe") {
        $nvmVersion = & "$nvmPath\nvm.exe" version 2>$null
        if ($nvmVersion) {
            Print-Success "NVM đã được cài đặt (version: $nvmVersion)"
            return $true
        }
    }
    Print-Info "NVM chưa được cài đặt"
    return $false
}

function Install-NVM {
    Print-Step "Đang cài đặt NVM..."
    
    # Kiểm tra Chocolatey
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Print-Error "Chocolatey chưa được cài đặt. Vui lòng cài Chocolatey trước:"
        Print-Info "https://chocolatey.org/install"
        Print-Info "Hoặc tải NVM từ: https://github.com/coreybutler/nvm-windows/releases"
        exit 1
    }
    
    choco install nvm -y
    
    # Refresh environment variables
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Print-Success "NVM đã được cài đặt thành công!"
    Print-Info "Vui lòng restart terminal sau khi cài đặt NVM"
}

function Test-NodeJS {
    try {
        $nodeVersion = (node --version 2>$null) -replace 'v', ''
        if ($nodeVersion) {
            if ($nodeVersion -eq $NODE_VERSION) {
                Print-Success "Node.js $NODE_VERSION đã được cài đặt"
                return $true
            } else {
                Print-Info "Node.js version hiện tại: $nodeVersion (cần: $NODE_VERSION)"
                return $false
            }
        }
    } catch {
        Print-Info "Node.js chưa được cài đặt"
        return $false
    }
}

function Install-NodeJS {
    Print-Step "Đang cài đặt Node.js $NODE_VERSION..."
    
    $nvmPath = "$env:USERPROFILE\.nvm"
    if (-not (Test-Path "$nvmPath\nvm.exe")) {
        Print-Error "NVM chưa được cài đặt. Vui lòng cài NVM trước."
        exit 1
    }
    
    # Cài đặt Node.js version cụ thể
    & "$nvmPath\nvm.exe" install $NODE_VERSION
    & "$nvmPath\nvm.exe" use $NODE_VERSION
    & "$nvmPath\nvm.exe" alias default $NODE_VERSION
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Print-Success "Node.js $NODE_VERSION đã được cài đặt thành công!"
    
    # Hiển thị thông tin
    $nodeVersionInstalled = node --version
    $npmVersion = npm --version
    Print-Info "Node.js: $nodeVersionInstalled"
    Print-Info "NPM: $npmVersion"
}

# ============================================
# Bun Installation
# ============================================

function Test-Bun {
    try {
        $bunVersion = bun --version 2>$null
        if ($bunVersion) {
            Print-Success "Bun đã được cài đặt (version: $bunVersion)"
            return $true
        }
    } catch {
        Print-Info "Bun chưa được cài đặt"
        return $false
    }
}

function Install-Bun {
    Print-Step "Đang cài đặt Bun..."
    
    # Download và cài đặt Bun cho Windows
    $bunInstaller = "$env:TEMP\bun-install.ps1"
    Invoke-WebRequest -Uri "https://bun.sh/install" -OutFile $bunInstaller
    & powershell -ExecutionPolicy Bypass -File $bunInstaller
    
    # Refresh PATH
    $env:Path = [System.Environment]::GetEnvironmentVariable("Path", "Machine") + ";" + [System.Environment]::GetEnvironmentVariable("Path", "User")
    
    Print-Success "Bun đã được cài đặt thành công!"
    Print-Info "Vui lòng restart terminal sau khi cài đặt Bun"
}

# ============================================
# PM2 Installation
# ============================================

function Test-PM2 {
    try {
        $pm2Version = pm2 --version 2>$null
        if ($pm2Version) {
            Print-Success "PM2 đã được cài đặt (version: $pm2Version)"
            return $true
        }
    } catch {
        Print-Info "PM2 chưa được cài đặt"
        return $false
    }
}

function Install-PM2 {
    Print-Step "Đang cài đặt PM2..."
    
    npm install -g pm2
    
    Print-Success "PM2 đã được cài đặt thành công!"
    
    # Setup PM2 startup
    Print-Step "Cấu hình PM2 startup..."
    try {
        pm2 startup | Out-Null
    } catch {
        Print-Info "PM2 startup có thể cần quyền administrator"
    }
}

# ============================================
# Main Execution
# ============================================

function Main {
    Print-Header "CHAINIVO BLOCKCHAIN - ENVIRONMENT SETUP"
    
    # ====== GIT ======
    Print-Header "1. KIỂM TRA GIT"
    if (-not (Test-Git)) {
        Install-Git
    }
    
    # ====== NVM ======
    Print-Header "2. KIỂM TRA NVM"
    if (-not (Test-NVM)) {
        Install-NVM
    }
    
    # ====== NODE.JS ======
    Print-Header "3. KIỂM TRA NODE.JS"
    if (-not (Test-NodeJS)) {
        Install-NodeJS
    }
    
    # ====== BUN ======
    Print-Header "4. KIỂM TRA BUN"
    if (-not (Test-Bun)) {
        Install-Bun
    }
    
    # ====== PM2 ======
    Print-Header "5. KIỂM TRA PM2"
    if (-not (Test-PM2)) {
        Install-PM2
    }
    
    # ====== SUMMARY ======
    Print-Header "HOÀN THÀNH CÀI ĐẶT"
    Write-Host ""
    Print-Success "Tất cả các dependencies đã được cài đặt thành công!"
    Write-Host ""
    Print-Info "Thông tin version:"
    Write-Host "  • Git:     $((git --version) -split ' ' | Select-Object -Last 1)"
    Write-Host "  • Node.js: $(node --version)"
    Write-Host "  • NPM:     $(npm --version)"
    Write-Host "  • Bun:     $(bun --version)"
    Write-Host "  • PM2:     $(pm2 --version)"
    Write-Host ""
    Print-Info "Lưu ý: Bạn có thể cần restart terminal để sử dụng NVM và Bun"
    Write-Host ""
}

# Run main function
Main

