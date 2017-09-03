#!/bin/bash

. `dirname $0`/es_includes.sh

$DOCKER_CURL -X PUT $URL/_snapshot/$BACKUP_REPO -H 'Content-Type: application/json' -d '{ "type" : "fs", "settings" : { "location" : "'$BACKUP_PATH'", "compress" : true } }'
