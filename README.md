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

Since we will use Docker to run all this, you will need `docker` and `docker-compose` (i.e. Docker Desktop if you are on Windows).

## Develoment setup

You need a `.env` file in the root folder to specify the secrets. You can simply copy `.env.sample` to get started.

### Run locally in production mode

Here are the commands to start/stop everything (with the containers built locally):

    docker-compose -f "docker-compose.yml" up -d --build
    docker-compose -f "docker-compose.yml" down

### Run locally in development mode

Running `docker-compose up` without specifying the file will automatically take the `docker-compose.override.yml` into account. The commands are thus even simpler:

    docker-compose up -d --build
    docker-compose down

Once started, you can access the application at <http://localhost:8090>. This local development mode will plug a few additional niceties:

- A mongo-express DB admin interface is available on port 8091 (<http://localhost:8091>)
- The debug port is mapped (9229) so you can set breakpoints in your node.js code
- Whatever file you need to work on, your edits will be taken on the fly (on save)
  - Server and client source folders in the containers are mapped to your host filesystem
  - Both have a watcher to update what's necessary on file save (`nodemon` for server, `grunt watch` for client)

## Production setup

The wiki pages contain all the info based on the previous development / deployment model (without docker). This still needs to be updated for docker deployment. The basis however is to do exactly the same as in local (with the build flag until the docker images are published in dockerhub), except for the override of course:

    docker-compose -f "docker-compose.yml" up -d --build
    docker-compose -f "docker-compose.yml" down

Alternatively, it can be run on Docker Swarm, provided images are either available in docker hub or have been built locally (through `docker-compose build` for example):

    docker-compose -f docker-compose.yml config | docker stack deploy -c - worldcup2014
    docker stack rm worldcup2014

Note: the `docker-compose config` command resolves the environment variables inside the compose file from `.env`, which is not supported by `docker stack deploy`. It is acting as a preprocessor.

## To do (?)

- [ONGOING] Tests
  - <https://mochajs.org/#installation>
- Migrate client to webpack
  - <https://webpack.js.org/guides/getting-started/>
- Publish docker images to dockerhub
- client/.csslintrc

## References

- Mongodb driver documentation
  - <http://mongodb.github.io/node-mongodb-native/4.1/classes/Collection.html#updateMany>
- setup local https? (was not needed to test Google login)
  - <https://web.dev/how-to-use-local-https/>
- SSL security test
  - <https://www.ssllabs.com/ssltest/index.html>
