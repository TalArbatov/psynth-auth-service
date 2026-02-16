#!/bin/bash

curl \
    -X GET \
    "http://localhost:3000/api/accounts/account-nv49u32z/statement?from=2026-01-02"

curl \
    -X GET \
    "http://localhost:3000/api/accounts/account-nv49u32z/statement?from=2026-01-02&to=2026-01-06"

