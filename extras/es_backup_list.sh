#!/bin/bash

. `dirname $0`/es_includes.sh

$DOCKER_CURL -X GET $URL/_snapshot/$BACKUP_REPO/_all | python -m json.tool

