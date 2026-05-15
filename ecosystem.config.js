module.exports = {
    apps: [
        {
            name: 'da-nang-memories',
            script: 'node_modules/.bin/next',
            args: 'start',
            cwd: '/var/www/da-nang-memories',
            instances: 1,
            exec_mode: 'fork',
            env: {
                NODE_ENV: 'production',
                PORT: 3001,
            },
            watch: false,
            max_memory_restart: '512M',
            error_file: '/var/log/pm2/da-nang-memories-error.log',
            out_file: '/var/log/pm2/da-nang-memories-out.log',
            log_date_format: 'YYYY-MM-DD HH:mm:ss',
        },
    ],
}
