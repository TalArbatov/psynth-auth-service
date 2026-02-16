#!/bin/bash

npm run build

docker build --platform=linux/amd64 -t talarbatov/psynth-auth-service .
docker push talarbatov/psynth-auth-service:latest
