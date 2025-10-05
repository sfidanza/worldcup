# worldcup

A site to follow the calendar and results of the FIFA worldcup and other competitions. It is deployed live at:

- <https://worldcup.dagobah-online.com>

The site is using a node.js backend to retrieve data and a javascript frontend to display them. It is as much a functional interest to follow the worldcup, as a technical one to play with technologies.

Functionally, the site has:

- the list of matches, locations, date/hours (France time)
- the groups schedule and results
- a finals board to follow the round of 16 to the final
- admin endpoints to update scores with an engine to compute teams progress
- and more.. (see [notes.html](./client/src/templates/notes.html) for more)

Technically:

- each service runs in its docker container
  - js frontend served by nginx
    - it uses a client-side template engine to display the views
    - page navigation and history is handled by the js framework layer
    - data is retrieved targeting the backend api
    - nginx proxies the api calls to node.js
    - esbuild is used for the build system
  - server runs on node.js
  - data is stored in mongodb

## Initial setup

You need a `.env` file in the root folder to specify the secrets. You can simply copy `.env.sample` to get started. You also need to have Docker installed.

The first time you start the server, the database will only be populated with your admin user (from `.env` variables `ADMIN_ID` and `ADMIN_PWD`). If you access the site, you will get a server error as no data is available yet. To fill the data, use the `/api/reset` admin endpoint:

1. Login: `/api/user/login?id=<ADMIN_ID>&pwd=<ADMIN_PWD>`
2. Reset: `/api/admin/reset`

Note that individual editions can be added or maintained through the following admin endpoints:

- `/api/<year>/admin/preview` -> preview the data from the filesystem
- `/api/<year>/admin/drop`    -> drop the database
- `/api/<year>/admin/import`  -> import the filesystem data in database

## Development setup

### Run locally in development mode

Running `docker compose up` without specifying the file will automatically take the `docker-compose.override.yml` into account (which sets the dev mode):

    docker compose up -d --build
    docker compose down

Once started, you can access the application at <http://localhost:8090>. This local development mode will plug a few additional niceties:

- A mongo-express DB admin interface is available on port 8091 (<http://localhost:8091>)
- The debug port is mapped (9229) so you can set breakpoints in your node.js code
- Whatever file you need to work on, your edits will be taken on the fly (on save)
  - Server and client source folders in the containers are mapped to your host filesystem
  - Both have a watcher to update what's necessary on file save (`nodemon` for server, `esbuild watch` for client)

### Debugging the node.js code

When the containers are started in dev mode, you can use the Chrome DevTools external debugger (`chrome://inspect` in the Chrome address bar). You should see the server code in the Sources tab and you will be able to set breakpoints. If you don't, make sure you have `localhost:9229` listed in the Connection tab.

## CI/CD pipeline

The github workflow is triggered when pushing commits on github: it automatically builds and publishes images to github container repository.

- [sfidanza/worldcup-backend](https://github.com/sfidanza/worldcup/pkgs/container/worldcup-backend)
- [sfidanza/worldcup-frontend](https://github.com/sfidanza/worldcup/pkgs/container/worldcup-frontend)

## Production setup

### Run with Kubernetes

This is not yet fully ready. The [blueprint](./blueprint/README.md) already explains the basics of deploying the helm chart. It is fully functional but is still missing a bit of security setup through Traefik middlewares.

### Run with `docker stack`

For real production use, containers should be deployed on Docker Swarm. Images will be sourced from container hub. To enable routing from the Traefik [gateway](https://github.com/sfidanza/gateway), the corresponding `compose` file should be used as well:

    docker compose -f docker-compose.yml -f docker-compose.traefik.yml config | docker stack deploy -c - worldcup
    docker stack rm worldcup

Note: the `docker compose config` command is acting as a preprocessor to resolve the environment variables inside the compose files from `.env`, which is not supported by `docker stack deploy`.

Note: The wiki pages contain all the info based on the previous development / deployment model (without docker). This still needs to be updated for docker deployment.

### Run with `docker compose`

To run simply on one node without orchestrator, you can simply start the application with `docker compose`. You may want to map the frontend port to port 80 on the host (like it is down for dev):

    docker compose -f docker-compose.yml up -d     # start containers
    docker compose -f docker-compose.yml down      # stop containers and remove images

Or you can run it through Traefik and use the `docker-compose.traefik.yml` file:

    docker compose -f docker-compose.yml -f docker-compose.traefik.yml up -d     # start containers
    docker compose -f docker-compose.yml -f docker-compose.traefik.yml down      # stop containers and remove images

## References

- Mongodb driver documentation
  - <http://mongodb.github.io/node-mongodb-native/4.1/classes/Collection.html#updateMany>
- setup local https? (was not needed to test Google login)
  - <https://web.dev/how-to-use-local-https/>
- SSL security test
  - <https://www.ssllabs.com/ssltest/index.html>
- Use Github workflows to build and push docker images
  - <https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching>
- Free open public domain football data for the World Cup
  - <https://github.com/openfootball/worldcup>
- Content Security Policy
  - <https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy>
  - <https://research.google/pubs/csp-is-dead-long-live-csp-on-the-insecurity-of-whitelists-and-the-future-of-content-security-policy/>
- Github composite actions
  - <https://wallis.dev/blog/composite-github-actions>
- esbuild: <https://esbuild.github.io/>
- cron: <https://nodecron.com/>
- sse: <https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events/Using_server-sent_events>
