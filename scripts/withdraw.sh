#!/bin/bash

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data "{\"amount\":$1}" \
    http://localhost:3000/api/accounts/account-nv49u32z/withdraw


