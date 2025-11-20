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

# Kiem tra OS
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
        print_success "Git da duoc cai dat (version: $GIT_VERSION)"
        return 0
    else
        print_info "Git chua duoc cai dat"
        return 1
    fi
}

install_git() {
    print_step "Dang cai dat Git..."
    
    if [[ "$OS" == "macos" ]]; then
        # Kiem tra Homebrew
        if ! command -v brew &> /dev/null; then
            print_error "Homebrew chua duoc cai dat. Vui long cai Homebrew truoc:"
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
            print_error "Package manager khong duoc ho tro"
            exit 1
        fi
    fi
    
    print_success "Git da duoc cai dat thanh cong!"
}

# ============================================
# NVM & Node.js Installation
# ============================================

check_nvm() {
    if [ -s "$HOME/.nvm/nvm.sh" ]; then
        source "$HOME/.nvm/nvm.sh"
        NVM_VERSION=$(nvm --version 2>/dev/null || echo "unknown")
        print_success "NVM da duoc cai dat (version: $NVM_VERSION)"
        return 0
    else
        print_info "NVM chua duoc cai dat"
        return 1
    fi
}

install_nvm() {
    print_step "Dang cai dat NVM..."
    
    # Download va cai dat NVM
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
    
    print_success "NVM da duoc cai dat thanh cong!"
}

check_nodejs() {
    if command -v node &> /dev/null; then
        CURRENT_NODE_VERSION=$(node --version | sed 's/v//')
        if [ "$CURRENT_NODE_VERSION" == "$NODE_VERSION" ]; then
            print_success "Node.js $NODE_VERSION da duoc cai dat"
            return 0
        else
            print_info "Node.js version hien tai: $CURRENT_NODE_VERSION (can: $NODE_VERSION)"
            return 1
        fi
    else
        print_info "Node.js chua duoc cai dat"
        return 1
    fi
}

install_nodejs() {
    print_step "Dang cai dat Node.js $NODE_VERSION..."
    
    # Source NVM neu chua load
    if ! command -v nvm &> /dev/null; then
        export NVM_DIR="$HOME/.nvm"
        [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    fi
    
    # Cai dat Node.js version cu the
    nvm install "$NODE_VERSION"
    nvm use "$NODE_VERSION"
    nvm alias default "$NODE_VERSION"
    
    print_success "Node.js $NODE_VERSION da duoc cai dat thanh cong!"
    
    # Hien thi thong tin
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
        print_success "Bun da duoc cai dat (version: $BUN_VERSION)"
        return 0
    else
        print_info "Bun chua duoc cai dat"
        return 1
    fi
}

install_bun() {
    print_step "Dang cai dat Bun..."
    
    # Download va cai dat Bun
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
    
    print_success "Bun da duoc cai dat thanh cong!"
}

# ============================================
# PM2 Installation
# ============================================

check_pm2() {
    if command -v pm2 &> /dev/null; then
        PM2_VERSION=$(pm2 --version)
        print_success "PM2 da duoc cai dat (version: $PM2_VERSION)"
        return 0
    else
        print_info "PM2 chua duoc cai dat"
        return 1
    fi
}

install_pm2() {
    print_step "Dang cai dat PM2..."
    
    npm install -g pm2
    
    print_success "PM2 da duoc cai dat thanh cong!"
    
    # Setup PM2 startup
    print_step "Cau hinh PM2 startup..."
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
    print_header "1. KIEM TRA GIT"
    if ! check_git; then
        install_git
    fi
    
    # ====== NVM ======
    print_header "2. KIEM TRA NVM"
    if ! check_nvm; then
        install_nvm
    fi
    
    # Source NVM for subsequent commands
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    
    # ====== NODE.JS ======
    print_header "3. KIEM TRA NODE.JS"
    if ! check_nodejs; then
        install_nodejs
    fi
    
    # ====== BUN ======
    print_header "4. KIEM TRA BUN"
    if ! check_bun; then
        install_bun
    fi
    
    # Source Bun for subsequent commands
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    
    # ====== PM2 ======
    print_header "5. KIEM TRA PM2"
    if ! check_pm2; then
        install_pm2
    fi
    
    # ====== SUMMARY ======
    print_header "HOAN THANH CAI DAT"
    echo ""
    print_success "Tat ca cac dependencies da duoc cai dat thanh cong!"
    echo ""
    print_info "Thong tin version:"
    echo "  • Git:     $(git --version | awk '{print $3}')"
    echo "  • Node.js: $(node --version)"
    echo "  • NPM:     $(npm --version)"
    echo "  • Bun:     $(bun --version)"
    echo "  • PM2:     $(pm2 --version)"
    echo ""
    print_info "Luu y: Ban co the can restart terminal de su dung NVM va Bun"
    print_info "Hoac chay: source ~/.zshrc (hoac ~/.bashrc)"
    echo ""
}

# Run main function
main

