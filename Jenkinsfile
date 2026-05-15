pipeline {
    agent any

    environment {
        APP_DIR     = '/var/www/da-nang-memories'
        PM2_APP_NAME = 'da-nang-memories'
    }

    options {
        disableConcurrentBuilds()
        timeout(time: 15, unit: 'MINUTES')
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install') {
            steps {
                sh '''
                    rm -f package-lock.json
                    npm install --include=dev
                '''
            }
        }

        stage('Build') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                withCredentials([
                    string(credentialsId: 'NEXT_PUBLIC_SUPABASE_URL',      variable: 'NEXT_PUBLIC_SUPABASE_URL'),
                    string(credentialsId: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', variable: 'NEXT_PUBLIC_SUPABASE_ANON_KEY'),
                    string(credentialsId: 'SUPABASE_SERVICE_ROLE_KEY',     variable: 'SUPABASE_SERVICE_ROLE_KEY'),
                    string(credentialsId: 'CLOUDINARY_CLOUD_NAME',         variable: 'CLOUDINARY_CLOUD_NAME'),
                    string(credentialsId: 'CLOUDINARY_API_KEY',            variable: 'CLOUDINARY_API_KEY'),
                    string(credentialsId: 'CLOUDINARY_API_SECRET',         variable: 'CLOUDINARY_API_SECRET'),
                    string(credentialsId: 'GOOGLE_AI_API_KEY',             variable: 'GOOGLE_AI_API_KEY'),
                ]) {
                    sh '''
                        set -e

                        # Sync build output to app directory
                        rsync -av --delete \
                            --exclude='node_modules' \
                            --exclude='.git' \
                            --exclude='.env.local' \
                            ./ "${APP_DIR}/"

                        # Write runtime env file (Next.js reads .env.local on next start)
                        umask 077
                        : > "${APP_DIR}/.env.local"
                        printf 'NEXT_PUBLIC_SUPABASE_URL=%s\n'      "${NEXT_PUBLIC_SUPABASE_URL}"      >> "${APP_DIR}/.env.local"
                        printf 'NEXT_PUBLIC_SUPABASE_ANON_KEY=%s\n' "${NEXT_PUBLIC_SUPABASE_ANON_KEY}" >> "${APP_DIR}/.env.local"
                        printf 'SUPABASE_SERVICE_ROLE_KEY=%s\n'     "${SUPABASE_SERVICE_ROLE_KEY}"     >> "${APP_DIR}/.env.local"
                        printf 'CLOUDINARY_CLOUD_NAME=%s\n'         "${CLOUDINARY_CLOUD_NAME}"         >> "${APP_DIR}/.env.local"
                        printf 'CLOUDINARY_API_KEY=%s\n'            "${CLOUDINARY_API_KEY}"            >> "${APP_DIR}/.env.local"
                        printf 'CLOUDINARY_API_SECRET=%s\n'         "${CLOUDINARY_API_SECRET}"         >> "${APP_DIR}/.env.local"
                        printf 'GOOGLE_AI_API_KEY=%s\n'             "${GOOGLE_AI_API_KEY}"             >> "${APP_DIR}/.env.local"

                        cd "${APP_DIR}"

                        # Install production dependencies only
                        npm install --omit=dev

                        # Reload or start app via PM2
                        if pm2 describe "${PM2_APP_NAME}" > /dev/null 2>&1; then
                            pm2 reload "${PM2_APP_NAME}" --update-env
                        else
                            pm2 start ecosystem.config.js
                        fi

                        # Persist process list across server reboots
                        pm2 save

                        # Healthcheck: poll port 3001 for up to 30s
                        for i in $(seq 1 15); do
                            if curl -fsS http://127.0.0.1:3001/ > /dev/null; then
                                echo "Healthcheck OK after ${i} attempt(s)"
                                exit 0
                            fi
                            sleep 2
                        done

                        echo "Healthcheck FAILED — dumping last 50 PM2 log lines:"
                        pm2 logs "${PM2_APP_NAME}" --lines 50 --nostream || true
                        exit 1
                    '''
                }
            }
        }
    }

    post {
        success {
            echo "Deployment successful — ${env.BUILD_URL}"
        }
        failure {
            echo "Build failed. Check console: ${env.BUILD_URL}console"
        }
        always {
            cleanWs()
        }
    }
}
