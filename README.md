worldcup2014
============

A site to follow the calendar and results of the 2014 worldcup. It is deployed live at:
- http://worldcup2014.dagobah-online.com

The site is using a node.js backend to retrieve data, and a javascript frontend to display them. It is as much
a functional interest, to follow the worldcup, as a technical one, to play with technologies.

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
- for now, data is stored in json files (todo: use mongodb for storage, for easy online edition)

Development:
- 'grunt' runs jshint, then cleans and rebuild the target static folder (js/css are not minified)
- 'grunt minify' creates the minifed js/css files (not used for now, just to test)
- 'grunt watch' watches for any change on client files (img, js, css, html) to update the target folder on the fly

There will be more descriptions of the toolchain and technical choices in the wiki pages.