db.getCollection('users')
    .insertMany([
        {"id":"native-admin","pwd":"admin","name":"Admin","isAdmin":true},
        {"id":"native-user","pwd":"user","name":"User"}
    ]);
