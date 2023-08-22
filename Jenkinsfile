def imageName = 'movies-marketplace'
def dockerHubUsername = env.DOCKERHUB_USERNAME
def emailAddress = env.EMAIL_ADDRESS

node('dind-agent') {
    try {
        stage('Checkout') {
            checkout scm
        }

        def imageTest = docker.build("${dockerHubUsername}/${imageName}-test", "-f Dockerfile.test .")

        stage('Quality Tests') {
            sh "docker run --rm ${dockerHubUsername}/${imageName}-test npm run lint"
        }

        stage('Unit Tests') {
            sh "docker run --rm -v $PWD/coverage:/app/coverage ${dockerHubUsername}/${imageName}-test npm run test"
            publishHTML(target: [
                allowMissing: false,
                alwaysLinkToLastBuild: false,
                keepAll: true,
                reportDir: "$PWD/coverage/marketplace",
                reportFiles: "index.html",
                reportName: "Coverage Report"
            ])
        }

        stage('Static Code Analysis') {
            withSonarQubeEnv('sonarqube') {
                def scannerHome = tool 'sonarqube'
                sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=${env.BUILD_NUMBER}"
            }
        }

        stage("Quality Gate") {
            timeout(time: 5, unit: 'MINUTES') {
                def qg = waitForQualityGate()
                if (qg.status != 'OK') {
                    error "Pipeline aborted due to quality gate failure: ${qg.status}"
                }
            }
        }

        stage('Build') {
            docker.build(imageName, '--build-arg ENVIRONMENT=sandbox .')
        }
        currentBuild.result = 'SUCCESS'
    } catch (Exception e) {
        mail to: emailAddress,
             subject: "Failure in pipeline: ${currentBuild.fullDisplayName}",
             body: "The build has failed. Check the details at ${env.BUILD_URL}. Error: ${e}"
             currentBuild.result = 'FAILURE'
        throw e
    } finally {
        mail to: emailAddress,
             subject: "Status of pipeline: ${currentBuild.fullDisplayName}",
             body: "${env.BUILD_URL} has result ${currentBuild.result}"
    }
}


def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}
