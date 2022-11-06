db = db.getSiblingDB("worldcup1998");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "Stade de France", city: "Saint-Denis", capacity: 80000 },
        { id: "2", name: "Stade Vélodrome", city: "Marseille", capacity: 60000 },
        { id: "3", name: "Parc des Princes", city: "Paris", capacity: 48875 },
        { id: "4", name: "Stade de Gerland", city: "Lyon", capacity: 44000 },
        { id: "5", name: "Stade Félix-Bollaert", city: "Lens", capacity: 41300 },
        { id: "6", name: "Stade de la Beaujoire", city: "Nantes", capacity: 39500 },
        { id: "7", name: "Stadium de Toulouse", city: "Toulouse", capacity: 37000 },
        { id: "8", name: "Stade Geoffroy-Guichard", city: "Saint-Étienne", capacity: 36000 },
        { id: "9", name: "Parc Lescure", city: "Bordeaux", capacity: 35200 },
        { id: "10", name: "Stade de la Mosson", city: "Montpellier", capacity: 34000 }
    ]);
