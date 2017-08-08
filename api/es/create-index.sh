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

CURR_IDX="$APP-${DATA_ENV}"
NEXT_IDX="$APP-${ENVIRONMENT}-0"

echo "Creating the new index ${NEXT_IDX}"
$CURL -XPUT "http://$HOST:9200/${NEXT_IDX}" -d @index.json

echo "Setting the alias"
$CURL -XPOST "http://$HOST:9200/_aliases" -d "
{
    \"actions\": [
        { \"add\": {
            \"alias\": \"$APP-${ENVIRONMENT}\",
            \"index\": \"${NEXT_IDX}\"
        }}
    ]
}
"