worldcup2014
============

A site to follow the calendar and results of the 2014 worldcup

The site is using a node.js backend to retrieve data, and a javascript frontend to display them. It is as much a functional interest, to follow the worldcup, as a technical one, to play with technologies.

Functionally, the site has:
- the list of matches, locations, date/hours (France time)
- the results
- the groups schedule and results
- a final board to follow the round of 16 to the final

Technically:
- the js frontend uses a client-side template engine to display the views
- page navigation and history is handled by the js frw layer
- data is retrieved in ajax targeting the backend api
- the backend goes through nginx, proxying to node.js (todo: have nginx handle the static requests itself)
- for now, data is stored in json files (todo: use mongodb for storage, for easy online edition)
