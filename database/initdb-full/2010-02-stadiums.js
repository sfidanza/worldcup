db = db.getSiblingDB('worldcup2010');
db.getCollection('stadiums')
    .insertMany([
        { "id": "1", "name": "Soccer City", "city": "Johannesburg" },
        { "id": "2", "name": "Ellis Park", "city": "Johannesburg" },
        { "id": "3", "name": "Mbombela", "city": "Nelspruit" },
        { "id": "4", "name": "Royal Bafokeng", "city": "Rustenburg" },
        { "id": "5", "name": "Free State", "city": "Bloemfontein" },
        { "id": "6", "name": "Green Point", "city": "Cape Town" },
        { "id": "7", "name": "Durban", "city": "Durban" },
        { "id": "8", "name": "Peter Mobaka", "city": "Polokwane" },
        { "id": "9", "name": "Nelson Mandela Bay", "city": "Port Elizabeth" },
        { "id": "10", "name": "Loftus Versfeld", "city": "Tschwane / Pretoria" }
    ]);
