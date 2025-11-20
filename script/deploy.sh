#!/bin/bash

# ============================================
# Deploy Script cho Chainivo Blockchain
# Auto build và chạy project với PM2
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Project config
APP_NAME="chainivo-blockchain"
PORT=3000

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

# ============================================
# Validation Functions
# ============================================

check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js chưa được cài đặt!"
        print_info "Chạy script setup-environment.sh để cài đặt"
        exit 1
    fi
    
    NODE_VERSION=$(node --version)
    print_success "Node.js: $NODE_VERSION"
}

check_bun() {
    if ! command -v bun &> /dev/null; then
        print_error "Bun chưa được cài đặt!"
        print_info "Cài đặt Bun: curl -fsSL https://bun.sh/install | bash"
        exit 1
    fi
    
    BUN_VERSION=$(bun --version)
    print_success "Bun: $BUN_VERSION"
}

check_pm2() {
    if ! command -v pm2 &> /dev/null; then
        print_error "PM2 chưa được cài đặt!"
        print_info "Chạy script setup-environment.sh để cài đặt"
        exit 1
    fi
    
    PM2_VERSION=$(pm2 --version)
    print_success "PM2: $PM2_VERSION"
}

check_project_root() {
    if [ ! -f "package.json" ]; then
        print_error "Không tìm thấy package.json!"
        print_info "Vui lòng chạy script từ thư mục gốc của project"
        exit 1
    fi
    print_success "Tìm thấy package.json"
}

# ============================================
# Build Functions
# ============================================

install_dependencies() {
    print_step "Đang cài đặt dependencies..."
    
    if [ -f "bun.lockb" ] || [ -f "bun.lock" ]; then
        bun install --frozen-lockfile
    else
        bun install
    fi
    
    print_success "Dependencies đã được cài đặt thành công!"
}

build_project() {
    print_step "Đang build project..."
    
    # Xóa build cũ nếu có
    if [ -d ".next" ]; then
        print_info "Xóa build cũ..."
        rm -rf .next
    fi
    
    # Build project
    bun run build
    
    print_success "Build thành công!"
}

# ============================================
# PM2 Functions
# ============================================

create_ecosystem_config() {
    if [ ! -f "ecosystem.config.js" ]; then
        print_step "Tạo file ecosystem.config.js..."
        
        cat > ecosystem.config.js << 'EOF'
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
EOF
        
        print_success "Đã tạo ecosystem.config.js"
    else
        print_info "ecosystem.config.js đã tồn tại"
    fi
}

create_logs_dir() {
    if [ ! -d "logs" ]; then
        mkdir -p logs
        print_success "Đã tạo thư mục logs"
    fi
}

check_pm2_process() {
    pm2 list | grep -q "$APP_NAME"
    return $?
}

stop_pm2_process() {
    if check_pm2_process; then
        print_step "Đang dừng process PM2 cũ..."
        pm2 delete "$APP_NAME" || true
        print_success "Đã dừng process cũ"
    fi
}

start_pm2_process() {
    print_step "Đang khởi động ứng dụng với PM2..."
    
    if [ -f "ecosystem.config.js" ]; then
        pm2 start ecosystem.config.js
    else
        pm2 start bun --name "$APP_NAME" -- start
    fi
    
    print_success "Ứng dụng đã được khởi động thành công!"
}

save_pm2_config() {
    print_step "Lưu PM2 config..."
    pm2 save
    print_success "Đã lưu PM2 config"
}

show_pm2_status() {
    echo ""
    print_info "PM2 Process Status:"
    pm2 list
    echo ""
}

# ============================================
# Deployment Modes
# ============================================

deploy_full() {
    print_header "FULL DEPLOYMENT (Install + Build + Deploy)"
    
    check_nodejs
    check_bun
    check_pm2
    check_project_root
    
    install_dependencies
    build_project
    create_ecosystem_config
    create_logs_dir
    stop_pm2_process
    start_pm2_process
    save_pm2_config
    show_pm2_status
    
    print_header "DEPLOYMENT HOÀN THÀNH"
    print_success "Ứng dụng đang chạy tại: http://localhost:$PORT"
    print_info "Xem logs: pm2 logs $APP_NAME"
    print_info "Dừng ứng dụng: pm2 stop $APP_NAME"
    print_info "Khởi động lại: pm2 restart $APP_NAME"
}

deploy_quick() {
    print_header "QUICK DEPLOYMENT (Build + Deploy)"
    
    check_nodejs
    check_bun
    check_pm2
    check_project_root
    
    build_project
    create_ecosystem_config
    create_logs_dir
    stop_pm2_process
    start_pm2_process
    save_pm2_config
    show_pm2_status
    
    print_header "DEPLOYMENT HOÀN THÀNH"
    print_success "Ứng dụng đang chạy tại: http://localhost:$PORT"
}

deploy_restart() {
    print_header "RESTART DEPLOYMENT"
    
    check_pm2
    
    if check_pm2_process; then
        print_step "Đang khởi động lại ứng dụng..."
        pm2 restart "$APP_NAME"
        print_success "Đã khởi động lại thành công!"
    else
        print_error "Không tìm thấy process PM2: $APP_NAME"
        print_info "Chạy script với tham số 'full' để deploy mới"
        exit 1
    fi
    
    show_pm2_status
}

deploy_stop() {
    print_header "STOP DEPLOYMENT"
    
    check_pm2
    stop_pm2_process
    
    print_success "Ứng dụng đã được dừng"
}

show_logs() {
    print_header "PM2 LOGS"
    
    check_pm2
    
    if check_pm2_process; then
        pm2 logs "$APP_NAME" --lines 50
    else
        print_error "Không tìm thấy process PM2: $APP_NAME"
        exit 1
    fi
}

show_status() {
    print_header "PM2 STATUS"
    
    check_pm2
    show_pm2_status
    
    if check_pm2_process; then
        print_info "Chi tiết process:"
        pm2 describe "$APP_NAME"
    fi
}

# ============================================
# Usage
# ============================================

show_usage() {
    echo -e "${BLUE}Usage:${NC}"
    echo "  ./deploy.sh [MODE]"
    echo ""
    echo -e "${BLUE}Modes:${NC}"
    echo "  full      - Full deployment (bun install + build + deploy)"
    echo "  quick     - Quick deployment (build + deploy, skip bun install)"
    echo "  restart   - Restart PM2 process (no build)"
    echo "  stop      - Stop PM2 process"
    echo "  logs      - Show PM2 logs"
    echo "  status    - Show PM2 status"
    echo ""
    echo -e "${BLUE}Examples:${NC}"
    echo "  ./deploy.sh full     # Deployment lần đầu"
    echo "  ./deploy.sh quick    # Deploy nhanh sau khi sửa code"
    echo "  ./deploy.sh restart  # Khởi động lại ứng dụng"
    echo "  ./deploy.sh logs     # Xem logs"
}

# ============================================
# Main Execution
# ============================================

main() {
    MODE="${1:-full}"
    
    case "$MODE" in
        full)
            deploy_full
            ;;
        quick)
            deploy_quick
            ;;
        restart)
            deploy_restart
            ;;
        stop)
            deploy_stop
            ;;
        logs)
            show_logs
            ;;
        status)
            show_status
            ;;
        help|--help|-h)
            show_usage
            ;;
        *)
            print_error "Mode không hợp lệ: $MODE"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function
main "$@"

