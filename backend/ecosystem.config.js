module.exports = {
  apps: [
    {
      name: 'newchatbot-api',
      script: './dist/server.js',
      instances: 6,
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
      env: {
        NODE_ENV: "development",
        PORT: 3000
      },
      env_production: {
        NODE_ENV: 'production',
        PORT: 3000
      },
      merge_logs: true,
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      time: true,
      node_args: '--max-old-space-size=4096',
      exp_backoff_restart_delay: 100,
      kill_timeout: 3000,
      // increment_var: 'PORT',
      // instance_var: 'INSTANCE_ID'
    }
  ]
};