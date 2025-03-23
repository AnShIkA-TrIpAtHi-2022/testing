pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    environment {
        CI = "true"
        OWASP_ZAP_PATH = "C:\\Program Files\\ZAP\\Zed Attack Proxy\\zap.bat"
        TARGET_URL = "http://localhost:3000"
    }

    stages {
        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/AnShIkA-TrIpAtHi-2022/testing.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                bat 'npm install'
            }
        }

        stage('Start Application') {
            steps {
                bat 'start /B node server.js'
                sleep(time: 10, unit: 'SECONDS')  // Wait for the server to start
            }
        }

        stage('Run OWASP ZAP Scan') {
            steps {
                bat """
                    cd "C:\\Program Files\\ZAP\\Zed Attack Proxy"
                    zap.bat -cmd -port 9090 -quickurl ${TARGET_URL} -quickout "%WORKSPACE%\\zap_report.html" -script "%WORKSPACE%\\zap_scan.js"
                """
            }
        }

        stage('Publish OWASP ZAP Report') {
            steps {
                publishHTML([allowMissing: true,
                    alwaysLinkToLastBuild: true,
                    keepAll: true,
                    reportDir: '.',
                    reportFiles: 'zap_report.xml',
                    reportName: "OWASP ZAP Security Report"])
            }
        }
    }
}
