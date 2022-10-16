db.getCollection('teams')
    .insertMany([
        {"id":"native-stephane","pwd":"test","name":"Stephane","isAdmin":true},
        {"id":"native-test","pwd":"test","name":"Me2"}
    ]);
