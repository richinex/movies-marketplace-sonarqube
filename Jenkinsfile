def imageName = 'richinex/movies-marketplace'

node {
    stage('Checkout'){
        checkout scm
    }

    def imageTest = docker.build("${imageName}-test", "-f Dockerfile.test .")

    stage('Quality Tests'){
        sh "docker run --rm ${imageName}-test npm run lint"
    }

    stage('Unit Tests'){
        sh "docker run --rm -v $PWD/coverage:/app/coverage ${imageName}-test npm run test"
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
