#!/bin/bash

[ $# -ne 1 ] && echo "usage: "`basename $0`" snapshot_id" && exit 1

. `dirname $0`/es_includes.sh

snapshot=$1

$DOCKER_CURL -X GET $URL/_snapshot/$BACKUP_REPO/snapshot_$snapshot | python -m json.tool
