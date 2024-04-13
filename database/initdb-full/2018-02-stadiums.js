db = db.getSiblingDB("worldcup2018");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "Ekaterinburg Arena", city: "Ekaterinburg", UTC: 5 },
        { id: "2", name: "Kaliningrad Stadium", city: "Kaliningrad", UTC: 2 },
        { id: "3", name: "Kazan Arena", city: "Kazan", UTC: 3 },
        { id: "4", name: "Luzhniki Stadium", city: "Moscow", UTC: 3 },
        { id: "5", name: "Spartak Stadium", city: "Moscow", UTC: 3 },
        { id: "6", name: "Nizhny Novgorod Stadium", city: "Nizhny Novgorod", UTC: 3 },
        { id: "7", name: "Rostov Arena", city: "Rostov-on-Don", UTC: 3 },
        { id: "8", name: "Saint Petersburg Stadium", city: "Saint Petersburg", UTC: 3 },
        { id: "9", name: "Samara Arena", city: "Samara", UTC: 4 },
        { id: "10", name: "Mordovia Arena", city: "Saransk", UTC: 3 },
        { id: "11", name: "Fisht Stadium", city: "Sochi", UTC: 3 },
        { id: "12", name: "Volgograd Arena", city: "Volgograd", UTC: 3 }
    ]);
