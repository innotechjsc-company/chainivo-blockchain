module.exports = {
  apps: [
    {
      name: "chainivo-blockchain",
      script: "bun",
      args: "start",
      cwd: "./",
      instances: 1,
      exec_mode: "fork",
      autorestart: true,
      watch: false,
      max_memory_restart: "2G",
      min_uptime: "10s",
      max_restarts: 10,
      restart_delay: 4000,
      kill_timeout: 5000,
      listen_timeout: 10000,
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
      error_file: "./logs/pm2-error.log",
      out_file: "./logs/pm2-out.log",
      log_date_format: "YYYY-MM-DD HH:mm:ss Z",
      merge_logs: true,
      time: true,
    },
  ],
};
