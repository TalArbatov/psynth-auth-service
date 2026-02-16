#!/bin/bash

# Login and save cookies
curl \
    -c cookies.txt \
    -X POST \
    --header "Content-Type: application/json" \
    --data '{"email":"tal@example.com","password":"secret-password"}' \
    http://localhost:3050/auth/login

echo ""
echo "---"

# Check session
echo "GET /auth/me:"
curl -b cookies.txt http://localhost:3050/auth/me

echo ""
echo "---"

# Logout
echo "POST /auth/logout:"
curl -b cookies.txt -X POST http://localhost:3050/auth/logout

echo ""
echo "---"

# Verify session is gone
echo "GET /auth/me (should be 401):"
curl -b cookies.txt http://localhost:3050/auth/me

echo ""
