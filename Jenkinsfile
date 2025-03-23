pipeline {
    agent any

    tools {
        nodejs "nodejs"  // Ensure Node.js is installed in Jenkins
    }

    environment {
        CI = "true"
        OWASP_ZAP_PATH = "\"C:\\Program Files\\ZAP\\Zed Attack Proxy\\zap.bat\""  // Windows needs escaped paths
        TARGET_URL = "http://localhost:3000"
        GEMINI_API_KEY = "AIzaSyCiQhoTk8zymsivgAQvV4gUCEeGi5lOxVs"
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
                bat 'start /B node server.js'  // Windows alternative for nohup
                sleep(time: 15, unit: 'SECONDS')  // Ensure the server starts before scanning
            }
        }

        stage('Generate OWASP ZAP Script Using Gemini AI') {
            steps {
                script {
                    def ai_api_url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}"
                    
                    def requestBody = '''{
                        "contents": [{
                            "parts": [{"text": "Generate an OWASP ZAP scan script for scanning ${TARGET_URL}"}]
                        }]
                    }'''

                    def zap_script = bat(script: "curl -X POST \"${ai_api_url}\" -H \"Content-Type: application/json\" -d \"${requestBody}\"", returnStdout: true).trim()

                    writeFile file: 'zap_scan.js', text: zap_script
                }
            }
        }


        stage('Run OWASP ZAP Scan') {
            steps {
                bat '''
                "%OWASP_ZAP_PATH%" -cmd -quickurl "%TARGET_URL%" -quickout zap_report.xml
                '''
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
