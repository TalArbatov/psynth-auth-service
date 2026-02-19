#!/bin/bash

npm run build

docker build --platform=linux/amd64 -t talarbatov/psynth-identity-service .
docker push talarbatov/psynth-identity-service:latest
