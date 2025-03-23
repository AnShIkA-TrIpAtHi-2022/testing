pipeline {
    agent any

    tools {
        nodejs "nodejs"
    }

    environment {
        CI = "true"
        OWASP_ZAP_PATH = "C:\\Program Files\\ZAP\\Zed Attack Proxy\\zap.bat"
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
                bat 'start /B node server.js'
                sleep(time: 10, unit: 'SECONDS')
            }
        }

        stage('Generate OWASP ZAP Script Using Groq AI') {
            steps {
                script {
                    def ai_api_url = "https://api.groq.com/openai/v1/chat/completions"
                    
                    def requestBody = """{
                        "model": "mixtral-8x7b-32768",
                        "messages": [
                            {"role": "system", "content": "You are an assistant that generates OWASP ZAP scan scripts."},
                            {"role": "user", "content": "Generate an OWASP ZAP scan script for scanning ${TARGET_URL}. Only provide the code without additional text."}
                        ]
                    }"""

                    def response = bat(script: "curl -X POST \"${ai_api_url}\" -H \"Content-Type: application/json\" -H \"Authorization: Bearer ${GROQ_API_KEY}\" --data-raw \"${requestBody}\"", returnStdout: true).trim()

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
