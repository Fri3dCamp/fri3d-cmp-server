Dockerfile_js_yak_shaving keeps me from having to install npm.
* `docker build -t js_yak_shaving -f Dockerfile_js_yak_shaving`
* `docker run -v $PWD:/src -it js_yak_shaving npm install`

The `es_foo.sh` scripts talk to the ElasticSearch instance:
* `es_includes.sh` is a header file
* `es_backup_initialize.sh` tells an instance where to look for/place backups
* `es_backup.sh` tells an instance to dump a new database of our index (sync)
* `es_backup_{list,info}.sh` get a list of backups or view a single one
* `es_restore.sh` closes our index, reloads from a specific snapshot, opens again
* `es_dump.sh` dumps the first page of the db contents
* `es_delete.sh` nukes our index (don't use, dev stuff)

Backup mechanism;
* Tell an instance where to place backups (maps to `store/backups`) with `es_backup_initialize.sh`, one time.
* Make backups with `es_backup.sh`, tar `store/backups` and ship it away.

Insert calamity here, then on a new instance;
* Prepopulate `store/backups` from the tar file.
* Tell an instance where to place backups (maps to `store/backups`) with `es_backup_initialize.sh`, one time.
* See which backups are present, `es_backup_list.sh` (note the "snapshot" field, you need the XX in "snapshot_XX").
* Load one with `es_restore.sh XX`
