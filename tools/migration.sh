#!/usr/bin/env bash

function aux() {
    db_url=$1
    name=$2

    for file in $(find './server/migrations/' -name "$name.sql"); do 
        psql "$db_url" < "$file"
    done
}

db_url=$(sed 's/DATABASE_URL=//' ./server/.env)
aux "$db_url" "$1"
