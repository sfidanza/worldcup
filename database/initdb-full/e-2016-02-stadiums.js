db = db.getSiblingDB("euro2016");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "Stade de France", city: "Paris", capacity: 81338 },
        { id: "2", name: "Stade Vélodrome", city: "Marseille", capacity: 67394 },
        { id: "3", name: "Parc OL", city: "Lyon", capacity: 59286 },
        { id: "4", name: "Stade Pierre-Mauroy", city: "Lille", capacity: 50186 },
        { id: "5", name: "Parc des Princes", city: "Paris", capacity: 48712 },
        { id: "6", name: "Nouveau Stade de Bordeaux", city: "Bordeaux", capacity: 42115 },
        { id: "7", name: "Stade Geoffroy-Guichard ", city: "Saint-Étienne", capacity: 41965 },
        { id: "8", name: "Stade Bollaert", city: "Lens", capacity: 38223 },
        { id: "9", name: "Allianz Riviera", city: "Nice", capacity: 35624 },
        { id: "10", name: "Stadium Municipal", city: "Toulouse", capacity: 33150 }
    ]);
