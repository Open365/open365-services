# This Dockerfile is only for running the tests. We do not
# have a microservice with this code. It runs in open365-app-docker

FROM docker-registry.eyeosbcn.com/eyeos-fedora21-node-base
MAINTAINER eyeos

ENV WHATAMI eyeos-open365-services
ENV InstallationDir /var/service

COPY . ${InstallationDir}
WORKDIR ${InstallationDir}

RUN npm install --verbose && \
    npm cache clean

CMD sleep infinity
