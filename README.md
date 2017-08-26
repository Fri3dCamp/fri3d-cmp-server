# Fri3dCamp Content Management Platform


This is an early version of the CMP for FC2018.

_insert use and code overview here_

## docker

### usage

* `docker-compose up` brings up the whole stack and logs to stdout (`-d` to detach, ^C to stop)
* `docker-compose stop` brings it all down
* `docker-compose logs <frontend|api|store>` dumps logs (from the specified container)
* `docker-compose exec api /bin/bash` runs bash on a *running* API container
* `docker-compose build --no-cache api` rebuilds the API container, ignoring npm caches
* ...

### workings

The full thing runs on docker-compose. Let's have a look at `docker-compose.yml` and see what gives;

* `frontend` is an nginx instance which, per the config file in `frontend/config/`, serves;
** static content from `frontend/data/`
** api requests which it forwards to the `api` container below
* `api` is a node app which;
** talks to the `store` container for database hits
** has the entire `api/` mounted as `/api/` (changes are instavisible)
** has it's own `Dockerfile` in `api/`
* `store` is an ElasticSearch datastore, with;
** `store/data/` mounted the ES storage, so you can shut it down, back this up, move between hosts, ...

### it doesn't work

#### can't find node deps

You need to rebuild node_modules, this will change when actually deploying (see todo). Give Jef a shout if this happens, because it shouldn't.

`docker-compose run api npm install`

#### elasticsearch whines about vm.maps_max_count and dies

ES needs vm shenanigans to run, do the following or add it to /etc/sysctl.conf to make it stick.

`sudo sysctl -w vm.max_map_count=262144`

## todo
* (upon prod) remove cache hate from nginx config
* (upon prod) in API's docker, s/mounted volume/proper COPY/g,
