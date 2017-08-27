Dockerfile_js_yak_shaving keeps me from having to install npm.
* `docker build -t js_yak_shaving -f Dockerfile_js_yak_shaving`
* `docker run -v $PWD:/src -it js_yak_shaving npm install`
