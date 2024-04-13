db = db.getSiblingDB("euro2008");
db.getCollection("teams")
    .insertMany([
        { group: "A", id: "SUI", name: "Switzerland", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 3, goals_against: 3, goal_difference: 0, rank: 3 },
        { group: "A", id: "CZE", name: "Czech Republic", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 4, goals_against: 6, goal_difference: -2, rank: 4 },
        { group: "A", id: "POR", name: "Portugal", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 3, goal_difference: 2, rank: 1 },
        { group: "A", id: "TUR", name: "Turkey", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 5, goal_difference: 0, rank: 2 },
        { group: "B", id: "GER", name: "Germany", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 4, goals_against: 2, goal_difference: 2, rank: 2 },
        { group: "B", id: "AUT", name: "Austria", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 1, goals_against: 3, goal_difference: -2, rank: 3 },
        { group: "B", id: "CRO", name: "Croatia", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 4, goals_against: 1, goal_difference: 3, rank: 1 },
        { group: "B", id: "POL", name: "Poland", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 1, goals_against: 4, goal_difference: -3, rank: 4 },
        { group: "C", id: "FRA", name: "France", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 1, goals_against: 6, goal_difference: -5, rank: 4 },
        { group: "C", id: "ITA", name: "Italy", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 3, goals_against: 4, goal_difference: -1, rank: 2 },
        { group: "C", id: "NED", name: "Netherlands", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 9, goals_against: 1, goal_difference: 8, rank: 1 },
        { group: "C", id: "ROU", name: "Romania", played: 3, victories: 0, draws: 2, defeats: 1, points: 2, goals_scored: 1, goals_against: 3, goal_difference: -2, rank: 3 },
        { group: "D", id: "ESP", name: "Spain", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 8, goals_against: 3, goal_difference: 5, rank: 1 },
        { group: "D", id: "GRE", name: "Greece", played: 3, victories: 0, draws: 0, defeats: 3, points: 0, goals_scored: 1, goals_against: 5, goal_difference: -4, rank: 4 },
        { group: "D", id: "RUS", name: "Russia", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 4, goals_against: 4, goal_difference: 0, rank: 2 },
        { group: "D", id: "SWE", name: "Sweden", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 3, goals_against: 4, goal_difference: -1, rank: 3 }
    ]);
