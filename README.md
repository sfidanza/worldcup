# worldcup2014

A site to follow the calendar and results of the 2014 worldcup. It is deployed live at:

- <https://worldcup2014.dagobah-online.com>

The site is using a node.js backend to retrieve data, and a javascript frontend to display them. It is as much a functional interest, to follow the worldcup, as a technical one, to play with technologies.

Functionally, the site has:

- the list of matches, locations, date/hours (France time)
- the groups schedule and results
- a final board to follow the round of 16 to the final

Technically:

- each service runs in its docker container
  - js frontend served by nginx
    - it uses a client-side template engine to display the views
    - page navigation and history is handled by the js framework layer
    - data is retrieved in ajax targeting the backend api
    - nginx proxies the api calls to node.js
    - Grunt is used for the build system
  - server runs on node.js
  - data is stored in mongodb

## Run locally in production mode

Prerequisites:

- docker and docker-compose (Docker Desktop in you are on Windows)

For now, the containers are still built locally

    docker-compose -f "docker-compose.yml" up -d --build
    docker-compose -f "docker-compose.yml" down

## Run locally in development mode

Running `docker-compose up` without specifying the file will take the `docker-compose.override.yml` into account:

    docker-compose up -d --build
    docker-compose down

This will plug a few additional niceties for local development:

- A mongo-express DB admin interface is available on port 8091
- The server source files are mapped to your local folder:
  - Node is run through nodemon, so you can edit the local files and the server will be refreshed on the fly
  - The debug port is mapped (9229) so you can set breakpoints

NOTE: the client files can not be edited on the fly yet. For now you still need to refresh through rebuilding the container:

    docker-compose up -d --build

## Production setup

The wiki pages contain all the info based on the previous development / deployment model (without docker). This still needs to be updated for docker deployment. The basis however is to do exactly the same as in local (with the build flag until the docker images are published in dockerhub):

    docker-compose -f "docker-compose.yml" up -d --build

## To do (?)

- Local dev setup for client files
  - Make use of 'grunt watch' through a bind mount; This requires node inside the container, while the multi-stage build gets rid of it...
- Restore login through Google and betting features
  - <https://github.com/googleapis/google-api-nodejs-client/issues/806#issuecomment-631058329>
  - <https://www.npmjs.com/package/simple-oauth2>
- Tests
- Migrate server to express
- Migrate client to webpack
- Publish docker images in dockerhub
