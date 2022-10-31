import assert from 'assert';
import engine from '../src/business/engine/foot.js';

describe('Foot engine', function () {
    it('should find winner without penalty kicks', function () {
        const match = {
            team1_id: 'BRA',
            team2_id: 'CRO',
            team1_score: 3,
            team2_score: 1,
            team1_scorePK: null,
            team2_scorePK: null
        };
        engine.defineWinner(match);
        assert.equal(match.winner, 'BRA');
        assert.equal(match.loser, 'CRO');
    });

    it('should find winner with penalty kicks', function () {
        const match = {
            team1_id: 'BRA',
            team2_id: 'CRO',
            team1_score: 2,
            team2_score: 2,
            team1_scorePK: 5,
            team2_scorePK: 4
        };
        engine.defineWinner(match);
        assert.equal(match.winner, 'BRA');
        assert.equal(match.loser, 'CRO');
    });

    it('should compute group standings', function () {
        const teams = [{ id: 'FRA' }, { id: 'DEN' }, { id: 'PER' }, { id: 'AUS' }];
        const matches = [
            { team1_id: 'FRA', team1_score: 2, team2_id: 'AUS', team2_score: 1 },
            { team1_id: 'PER', team1_score: 0, team2_id: 'DEN', team2_score: 1 },
            { team1_id: 'FRA', team1_score: 1, team2_id: 'PER', team2_score: 0 },
            { team1_id: 'DEN', team1_score: 1, team2_id: 'AUS', team2_score: 1 },
            { team1_id: 'DEN', team1_score: 0, team2_id: 'FRA', team2_score: 0 },
            { team1_id: 'AUS', team1_score: 0, team2_id: 'PER', team2_score: 2 }
        ];
        const ranked = engine.computeGroupStandings(teams, matches);
        const expected = [
            { id: 'FRA', points: 7, played: 3, victories: 2, draws: 1, defeats: 0, goals_scored: 3, goals_against: 1, goal_difference: 2, rank: 1 },
            { id: 'DEN', points: 5, played: 3, victories: 1, draws: 2, defeats: 0, goals_scored: 2, goals_against: 1, goal_difference: 1, rank: 2 },
            { id: 'PER', points: 3, played: 3, victories: 1, draws: 0, defeats: 2, goals_scored: 2, goals_against: 2, goal_difference: 0, rank: 3 },
            { id: 'AUS', points: 1, played: 3, victories: 0, draws: 1, defeats: 2, goals_scored: 2, goals_against: 5, goal_difference: -3, rank: 4 }
        ];
        assert.deepEqual(ranked, expected);
    });

});
