db = db.getSiblingDB("euro2024");
db.getCollection("teams")
    .insertMany([
        { group: "A", id: "GER", name: "Germany", played: 3, victories: 2, draws: 1, defeats: 0, points: 7, goals_scored: 8, goals_against: 2, goal_difference: 6, rank: 1 },
        { group: "A", id: "HUN", name: "Hungary", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 3 },
        { group: "A", id: "SCO", name: "Scotland", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 2, goals_against: 7, goal_difference: -5, rank: 4 },
        { group: "A", id: "SUI", name: "Switzerland", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 5, goals_against: 3, goal_difference: 2, rank: 2 },
        { group: "B", id: "ALB", name: "Albania", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 3, goals_against: 5, goal_difference: -2, rank: 4 },
        { group: "B", id: "CRO", name: "Croatia", played: 3, victories: 0, draws: 2, defeats: 1, points: 2, goals_scored: 3, goals_against: 6, goal_difference: -3, rank: 3 },
        { group: "B", id: "ESP", name: "Spain", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 5, goals_against: 0, goal_difference: 5, rank: 1 },
        { group: "B", id: "ITA", name: "Italy", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 3, goals_against: 3, goal_difference: 0, rank: 2 },
        { group: "C", id: "DEN", name: "Denmark", played: 3, victories: 0, draws: 3, defeats: 0, points: 3, goals_scored: 2, goals_against: 2, goal_difference: 0, rank: 2 },
        { group: "C", id: "ENG", name: "England", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 2, goals_against: 1, goal_difference: 1, rank: 1 },
        { group: "C", id: "SRB", name: "Serbia", played: 3, victories: 0, draws: 2, defeats: 1, points: 2, goals_scored: 1, goals_against: 2, goal_difference: -1, rank: 4 },
        { group: "C", id: "SVN", name: "Slovenia", played: 3, victories: 0, draws: 3, defeats: 0, points: 3, goals_scored: 2, goals_against: 2, goal_difference: 0, rank: 3 },
        { group: "D", id: "AUT", name: "Austria", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 6, goals_against: 4, goal_difference: 2, rank: 1 },
        { group: "D", id: "FRA", name: "France", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 2, goals_against: 1, goal_difference: 1, rank: 2 },
        { group: "D", id: "NED", name: "Netherlands", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 4, goals_against: 4, goal_difference: 0, rank: 3 },
        { group: "D", id: "POL", name: "Poland", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 3, goals_against: 6, goal_difference: -3, rank: 4 },
        { group: "E", id: "BEL", name: "Belgium", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 2, goals_against: 1, goal_difference: 1, rank: 2 },
        { group: "E", id: "ROU", name: "Romania", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 4, goals_against: 3, goal_difference: 1, rank: 1 },
        { group: "E", id: "SVK", name: "Slovakia", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 3, goals_against: 3, goal_difference: 0, rank: 3 },
        { group: "E", id: "UKR", name: "Ukraine", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 2, goals_against: 4, goal_difference: -2, rank: 4 },
        { group: "F", id: "CZE", name: "Czechia", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 3, goals_against: 5, goal_difference: -2, rank: 4 },
        { group: "F", id: "GEO", name: "Georgia", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 4, goals_against: 4, goal_difference: 0, rank: 3 },
        { group: "F", id: "POR", name: "Portugal", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 3, goal_difference: 2, rank: 1 },
        { group: "F", id: "TUR", name: "Turkey", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 5, goal_difference: 0, rank: 2 }
    ]);
