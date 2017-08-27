#!/bin/bash
echo "this clears the entire elasticsearch datastore, type 'da' to actually do this"
read foo
[ "$foo" == "da" ] || exit 1

docker-compose exec store curl --user elastic:changeme -XDELETE http://localhost:9200/*

