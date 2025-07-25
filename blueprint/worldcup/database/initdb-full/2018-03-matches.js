db = db.getSiblingDB('worldcup2018');
db.getCollection('matches')
    .insertMany([
        { id: 'G1', phase: 'G', day: 'Thursday 14 June 2018', hour: '17:00', stadium: '4', group: 'A', team1_id: 'RUS', team2_id: 'KSA', team1_score: 5, team2_score: 0 },
        { id: 'G2', phase: 'G', day: 'Friday 15 June 2018', hour: '14:00', stadium: '1', group: 'A', team1_id: 'EGY', team2_id: 'URU', team1_score: 0, team2_score: 1 },
        { id: 'G3', phase: 'G', day: 'Friday 15 June 2018', hour: '20:00', stadium: '11', group: 'B', team1_id: 'POR', team2_id: 'ESP', team1_score: 3, team2_score: 3 },
        { id: 'G4', phase: 'G', day: 'Friday 15 June 2018', hour: '17:00', stadium: '8', group: 'B', team1_id: 'MAR', team2_id: 'IRN', team1_score: 0, team2_score: 1 },
        { id: 'G5', phase: 'G', day: 'Saturday 16 June 2018', hour: '12:00', stadium: '3', group: 'C', team1_id: 'FRA', team2_id: 'AUS', team1_score: 2, team2_score: 1 },
        { id: 'G6', phase: 'G', day: 'Saturday 16 June 2018', hour: '18:00', stadium: '10', group: 'C', team1_id: 'PER', team2_id: 'DEN', team1_score: 0, team2_score: 1 },
        { id: 'G7', phase: 'G', day: 'Saturday 16 June 2018', hour: '15:00', stadium: '5', group: 'D', team1_id: 'ARG', team2_id: 'ISL', team1_score: 1, team2_score: 1 },
        { id: 'G8', phase: 'G', day: 'Saturday 16 June 2018', hour: '21:00', stadium: '2', group: 'D', team1_id: 'CRO', team2_id: 'NGA', team1_score: 2, team2_score: 0 },
        { id: 'G9', phase: 'G', day: 'Sunday 17 June 2018', hour: '20:00', stadium: '7', group: 'E', team1_id: 'BRA', team2_id: 'SUI', team1_score: 1, team2_score: 1 },
        { id: 'G10', phase: 'G', day: 'Sunday 17 June 2018', hour: '14:00', stadium: '9', group: 'E', team1_id: 'CRC', team2_id: 'SRB', team1_score: 0, team2_score: 1 },
        { id: 'G11', phase: 'G', day: 'Sunday 17 June 2018', hour: '17:00', stadium: '4', group: 'F', team1_id: 'GER', team2_id: 'MEX', team1_score: 0, team2_score: 1 },
        { id: 'G12', phase: 'G', day: 'Monday 18 June 2018', hour: '14:00', stadium: '6', group: 'F', team1_id: 'SWE', team2_id: 'KOR', team1_score: 1, team2_score: 0 },
        { id: 'G13', phase: 'G', day: 'Monday 18 June 2018', hour: '17:00', stadium: '11', group: 'G', team1_id: 'BEL', team2_id: 'PAN', team1_score: 3, team2_score: 0 },
        { id: 'G14', phase: 'G', day: 'Monday 18 June 2018', hour: '20:00', stadium: '12', group: 'G', team1_id: 'TUN', team2_id: 'ENG', team1_score: 1, team2_score: 2 },
        { id: 'G15', phase: 'G', day: 'Tuesday 19 June 2018', hour: '17:00', stadium: '5', group: 'H', team1_id: 'POL', team2_id: 'SEN', team1_score: 1, team2_score: 2 },
        { id: 'G16', phase: 'G', day: 'Tuesday 19 June 2018', hour: '14:00', stadium: '10', group: 'H', team1_id: 'COL', team2_id: 'JPN', team1_score: 1, team2_score: 2 },
        { id: 'G17', phase: 'G', day: 'Tuesday 19 June 2018', hour: '20:00', stadium: '8', group: 'A', team1_id: 'RUS', team2_id: 'EGY', team1_score: 3, team2_score: 1 },
        { id: 'G18', phase: 'G', day: 'Wednesday 20 June 2018', hour: '17:00', stadium: '7', group: 'A', team1_id: 'URU', team2_id: 'KSA', team1_score: 1, team2_score: 0 },
        { id: 'G19', phase: 'G', day: 'Wednesday 20 June 2018', hour: '14:00', stadium: '4', group: 'B', team1_id: 'POR', team2_id: 'MAR', team1_score: 1, team2_score: 0 },
        { id: 'G20', phase: 'G', day: 'Wednesday 20 June 2018', hour: '20:00', stadium: '3', group: 'B', team1_id: 'IRN', team2_id: 'ESP', team1_score: 0, team2_score: 1 },
        { id: 'G21', phase: 'G', day: 'Thursday 21 June 2018', hour: '17:00', stadium: '1', group: 'C', team1_id: 'FRA', team2_id: 'PER', team1_score: 1, team2_score: 0 },
        { id: 'G22', phase: 'G', day: 'Thursday 21 June 2018', hour: '14:00', stadium: '9', group: 'C', team1_id: 'DEN', team2_id: 'AUS', team1_score: 1, team2_score: 1 },
        { id: 'G23', phase: 'G', day: 'Thursday 21 June 2018', hour: '20:00', stadium: '6', group: 'D', team1_id: 'ARG', team2_id: 'CRO', team1_score: 0, team2_score: 3 },
        { id: 'G24', phase: 'G', day: 'Friday 22 June 2018', hour: '17:00', stadium: '12', group: 'D', team1_id: 'NGA', team2_id: 'ISL', team1_score: 2, team2_score: 0 },
        { id: 'G25', phase: 'G', day: 'Friday 22 June 2018', hour: '14:00', stadium: '8', group: 'E', team1_id: 'BRA', team2_id: 'CRC', team1_score: 2, team2_score: 0 },
        { id: 'G26', phase: 'G', day: 'Friday 22 June 2018', hour: '20:00', stadium: '2', group: 'E', team1_id: 'SRB', team2_id: 'SUI', team1_score: 1, team2_score: 2 },
        { id: 'G27', phase: 'G', day: 'Saturday 23 June 2018', hour: '20:00', stadium: '11', group: 'F', team1_id: 'GER', team2_id: 'SWE', team1_score: 2, team2_score: 1 },
        { id: 'G28', phase: 'G', day: 'Saturday 23 June 2018', hour: '17:00', stadium: '7', group: 'F', team1_id: 'KOR', team2_id: 'MEX', team1_score: 1, team2_score: 2 },
        { id: 'G29', phase: 'G', day: 'Saturday 23 June 2018', hour: '14:00', stadium: '5', group: 'G', team1_id: 'BEL', team2_id: 'TUN', team1_score: 5, team2_score: 2 },
        { id: 'G30', phase: 'G', day: 'Sunday 24 June 2018', hour: '14:00', stadium: '6', group: 'G', team1_id: 'ENG', team2_id: 'PAN', team1_score: 6, team2_score: 1 },
        { id: 'G31', phase: 'G', day: 'Sunday 24 June 2018', hour: '20:00', stadium: '3', group: 'H', team1_id: 'POL', team2_id: 'COL', team1_score: 0, team2_score: 3 },
        { id: 'G32', phase: 'G', day: 'Sunday 24 June 2018', hour: '17:00', stadium: '1', group: 'H', team1_id: 'JPN', team2_id: 'SEN', team1_score: 2, team2_score: 2 },
        { id: 'G33', phase: 'G', day: 'Monday 25 June 2018', hour: '16:00', stadium: '9', group: 'A', team1_id: 'URU', team2_id: 'RUS', team1_score: 3, team2_score: 0 },
        { id: 'G34', phase: 'G', day: 'Monday 25 June 2018', hour: '16:00', stadium: '12', group: 'A', team1_id: 'KSA', team2_id: 'EGY', team1_score: 2, team2_score: 1 },
        { id: 'G35', phase: 'G', day: 'Monday 25 June 2018', hour: '20:00', stadium: '10', group: 'B', team1_id: 'IRN', team2_id: 'POR', team1_score: 1, team2_score: 1 },
        { id: 'G36', phase: 'G', day: 'Monday 25 June 2018', hour: '20:00', stadium: '2', group: 'B', team1_id: 'ESP', team2_id: 'MAR', team1_score: 2, team2_score: 2 },
        { id: 'G37', phase: 'G', day: 'Tuesday 26 June 2018', hour: '16:00', stadium: '4', group: 'C', team1_id: 'DEN', team2_id: 'FRA', team1_score: 0, team2_score: 0 },
        { id: 'G38', phase: 'G', day: 'Tuesday 26 June 2018', hour: '16:00', stadium: '11', group: 'C', team1_id: 'AUS', team2_id: 'PER', team1_score: 0, team2_score: 2 },
        { id: 'G39', phase: 'G', day: 'Tuesday 26 June 2018', hour: '20:00', stadium: '8', group: 'D', team1_id: 'NGA', team2_id: 'ARG', team1_score: 1, team2_score: 2 },
        { id: 'G40', phase: 'G', day: 'Tuesday 26 June 2018', hour: '20:00', stadium: '7', group: 'D', team1_id: 'ISL', team2_id: 'CRO', team1_score: 1, team2_score: 2 },
        { id: 'G41', phase: 'G', day: 'Wednesday 27 June 2018', hour: '20:00', stadium: '5', group: 'E', team1_id: 'SRB', team2_id: 'BRA', team1_score: 0, team2_score: 2 },
        { id: 'G42', phase: 'G', day: 'Wednesday 27 June 2018', hour: '20:00', stadium: '6', group: 'E', team1_id: 'SUI', team2_id: 'CRC', team1_score: 2, team2_score: 2 },
        { id: 'G43', phase: 'G', day: 'Wednesday 27 June 2018', hour: '16:00', stadium: '3', group: 'F', team1_id: 'KOR', team2_id: 'GER', team1_score: 2, team2_score: 0 },
        { id: 'G44', phase: 'G', day: 'Wednesday 27 June 2018', hour: '16:00', stadium: '1', group: 'F', team1_id: 'MEX', team2_id: 'SWE', team1_score: 0, team2_score: 3 },
        { id: 'G45', phase: 'G', day: 'Thursday 28 June 2018', hour: '20:00', stadium: '2', group: 'G', team1_id: 'ENG', team2_id: 'BEL', team1_score: 0, team2_score: 1 },
        { id: 'G46', phase: 'G', day: 'Thursday 28 June 2018', hour: '20:00', stadium: '10', group: 'G', team1_id: 'PAN', team2_id: 'TUN', team1_score: 1, team2_score: 2 },
        { id: 'G47', phase: 'G', day: 'Thursday 28 June 2018', hour: '16:00', stadium: '12', group: 'H', team1_id: 'JPN', team2_id: 'POL', team1_score: 0, team2_score: 1 },
        { id: 'G48', phase: 'G', day: 'Thursday 28 June 2018', hour: '16:00', stadium: '9', group: 'H', team1_id: 'SEN', team2_id: 'COL', team1_score: 0, team2_score: 1 },
        { id: 'H1', phase: 'H', day: 'Saturday 30 June 2018', hour: '20:00', stadium: '11', team1_source: '1A', team2_source: '2B', team1_id: 'URU', team2_id: 'POR', team1_score: 2, team2_score: 1 },
        { id: 'H2', phase: 'H', day: 'Saturday 30 June 2018', hour: '16:00', stadium: '3', team1_source: '1C', team2_source: '2D', team1_id: 'FRA', team2_id: 'ARG', team1_score: 4, team2_score: 3 },
        { id: 'H3', phase: 'H', day: 'Sunday 01 July 2018', hour: '16:00', stadium: '4', team1_source: '1B', team2_source: '2A', team1_id: 'ESP', team2_id: 'RUS', team1_score: 1, team2_score: 1, team1_scorePK: 3, team2_scorePK: 4 },
        { id: 'H4', phase: 'H', day: 'Sunday 01 July 2018', hour: '20:00', stadium: '6', team1_source: '1D', team2_source: '2C', team1_id: 'CRO', team2_id: 'DEN', team1_score: 1, team2_score: 1, team1_scorePK: 3, team2_scorePK: 2 },
        { id: 'H5', phase: 'H', day: 'Monday 02 July 2018', hour: '16:00', stadium: '9', team1_source: '1E', team2_source: '2F', team1_id: 'BRA', team2_id: 'MEX', team1_score: 2, team2_score: 0 },
        { id: 'H6', phase: 'H', day: 'Monday 02 July 2018', hour: '20:00', stadium: '7', team1_source: '1G', team2_source: '2H', team1_id: 'BEL', team2_id: 'JPN', team1_score: 3, team2_score: 2 },
        { id: 'H7', phase: 'H', day: 'Tuesday 03 July 2018', hour: '16:00', stadium: '8', team1_source: '1F', team2_source: '2E', team1_id: 'SWE', team2_id: 'SUI', team1_score: 1, team2_score: 0 },
        { id: 'H8', phase: 'H', day: 'Tuesday 03 July 2018', hour: '20:00', stadium: '5', team1_source: '1H', team2_source: '2G', team1_id: 'COL', team2_id: 'ENG', team1_score: 1, team2_score: 1, team1_scorePK: 3, team2_scorePK: 4 },
        { id: 'Q1', phase: 'Q', day: 'Friday 06 July 2018', hour: '16:00', stadium: '6', team1_source: 'WH1', team2_source: 'WH2', team1_id: 'URU', team2_id: 'FRA', team1_score: 0, team2_score: 2 },
        { id: 'Q2', phase: 'Q', day: 'Friday 06 July 2018', hour: '20:00', stadium: '3', team1_source: 'WH5', team2_source: 'WH6', team1_id: 'BRA', team2_id: 'BEL', team1_score: 1, team2_score: 2 },
        { id: 'Q3', phase: 'Q', day: 'Saturday 07 July 2018', hour: '20:00', stadium: '11', team1_source: 'WH3', team2_source: 'WH4', team1_id: 'RUS', team2_id: 'CRO', team1_score: 2, team2_score: 2, team1_scorePK: 3, team2_scorePK: 4 },
        { id: 'Q4', phase: 'Q', day: 'Saturday 07 July 2018', hour: '16:00', stadium: '9', team1_source: 'WH7', team2_source: 'WH8', team1_id: 'SWE', team2_id: 'ENG', team1_score: 0, team2_score: 2 },
        { id: 'S1', phase: 'S', day: 'Tuesday 10 July 2018', hour: '16:00', stadium: '8', team1_source: 'WQ1', team2_source: 'WQ2', team1_id: 'FRA', team2_id: 'BEL', team1_score: 1, team2_score: 0 },
        { id: 'S2', phase: 'S', day: 'Wednesday 11 July 2018', hour: '20:00', stadium: '4', team1_source: 'WQ3', team2_source: 'WQ4', team1_id: 'CRO', team2_id: 'ENG', team1_score: 2, team2_score: 1 },
        { id: 'T1', phase: 'T', day: 'Saturday 14 July 2018', hour: '20:00', stadium: '8', team1_source: 'LS1', team2_source: 'LS2', team1_id: 'BEL', team2_id: 'ENG', team1_score: 2, team2_score: 0 },
        { id: 'F1', phase: 'F', day: 'Sunday 15 July 2018', hour: '21:00', stadium: '4', team1_source: 'WS1', team2_source: 'WS2', team1_id: 'FRA', team2_id: 'CRO', team1_score: 4, team2_score: 2 },
    ]);
