#!/usr/bin/env bash

server_path=/srv/http/\~ts438730/bdsj

cargo build -p server --release || exit 1
# cd ./client && make build && cd ..
# cargo build -p client --release
cd ./client && npm run build || exit 1
cd ..
sudo cp ./cgi-bin/api.py $server_path/api.py || exit 1
sudo cp ./cgi-bin/view.py $server_path/view.py || exit 1
sudo cp ./target/release/server $server_path/bdsj || exit 1
sudo cp ./server/.env $server_path/.env || exit 1
sudo cp ./client/dist/* -r $server_path/public/ || exit 1
