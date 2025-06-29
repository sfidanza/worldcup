db = db.getSiblingDB("cwc2025");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "Rose Bowl", city: "Pasadena", capacity: 89702 },
        { id: "2", name: "MetLife Stadium", city: "East Rutherford", capacity: 82500 },
        { id: "3", name: "Bank of America Stadium ", city: "Charlotte", capacity: 74867 },
        { id: "4", name: "Mercedes-Benz Stadium", city: "Atlanta", capacity: 71000 },
        { id: "5", name: "Lumen Field", city: "Seattle", capacity: 68740 },
        { id: "6", name: "Lincoln Financial Field", city: "Philadelphia", capacity: 67594 },
        { id: "7", name: "Hard Rock Stadium", city: "Miami Gardens", capacity: 64767 },
        { id: "8", name: "Camping World Stadium", city: "Orlando", capacity: 60219 },
        { id: "9", name: "Inter&Co Stadium", city: "Orlando", capacity: 25500 },
        { id: "10", name: "Geodis Park", city: "Nashville", capacity: 30109 },
        { id: "11", name: "TQL Stadium", city: "Cincinnati", capacity: 26000 },
        { id: "12", name: "Audi Field", city: "Washington D.C.", capacity: 20000 },
    ]);
