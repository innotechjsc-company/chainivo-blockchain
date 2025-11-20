#!/bin/bash

# ============================================
# Setup Script cho Chainivo Blockchain
# Auto install: Git, Node.js 22.18, Bun, PM2
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Node.js version target
NODE_VERSION="22.18.0"

# ============================================
# Helper Functions
# ============================================

print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

print_step() {
    echo -e "${BLUE}→ $1${NC}"
}

# Kiểm tra OS
detect_os() {
    if [[ "$OSTYPE" == "darwin"* ]]; then
        OS="macos"
        print_info "Detected OS: macOS"
    elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
        OS="linux"
        print_info "Detected OS: Linux"
    else
        print_error "Unsupported OS: $OSTYPE"
        exit 1
    fi
}

# ============================================
# Git Installation
# ============================================

check_git() {
    if command -v git &> /dev/null; then
        GIT_VERSION=$(git --version | awk '{print $3}')
        print_success "Git đã được cài đặt (version: $GIT_VERSION)"
        return 0
    else
        print_info "Git chưa được cài đặt"
        return 1
    fi
}

install_git() {
    print_step "Đang cài đặt Git..."
    
    if [[ "$OS" == "macos" ]]; then
        # Kiểm tra Homebrew
        if ! command -v brew &> /dev/null; then
            print_error "Homebrew chưa được cài đặt. Vui lòng cài Homebrew trước:"
            print_info "https://brew.sh"
            exit 1
        fi
        brew install git
    elif [[ "$OS" == "linux" ]]; then
        if command -v apt-get &> /dev/null; then
            sudo apt-get update
            sudo apt-get install -y git
        elif command -v yum &> /dev/null; then
            sudo yum install -y git
        else
            print_error "Package manager không được hỗ trợ"
            exit 1
        fi
    fi
    
    print_success "Git đã được cài đặt thành công!"
}

# ============================================
# NVM & Node.js Installation
# ============================================

check_nvm() {
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        NVM_VERSION=$(nvm --version 2>/dev/null || echo "unknown")
        print_success "NVM đã được cài đặt (version: $NVM_VERSION)"
        return 0
    else
        print_info "NVM chưa được cài đặt"
        return 1
    fi
}

install_nvm() {
    print_step "Đang cài đặt NVM..."
    
    # Download và cài đặt NVM
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
    
    # Source NVM
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # Add to shell profile
    SHELL_PROFILE=""
    if [ -f "$HOME/.zshrc" ]; then
        SHELL_PROFILE="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
        SHELL_PROFILE="$HOME/.bash_profile"
    fi
    
    if [ -n "$SHELL_PROFILE" ]; then
        if ! grep -q "NVM_DIR" "$SHELL_PROFILE"; then
            echo '' >> "$SHELL_PROFILE"
            echo 'export NVM_DIR="$HOME/.nvm"' >> "$SHELL_PROFILE"
            echo '[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm' >> "$SHELL_PROFILE"
            echo '[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion' >> "$SHELL_PROFILE"
        fi
    fi
    
    print_success "NVM đã được cài đặt thành công!"
}

check_nodejs() {
    if command -v node &> /dev/null; then
        CURRENT_NODE_VERSION=$(node --version | sed 's/v//')
        if [ "$CURRENT_NODE_VERSION" == "$NODE_VERSION" ]; then
            print_success "Node.js $NODE_VERSION đã được cài đặt"
            return 0
        else
            print_info "Node.js version hiện tại: $CURRENT_NODE_VERSION (cần: $NODE_VERSION)"
            return 1
        fi
    else
        print_info "Node.js chưa được cài đặt"
        return 1
    fi
}

install_nodejs() {
    print_step "Đang cài đặt Node.js $NODE_VERSION..."
    
    # Source NVM nếu chưa load
    if ! command -v nvm &> /dev/null; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    # Cài đặt Node.js version cụ thể
    nvm install "$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
    
    print_success "Node.js $NODE_VERSION đã được cài đặt thành công!"
    
    # Hiển thị thông tin
    NODE_VERSION_INSTALLED=$(node --version)
    NPM_VERSION=$(npm --version)
    print_info "Node.js: $NODE_VERSION_INSTALLED"
    print_info "NPM: $NPM_VERSION"
}

