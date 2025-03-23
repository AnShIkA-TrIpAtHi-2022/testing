pipeline {
    agent any

    tools {
        nodejs "nodejs"  // Ensure Node.js is installed in Jenkins
    }

    environment {
        CI = "true"
        OWASP_ZAP_PATH = "C:\\Program Files\\ZAP\\Zed Attack Proxy\\zap.bat"   // Update this path
        TARGET_URL = "http://localhost:3000"
        GROQ_API_KEY = "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"  // Replace with your actual key
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
                bat 'start /B node server.js' // Proper way to start Node.js in Windows
                sleep(time: 10, unit: 'SECONDS') // Wait for the server to start
            }
        }

        stage('Generate OWASP ZAP Script Using Groq AI') {
            steps {
                script {
                    def ai_api_url = "https://api.groq.com/v1/chat/completions"
                    
                    def requestBody = """{
                        "model": "gemini-1.5-flash",
                        "messages": [
                            {"role": "system", "content": "You are an assistant that generates OWASP ZAP scan scripts."},
                            {"role": "user", "content": "Generate an OWASP ZAP scan script for scanning ${TARGET_URL}. make sure you give only the code and no other text as response."}
                        ]
                    }"""

                    def response = bat(script: "curl -X POST \"${ai_api_url}\" -H \"Content-Type: application/json\" -H \"Authorization: Bearer ${GROQ_API_KEY}\" -d \"${requestBody}\"", returnStdout: true).trim()

                    writeFile file: 'zap_scan.js', text: response
                }
            }
        }

        stage('Run OWASP ZAP Scan') {
            steps {
                bat '''
                ${OWASP_ZAP_PATH} -cmd -quickurl ${TARGET_URL} -quickout zap_report.xml
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
