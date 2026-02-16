#!/bin/bash

# script to create a postgres container, init db, tables and seed mock data

# echo "Running init script..."

# docker stop bondsports-pg

# docker rm bondsports-pg 

docker exec -i psynth-pg psql -U postgres -a < ./scripts/seed.sql

echo "Done."