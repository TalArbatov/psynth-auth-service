#!/bin/bash

# script to create a postgres container, init db, tables and seed mock data

# echo "Running init script..."

# docker stop psynth-pg

# docker rm psynth-pg 

# docker run --name psynth-pg -e POSTGRES_PASSWORD=password --network api-net -d -p 5432:5432 postgres


# # Wait for Postgres to be ready
# echo "Waiting for Postgres to start..."
# until docker exec psynth-pg pg_isready -U postgres > /dev/null 2>&1; do
#   sleep 1
# done

# echo "Postgres container started."

# Run the SQL command
docker exec -i psynth-db psql -U postgres -d psynth -a < ./scripts/init/seed.sql

echo "Done."