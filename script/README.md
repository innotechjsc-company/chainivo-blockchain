# Chainivo Blockchain - Scripts

Thư mục chứa các script tự động hóa cho việc setup và deploy dự án.

## 📋 Danh sách Scripts

### 1. `setup-environment.sh`
Script tự động kiểm tra và cài đặt môi trường development.

**Chức năng:**
- ✅ Kiểm tra và cài đặt Git
- ✅ Kiểm tra và cài đặt NVM (Node Version Manager)
- ✅ Kiểm tra và cài đặt Node.js 22.18.0
- ✅ Kiểm tra và cài đặt Bun (JavaScript Runtime & Package Manager)
- ✅ Kiểm tra và cài đặt PM2 (Process Manager)

**Cách sử dụng:**
```bash
cd /path/to/chainivo-blockchain
./script/setup-environment.sh
```

**Sau khi chạy:**
```bash
# Restart terminal hoặc chạy:
source ~/.zshrc
# hoặc
source ~/.bashrc
```

---

### 2. `deploy.sh`
Script tự động build và deploy dự án với PM2 (sử dụng Bun).

**Các chế độ:**

#### a) Full Deployment (Lần đầu tiên)
```bash
./script/deploy.sh full
```
- Cài đặt dependencies (`bun install`)
- Build project (`bun run build`)
- Tạo ecosystem.config.js
- Deploy với PM2

#### b) Quick Deployment (Sau khi sửa code)
```bash
./script/deploy.sh quick
```
- Build project
- Deploy với PM2
- ⚡ Nhanh hơn vì bỏ qua `bun install`

#### c) Restart (Không build lại)
```bash
./script/deploy.sh restart
```
- Khởi động lại PM2 process
- ⚡ Nhanh nhất, không build lại

#### d) Stop
```bash
./script/deploy.sh stop
```
- Dừng PM2 process

#### e) Logs
```bash
./script/deploy.sh logs
```
- Xem PM2 logs (50 dòng cuối)

#### f) Status
```bash
./script/deploy.sh status
```
- Xem trạng thái PM2 process

---

## 🚀 Quick Start

### Setup môi trường lần đầu:
```bash
# 1. Cài đặt môi trường
./script/setup-environment.sh

# 2. Restart terminal hoặc source shell config
source ~/.zshrc

# 3. Deploy dự án
cd /path/to/chainivo-blockchain
./script/deploy.sh full
```

### Workflow phát triển thông thường:
```bash
# 1. Sửa code...

# 2. Deploy nhanh
./script/deploy.sh quick

# 3. Xem logs
./script/deploy.sh logs
```

---

## 📦 Yêu cầu hệ thống

- **OS:** macOS hoặc Linux
- **Shell:** bash/zsh
- **Network:** Cần internet để cài đặt packages
- **Bun:** Tự động cài đặt qua NVM (khuyến nghị: v22.18.0)

---

## 🔧 PM2 Commands

Sau khi deploy, bạn có thể sử dụng các lệnh PM2:

```bash
pm2 list                          # Xem danh sách processes
pm2 logs chainivo-blockchain      # Xem logs realtime
pm2 restart chainivo-blockchain   # Khởi động lại
pm2 stop chainivo-blockchain      # Dừng process
pm2 delete chainivo-blockchain    # Xóa process
pm2 monit                         # Monitor CPU/Memory
```

---

## 📁 Các file được tạo

Sau khi chạy script, các file sau sẽ được tạo:

```
chainivo-blockchain/
├── ecosystem.config.js     # PM2 configuration
├── logs/                   # PM2 logs
│   ├── pm2-error.log
│   └── pm2-out.log
└── .next/                  # Next.js build output
```

---

## ⚠️ Lưu ý

1. **Permissions:** Scripts cần quyền thực thi (`chmod +x`)
2. **Port:** Ứng dụng mặc định chạy ở port `3000`
3. **Bun:** Scripts sử dụng Bun thay vì NPM
4. **Build time:** Build có thể mất 1-3 phút tùy máy
5. **PM2 startup:** Chạy `pm2 startup` để auto-start khi reboot

---

## 🐛 Troubleshooting

### Script không chạy được
```bash
chmod +x script/*.sh
```

### PM2 không tìm thấy
```bash
npm install -g pm2
# hoặc
bun add -g pm2
```

### Port 3000 đã được sử dụng
```bash
# Tìm process đang dùng port 3000
lsof -ti:3000

# Kill process
kill -9 $(lsof -ti:3000)
```

### Build bị lỗi
```bash
# Xóa cache và build lại
rm -rf .next node_modules bun.lockb
bun install
bun run build
```

---

## 📞 Hỗ trợ

Nếu gặp vấn đề, vui lòng:
1. Kiểm tra logs: `./script/deploy.sh logs`
2. Kiểm tra PM2: `pm2 status`
3. Kiểm tra Node.js: `node --version`
4. Kiểm tra Bun: `bun --version`

---

**Last Updated:** November 2025  
**Maintainer:** Chainivo Development Team

