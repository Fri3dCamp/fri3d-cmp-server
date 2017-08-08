#!/bin/bash

source ./settings.conf

TS=$(date +"%T")

CURL="curl --silent -u${USER}:${PASSWD}"

if [[ "$OSTYPE" == "linux-gnu" ]]; then
    JQ_BIN="./jq-linux64"
elif [[ "$OSTYPE" == "darwin"* ]]; then
    JQ_BIN="./jq-osx-amd64"
else
    echo "Running on something different then OSX or Linux is not supported. Exiting."
    exit 1
fi

echo "Removing the application index for $APP"
$CURL -XDELETE "http://$HOST:9200/$APP-${DATA_ENV}*"