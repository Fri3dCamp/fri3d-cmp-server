#!/bin/bash
docker-compose exec store curl --user elastic:changeme http://localhost:9200/fri3d-cmp/_search | python -m json.tool

