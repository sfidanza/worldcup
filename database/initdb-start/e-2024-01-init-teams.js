db = db.getSiblingDB("euro2024");
db.getCollection("teams")
    .insertMany([
        { group: "A", id: "GER", name: "Germany", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "A", id: "SCO", name: "Scotland", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "A", id: "HUN", name: "Hungary", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "A", id: "SUI", name: "Switzerland", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "B", id: "ESP", name: "Spain", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "B", id: "CRO", name: "Croatia", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "B", id: "ITA", name: "Italy", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "B", id: "ALB", name: "Albania", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "C", id: "SVN", name: "Slovenia", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "C", id: "DEN", name: "Denmark", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "C", id: "SRB", name: "Serbia", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "C", id: "ENG", name: "England", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "D", id: "POA", name: "Play-off winner A", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "D", id: "NED", name: "Netherlands", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "D", id: "AUT", name: "Austria", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "D", id: "FRA", name: "France", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "E", id: "BEL", name: "Belgium", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "E", id: "SVK", name: "Slovakia", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "E", id: "ROU", name: "Romania", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "E", id: "POB", name: "Play-off winner B", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "F", id: "TUR", name: "Turkey", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "F", id: "POC", name: "Play-off winner C", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "F", id: "POR", name: "Portugal", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 },
        { group: "F", id: "CZE", name: "Czech Republic", played: 0, victories: 0, draws: 0, defeats: 0, points: 0, goals_scored: 0, goals_against: 0, goal_difference: 0 }
    ]);
