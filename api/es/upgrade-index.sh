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

echo "Getting the current index version"
CURRENT_IDX=$($CURL -XGET "http://$HOST:9200/_alias/$APP-$ENVIRONMENT" | ${JQ_BIN} 'keys[0]' | sed -e 's/^"//'  -e 's/"$//')
CURRENT_SEQ=$(echo $CURRENT_IDX | cut -d '-' -f4)
NEXT_SEQ=$(expr $CURRENT_SEQ + 1)
NEXT_IDX="$APP-${ENVIRONMENT}-${NEXT_SEQ}"
echo "Found the current index to be ${CURRENT_IDX} so the next index would be ${NEXT_IDX}"

echo "Creating the new index ${NEXT_IDX}"
$CURL -XPUT "http://$HOST:9200/${NEXT_IDX}" -d @index.json

echo  "Copying the data from the original index (${CURRENT_IDX}) to the newly created one (${NEXT_IDX})"
elasticdump --input="http://${USER}:${PASSWD}@${HOST}:9200/${CURRENT_IDX}" --output="http://${USER}:${PASSWD}@${HOST}:9200/${NEXT_IDX}"

echo "Switch the alias"
$CURL -XPOST "http://$HOST:9200/_aliases" -d "
{
    \"actions\": [
        { \"remove\": {
            \"alias\": \"$APP-${ENVIRONMENT}\",
            \"index\": \"${CURRENT_IDX}\"
        }},
        { \"add\": {
            \"alias\": \"$APP-${ENVIRONMENT}\",
            \"index\": \"${NEXT_IDX}\"
        }}
    ]
}
"