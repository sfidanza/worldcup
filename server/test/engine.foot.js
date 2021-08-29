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

    // TODO: add tests for computeGroupStandings
});
