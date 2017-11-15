docker login -u$DOCKER_USER -p$DOCKER_PASSWORD
docker build -t blutner/ocomis-authentication-ui:latest .
docker push blutner/ocomis-authentication-ui:latest
docker logout