#!/bin/bash

. `dirname $0`/es_includes.sh

now=`date +%Y%m%d-%H%M%S`

$DOCKER_CURL -X PUT $URL/_snapshot/$BACKUP_REPO/snapshot_$now?wait_for_completion=true -H 'Content-Type: application/json' -d '{ "indices" : "'$INDEX'" }'
