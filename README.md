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

## Develoment setup

You need a `.env` file in the root folder to specify the secrets. You can simply copy `.env.sample` to get started. You also need to have Docker installed (Docker Desktop is great if you are on Windows).

### Run locally in production mode

Here are the commands to start/stop everything (with the images built locally):

    docker compose build                             # build images from local sources
    docker compose -f "docker-compose.yml" up -d     # start containers
    docker compose -f "docker-compose.yml" down      # stop containers and remove images

### Run locally in development mode

Running `docker compose up` without specifying the file will automatically take the `docker-compose.override.yml` into account. The commands are thus even simpler:

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

For real production use, containers should be deployed on Docker Swarm. Images will be sourced from container hub or will have to be built locally before (through `docker compose build` for example). To enable routing from the Traefik gateway, the corresponding `compose` file should be used as well:

    docker compose -f docker-compose.yml -f docker-compose.traefik.yml config | docker stack deploy -c - worldcup
    docker stack rm worldcup

Note: the `docker compose config` command is acting as a preprocessor to resolve the environment variables inside the compose files from `.env`, which is not supported by `docker stack deploy`.

Alternatively, containers can be started with `docker compose`:

    docker compose -f "docker-compose.yml" up -d
    docker compose -f "docker-compose.yml" down

Note: The wiki pages contain all the info based on the previous development / deployment model (without docker). This still needs to be updated for docker deployment.

## To do

- fix: Support error cases on response.json() parsing (rate limiter can return 429 http codes)
- feat: Internationalize date/time for match schedule
  - Store date in ISO format, or host local format with city timezone
  - Display date in client timezone
- Add hashes to templates to bust cache on new releases
- Extract framework as a dependency to share between apps (needs build rework)
  - "Tahr: A lightweight framework with templating support, data manipulation and basic UI components"
- Deploy on kubernetes
  - Add compress middleware on Traefik (as today on docker)
  - Add REST API security middleware on Traefik (<https://cheatsheetseries.owasp.org/cheatsheets/REST_Security_Cheat_Sheet.html#security-headers>)
  - Add basic security middleware on Traefik for frontend resources (as today on docker)
- Add versioning on build
  - Compute next version at start of build, use it to tag published docker images
  - Use version to tag the git repo
  - Publish the Helm chart with the version tag, with pinned container references
- Improve security for frontend resources
  - nginx CSP vs Traefik other headers? Could everything be handled by Traefik?
  - remove `unsafe-inline` for `style-src`
  - remove `unsafe-inline` for `script-src`
- Database
  - initDB: should we keep this or not?
    - Keep? Push [server data](server/src/admin/data/) to ConfigMap and share it with server container as well
    - Remove? Only setup admin through initDB and add import all to admin endpoint
    - Pros/Cons?
      - Data inside server only seems cleaner than isolated in chart and shared between two containers (read-only)
      - However it is simpler as an admin to start and be ready, rather than have to login and import after first start
  - nodeSelector needed because of hostpath for DB volume


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
