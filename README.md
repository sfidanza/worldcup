# worldcup2014

A site to follow the calendar and results of the 2014 worldcup. It is deployed live at:

- <https://worldcup2014.dagobah-online.com>

The site is using a node.js backend to retrieve data, and a javascript frontend to display them. It is as much a functional interest, to follow the worldcup, as a technical one, to play with technologies.

Functionally, the site has:

- the list of matches, locations, date/hours (France time)
- the groups schedule and results
- a final board to follow the round of 16 to the final

Technically:

- the js frontend uses a client-side template engine to display the views
- page navigation and history is handled by the js frw layer
- data is retrieved in ajax targeting the backend api
- the server is handled by nginx, serving the statics and proxying the api calls to node.js
- Grunt is used for the build system
- data is stored in mongodb

Development:

- 'grunt' runs jshint, then cleans and rebuild the target static folder (js/css are not minified)
- 'grunt watch' watches for any change on client files (img, js, css, html) to update the target folder on the fly

There are more descriptions of the toolchain and technical choices in the wiki pages. If you are not familiar with nginx, node.js, MongoDB, if you need to install them, or if you are interested by tips on optimizing your development environment, have a look a the wiki pages.

If you want to test it yourself, deploying the sites locally, here is what you will have to do:

- copy nginx-sites-available/worldcup2014 into your nginx config (check the wiki if you need more details)
- feed the data into your MongoDB database('worldcup2014') --- you can use the (commented out) routing to import the static json files into MongoDB:
  - uncomment the routing to "/api/cache/" in index.js
  - load /api/cache/import
  - load /api/data (to load from DB and check everything is fine)
- build the app: `grunt`
- that's it, you can launch it (nginx listens on port 80, node listens on port 9090 --- check the wiki for more tips on improving the development environment)

## Docker

Target: Be able to run everything through a simple docker-compose command

    docker-compose -f "docker-compose.yml" up -d --build

Still missing:

- [DONE] Needed before PRD deployment: Initialization
  - `npm install`
  - `grunt prod`
  - Database: <https://stackoverflow.com/questions/42912755/how-to-create-a-db-for-mongodb-container-on-start-up>
    - Fill database (still manual through /api/cache/import as explained above)
    - Secrets: DB access be protected by user/pwd, stored in .env file.
    - Do not deploy mongo-express (DB admin) in PRD
- To be done after
  - Code folder structure
    - Split server and client folders
    - Move Dockerfile in each
    - Split package.json
    - Check total size of node_modules
  - Tests?
  - Migrate server to express
  - Migrate client to webpack?
