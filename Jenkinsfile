pipeline {
    agent any

    environment {
        DOCKER_IMAGE = "quang1709/mos-fe:latest"
        DOCKER_CREDENTIALS_ID = 'quang1709-dockerhub'
        KUBE_CONFIG_ID = 'kubeconfig-credentials'
        DEPLOYMENT_NAME = 'mos-fe-kltn-service'
        DEPLOYMENT_NAMESPACE = 'argocd'
        
        // Biến môi trường từ Jenkins credentials
        NEXT_PUBLIC_API_URL = credentials('NEXT_PUBLIC_API_URL')
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Build Application') {
            steps {
                sh 'npm run build'
            }
        }

        stage('Build Docker Image') {
            steps {
                // Tạo file .env từ biến môi trường Jenkins
                sh '''
                cat > .env << EOL
# API Configuration
NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}
EOL
                '''
                
                // Xây dựng Docker image và copy file .env vào
                sh "docker build -t ${DOCKER_IMAGE} ."
            }
        }

        stage('Push Docker Image') {
            steps {
                withCredentials([usernamePassword(credentialsId: "${DOCKER_CREDENTIALS_ID}", usernameVariable: 'DOCKER_USERNAME', passwordVariable: 'DOCKER_PASSWORD')]) {
                    sh "echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin"
                    sh "docker push ${DOCKER_IMAGE}"
                }
            }
        }

    }

    post {
        success {
            echo 'CI/CD pipeline completed successfully!'
        }
        failure {
            echo 'CI/CD pipeline failed. Please check the logs for details.'
        }
        always {
            // Clean up to save disk space
            sh 'docker system prune -f || true'
            sh 'if [ -f ".env" ]; then rm -f .env; fi'
        }
    }
}
