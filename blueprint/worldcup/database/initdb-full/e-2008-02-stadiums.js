db = db.getSiblingDB("euro2008");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "St. Jakob-Park", city: "Basel", capacity: 42500 },
        { id: "2", name: "Stade de Genève", city: "Geneva", capacity: 31228 },
        { id: "3", name: "Ernst-Happel-Stadion", city: "Vienna", capacity: 53295 },
        { id: "4", name: "Wörthersee Stadion", city: "Klagenfurt", capacity: 31957 },
        { id: "5", name: "Letzigrund", city: "Zürich", capacity: 30930 },
        { id: "6", name: "Stade de Suisse", city: "Bern", capacity: 31907 },
        { id: "7", name: "Tivoli-Neu", city: "Innsbruck", capacity: 31600 },
        { id: "8", name: "Stadion Wals-Siezenheim", city: "Salzbourg", capacity: 31895 }
    ]);