# ============================================
# Bun Installation
# ============================================

check_bun() {
    if command -v bun &> /dev/null; then
        BUN_VERSION=$(bun --version)
        print_success "Bun đã được cài đặt (version: $BUN_VERSION)"
        return 0
    else
        print_info "Bun chưa được cài đặt"
        return 1
    fi
}

install_bun() {
    print_step "Đang cài đặt Bun..."
    
    # Download và cài đặt Bun
    curl -fsSL https://bun.sh/install | bash
    
    # Source Bun
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    # Add to shell profile
    SHELL_PROFILE=""
    if [ -f "$HOME/.zshrc" ]; then
        SHELL_PROFILE="$HOME/.zshrc"
    elif [ -f "$HOME/.bashrc" ]; then
        SHELL_PROFILE="$HOME/.bashrc"
    elif [ -f "$HOME/.bash_profile" ]; then
        SHELL_PROFILE="$HOME/.bash_profile"
    fi
    
    if [ -n "$SHELL_PROFILE" ]; then
        if ! grep -q "BUN_INSTALL" "$SHELL_PROFILE"; then
            echo '' >> "$SHELL_PROFILE"
            echo '# Bun' >> "$SHELL_PROFILE"
            echo 'export BUN_INSTALL="$HOME/.bun"' >> "$SHELL_PROFILE"
            echo 'export PATH="$BUN_INSTALL/bin:$PATH"' >> "$SHELL_PROFILE"
        fi
    fi
    
    print_success "Bun đã được cài đặt thành công!"
}

# ============================================
# PM2 Installation
# ============================================

check_pm2() {
    if command -v pm2 &> /dev/null; then
        PM2_VERSION=$(pm2 --version)
        print_success "PM2 đã được cài đặt (version: $PM2_VERSION)"
        return 0
    else
        print_info "PM2 chưa được cài đặt"
        return 1
    fi
}

install_pm2() {
    print_step "Đang cài đặt PM2..."
    
    npm install -g pm2
    
    print_success "PM2 đã được cài đặt thành công!"
    
    # Setup PM2 startup
    print_step "Cấu hình PM2 startup..."
    pm2 startup || true
}

# ============================================
# Main Execution
# ============================================

main() {
    print_header "CHAINIVO BLOCKCHAIN - ENVIRONMENT SETUP"
    
    # Detect OS
    detect_os
    
    # ====== GIT ======
    print_header "1. KIỂM TRA GIT"
    if ! check_git; then
        install_git
    fi
    
    # ====== NVM ======
    print_header "2. KIỂM TRA NVM"
    if ! check_nvm; then
        install_nvm
    fi
    
    # Source NVM for subsequent commands
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # ====== NODE.JS ======
    print_header "3. KIỂM TRA NODE.JS"
    if ! check_nodejs; then
        install_nodejs
    fi
    
    # ====== BUN ======
    print_header "4. KIỂM TRA BUN"
    if ! check_bun; then
        install_bun
    fi
    
    # Source Bun for subsequent commands
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    # ====== PM2 ======
    print_header "5. KIỂM TRA PM2"
    if ! check_pm2; then
        install_pm2
    fi
    
    # ====== SUMMARY ======
    print_header "HOÀN THÀNH CÀI ĐẶT"
    echo ""
    print_success "Tất cả các dependencies đã được cài đặt thành công!"
    echo ""
    print_info "Thông tin version:"
    echo "  • Git:     $(git --version | awk '{print $3}')"
    echo "  • Node.js: $(node --version)"
    echo "  • NPM:     $(npm --version)"
    echo "  • Bun:     $(bun --version)"
    echo "  • PM2:     $(pm2 --version)"
    echo ""
    print_info "Lưu ý: Bạn có thể cần restart terminal để sử dụng NVM và Bun"
    print_info "Hoặc chạy: source ~/.zshrc (hoặc ~/.bashrc)"
    echo ""
}

# Run main function
main

