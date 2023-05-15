#!/bin/sh -eu

cd "$(dirname "$0")"
export NODE_ENV="development"

#PROJECT_DIR=$(dirname "${BASH_SOURCE}")
#echo $PROJECT_DIR
#cd $PROJECT_DIR

export PATH=$PATH:/home/ubuntu/sfari_browser/node_modules/.bin


DEFAULT_PORT="8000"
export PORT=${PORT:-$DEFAULT_PORT}

#yarn run nodemon ./src/server.js
nodemon ./src/server.js
