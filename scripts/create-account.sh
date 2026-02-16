#!/bin/bash

curl \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"personId":"person-jf83jso1","dailyWithdrawlLimits":1000,"accountType":0}' \
    http://localhost:3000/api/accounts
