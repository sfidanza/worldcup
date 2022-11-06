db = db.getSiblingDB("worldcup1998");
db.getCollection("teams")
    .insertMany([
        { group: "A", id: "BRA", name: "Brazil", iso2: "br" },
        { group: "A", id: "NOR", name: "Norway", iso2: "no" },
        { group: "A", id: "MAR", name: "Morocco", iso2: "ma" },
        { group: "A", id: "SCO", name: "Scotland", iso2: "scotland" },
        { group: "B", id: "ITA", name: "Italy", iso2: "it" },
        { group: "B", id: "CHI", name: "Chile", iso2: "cl" },
        { group: "B", id: "AUT", name: "Austria", iso2: "at" },
        { group: "B", id: "CMR", name: "Cameroon", iso2: "cm" },
        { group: "C", id: "FRA", name: "France", iso2: "fr" },
        { group: "C", id: "DEN", name: "Denmark", iso2: "dk" },
        { group: "C", id: "RSA", name: "South Africa", iso2: "za" },
        { group: "C", id: "KSA", name: "Saudi Arabia", iso2: "sa" },
        { group: "D", id: "NGA", name: "Nigeria", iso2: "ng" },
        { group: "D", id: "PAR", name: "Paraguay", iso2: "py" },
        { group: "D", id: "ESP", name: "Spain", iso2: "es" },
        { group: "D", id: "BUL", name: "Bulgaria", iso2: "bg" },
        { group: "E", id: "NED", name: "Netherlands", iso2: "nl" },
        { group: "E", id: "MEX", name: "Mexico", iso2: "mx" },
        { group: "E", id: "BEL", name: "Belgium", iso2: "be" },
        { group: "E", id: "KOR", name: "South Korea", iso2: "kr" },
        { group: "F", id: "GER", name: "Germany", iso2: "de" },
        { group: "F", id: "YUG", name: "Yugoslavia", iso2: "yugoslavia-98" },
        { group: "F", id: "IRN", name: "Iran", iso2: "ir" },
        { group: "F", id: "USA", name: "United States", iso2: "us" },
        { group: "G", id: "ROU", name: "Romania", iso2: "ro" },
        { group: "G", id: "ENG", name: "England", iso2: "england" },
        { group: "G", id: "COL", name: "Colombia", iso2: "co" },
        { group: "G", id: "TUN", name: "Tunisia", iso2: "tn" },
        { group: "H", id: "ARG", name: "Argentina", iso2: "ar" },
        { group: "H", id: "CRO", name: "Croatia", iso2: "hr" },
        { group: "H", id: "JAM", name: "Jamaica", iso2: "jm" },
        { group: "H", id: "JPN", name: "Japan", iso2: "jp" }
      ]);
