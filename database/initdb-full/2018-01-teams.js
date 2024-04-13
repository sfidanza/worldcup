db = db.getSiblingDB("worldcup2018");
db.getCollection("teams")
    .insertMany([
        { group: "A", id: "URU", name: "Uruguay", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 5, goals_against: 0, goal_difference: 5, rank: 1 },
        { group: "A", id: "RUS", name: "Russia", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 8, goals_against: 4, goal_difference: 4, rank: 2 },
        { group: "A", id: "KSA", name: "Saudi Arabia", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 7, goal_difference: -5, rank: 3 },
        { group: "A", id: "EGY", name: "Egypt", played: 3, victories: 0, draws: 0, defeats: 3, points: 0, goals_scored: 2, goals_against: 6, goal_difference: -4, rank: 4 },
        { group: "B", id: "ESP", name: "Spain", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 6, goals_against: 5, goal_difference: 1, rank: 1 },
        { group: "B", id: "POR", name: "Portugal", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 5, goals_against: 4, goal_difference: 1, rank: 2 },
        { group: "B", id: "IRN", name: "Iran", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 2, goals_against: 2, goal_difference: 0, rank: 3 },
        { group: "B", id: "MAR", name: "Morocco", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 2, goals_against: 4, goal_difference: -2, rank: 4 },
        { group: "C", id: "FRA", name: "France", played: 3, victories: 2, draws: 1, defeats: 0, points: 7, goals_scored: 3, goals_against: 1, goal_difference: 2, rank: 1 },
        { group: "C", id: "DEN", name: "Denmark", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 2, goals_against: 1, goal_difference: 1, rank: 2 },
        { group: "C", id: "PER", name: "Peru", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 2, goal_difference: 0, rank: 3 },
        { group: "C", id: "AUS", name: "Australia", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 4 },
        { group: "D", id: "CRO", name: "Croatia", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 7, goals_against: 1, goal_difference: 6, rank: 1 },
        { group: "D", id: "ARG", name: "Argentina", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 3, goals_against: 5, goal_difference: -2, rank: 2 },
        { group: "D", id: "NGA", name: "Nigeria", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 3, goals_against: 4, goal_difference: -1, rank: 3 },
        { group: "D", id: "ISL", name: "Iceland", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 4 },
        { group: "E", id: "BRA", name: "Brazil", played: 3, victories: 2, draws: 1, defeats: 0, points: 7, goals_scored: 5, goals_against: 1, goal_difference: 4, rank: 1 },
        { group: "E", id: "SUI", name: "Switzerland", played: 3, victories: 1, draws: 2, defeats: 0, points: 5, goals_scored: 5, goals_against: 4, goal_difference: 1, rank: 2 },
        { group: "E", id: "SRB", name: "Serbia", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 4, goal_difference: -2, rank: 3 },
        { group: "E", id: "CRC", name: "Costa Rica", played: 3, victories: 0, draws: 1, defeats: 2, points: 1, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 4 },
        { group: "F", id: "SWE", name: "Sweden", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 2, goal_difference: 3, rank: 1 },
        { group: "F", id: "MEX", name: "Mexico", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 3, goals_against: 4, goal_difference: -1, rank: 2 },
        { group: "F", id: "KOR", name: "South Korea", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 3, goals_against: 3, goal_difference: 0, rank: 3 },
        { group: "F", id: "GER", name: "Germany", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 4, goal_difference: -2, rank: 4 },
        { group: "G", id: "BEL", name: "Belgium", played: 3, victories: 3, draws: 0, defeats: 0, points: 9, goals_scored: 9, goals_against: 2, goal_difference: 7, rank: 1 },
        { group: "G", id: "ENG", name: "England", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 8, goals_against: 3, goal_difference: 5, rank: 2 },
        { group: "G", id: "TUN", name: "Tunisia", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 5, goals_against: 8, goal_difference: -3, rank: 3 },
        { group: "G", id: "PAN", name: "Panama", played: 3, victories: 0, draws: 0, defeats: 3, points: 0, goals_scored: 2, goals_against: 11, goal_difference: -9, rank: 4 },
        { group: "H", id: "COL", name: "Colombia", played: 3, victories: 2, draws: 0, defeats: 1, points: 6, goals_scored: 5, goals_against: 2, goal_difference: 3, rank: 1 },
        { group: "H", id: "JPN", name: "Japan", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 4, goals_against: 4, goal_difference: 0, rank: 2 },
        { group: "H", id: "SEN", name: "Senegal", played: 3, victories: 1, draws: 1, defeats: 1, points: 4, goals_scored: 4, goals_against: 4, goal_difference: 0, rank: 3 },
        { group: "H", id: "POL", name: "Poland", played: 3, victories: 1, draws: 0, defeats: 2, points: 3, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 4 }
    ]);
