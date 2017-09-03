#!/bin/bash
echo "this clears the entire elasticsearch datastore, type 'da' to actually do this"
read foo
[ "$foo" == "da" ] || exit 1

. `dirname $0`/es_includes.sh

$DOCKER_CURL -XDELETE $URL/*
