#!/bin/bash

. `dirname $0`/es_includes.sh

$DOCKER_CURL $URL/$INDEX/_search | python -m json.tool
