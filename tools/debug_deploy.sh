#!/usr/bin/env bash

server_path=/srv/http/\~ts438730/bdsj

cargo build -p server --release
# cd ./client && make build && cd ..
# cargo build -p client --release
cd ./client && npm run build || return 1
cd ..
sudo cp ./cgi-bin/api.py $server_path/api.py
sudo cp ./cgi-bin/view.py $server_path/view.py
sudo cp ./target/release/server $server_path/bdsj
sudo cp ./server/.env $server_path/.env
sudo cp ./client/dist/* -r $server_path/public/
