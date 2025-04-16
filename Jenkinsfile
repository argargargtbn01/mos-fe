pipeline {
    agent any

    environment {
        NODE_ENV = "production"  // Bạn có thể thay đổi thành "development" nếu cần
    }

    stages {
        stage('Checkout') {
            steps {
                // Lấy mã nguồn từ Git repository; thay đổi branch nếu cần (ví dụ: main hoặc master)
                git url: 'https://github.com/argargargtbn01/mos-fe.git', branch: 'master'
            }
        }
        stage('Install Dependencies') {
            steps {
                // Cài đặt các package từ package.json
                sh 'npm install'
            }
        }
        stage('Build') {
            steps {
                // Build dự án Next.js; lệnh này sẽ chạy "next build"
                sh 'npm run build'
            }
        }
        stage('Archive Artifacts') {
            steps {
                // Lưu lại artifact nếu dự án xuất ra thư mục build nào đó.
                // Nếu sử dụng "next export", kết quả thường nằm ở thư mục "out".
                // Nếu không, bạn có thể lưu thư mục .next hoặc các file cần deploy.
                archiveArtifacts artifacts: 'out/**', fingerprint: true
            }
        }
    }
    
    post {
        success {
            echo 'Pipeline hoàn thành thành công!'
        }
        failure {
            echo 'Pipeline thất bại, vui lòng kiểm tra log chi tiết!'
        }
    }
}
