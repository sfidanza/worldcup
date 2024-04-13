db = db.getSiblingDB("worldcup2014");
db.getCollection("stadiums")
    .insertMany([
        { id: "1", name: "Arena de Sao Paulo", city: "Sao Paulo" },
        { id: "2", name: "Estadio das Dunas", city: "Natal" },
        { id: "3", name: "Arena Fonte Nova", city: "Salvador" },
        { id: "4", name: "Arena Pantanal", city: "Cuiaba", UTC: -4},
        { id: "5", name: "Estadio Mineirao", city: "Belo Horizonte" },
        { id: "6", name: "Estadio Castelao", city: "Fortaleza" },
        { id: "7", name: "Arena Amazonia", city: "Manaus", UTC: -4 },
        { id: "8", name: "Arena Pernambuco", city: "Recife" },
        { id: "9", name: "Estadio Nacional", city: "Brasilia" },
        { id: "10", name: "Estadio Beira-Rio", city: "Porto Alegre" },
        { id: "11", name: "Maracanã - Estádio Jornalista Mário Filho", city: "Rio De Janeiro" },
        { id: "12", name: "Arena da Baixada", city: "Curitiba" }
    ]);
