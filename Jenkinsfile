def imageName = 'movies-marketplace' // removed username
def dockerHubUsername = env.DOCKERHUB_USERNAME
def emailAddress = env.EMAIL_ADDRESS

node('dind-agent') {
    stage('Checkout'){
        checkout scm
    }

    def imageTest = docker.build("${dockerHubUsername}/${imageName}-test", "-f Dockerfile.test .")

    stage('Quality Tests') {
        imageTest.inside("--rm") {
        sh "npm run lint"
        }
    }

    stage('Unit Tests') {
        imageTest.inside("--rm -v $PWD/coverage:/app/coverage") {
            sh "npm run test"
        }
        publishHTML(target: [
            allowMissing: false,
            alwaysLinkToLastBuild: false,
            keepAll: true,
            reportDir: "$PWD/coverage/marketplace",
            reportFiles: "index.html",
            reportName: "Coverage Report"
        ])
    }

    stage('Static Code Analysis'){
        withSonarQubeEnv('sonarqube') {
            // Get the path to the configured SonarQube Scanner
            def scannerHome = tool 'sonarqube'

            // Run the SonarQube scanner with project version set to Jenkins build number
            sh "${scannerHome}/bin/sonar-scanner -Dsonar.projectVersion=${env.BUILD_NUMBER}"
        }
    }

    stage('Build'){
        docker.build(imageName, '--build-arg ENVIRONMENT=sandbox .')
    }

    post {
        always {
            mail to: emailAddress,
            subject: "Status of pipeline: ${currentBuild.fullDisplayName}",
            body: "${env.BUILD_URL} has result ${currentBuild.result}"
        }
    }
}

// move Quality Gate outside of the node block
stage("Quality Gate") {
    timeout(time: 5, unit: 'MINUTES') {
        def qg = waitForQualityGate()
        if (qg.status != 'OK') {
            error "Pipeline aborted due to quality gate failure: ${qg.status}"
        }
    }
}

def commitID() {
    sh 'git rev-parse HEAD > .git/commitID'
    def commitID = readFile('.git/commitID').trim()
    sh 'rm .git/commitID'
    commitID
}
