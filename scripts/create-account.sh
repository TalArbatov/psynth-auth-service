#!/bin/bash

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"username":"tal","password":"secret-password","email":"tal@example.com"}' \
    http://localhost:3050/api/accounts
