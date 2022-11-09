import assert from 'assert';
import engine from '../src/business/engine/leaderboard.js';

describe('Leaderboard engine', function () {
    it('should compute leaderboard with no bets', function () {
        const bets = [];
        const matches= [
            { id: 61, team1_id: 'GER', team2_id: 'BRA', team1_score: 7, team2_score: 1, phase: 'S', team1_scorePK: null, team2_scorePK: null },
            { id: 62, team1_id: 'ARG', team2_id: 'NED', team1_score: 0, team2_score: 0, phase: 'S', team1_scorePK: 4, team2_scorePK: 2 },
            { id: 64, team1_id: 'GER', team2_id: 'ARG', team1_score: 1, team2_score: 0, phase: 'F', team1_scorePK: null, team2_scorePK: null }
        ];
        const leaderboard = engine.compute(bets, matches);
        assert.deepEqual(leaderboard, []);
    });

    it('should compute leaderboard with bets', function () {
        const bets = [
            { challenge: 'champion', user: 'user1', value: 'ARG' },
            { challenge: 'match', target: 61, user: 'user1', value: 'GER' },
            { challenge: 'match', target: 64, user: 'user1', value: 'ARG' },
            { challenge: 'match', target: 61, user: 'user2', value: 'BRA' },
            { challenge: 'match', target: 62, user: 'user2', value: 'ARG' },
            { challenge: 'match', target: 64, user: 'user2', value: 'GER' }
        ];
        const matches= [
            { id: 61, team1_id: 'GER', team2_id: 'BRA', team1_score: 7, team2_score: 1, phase: 'S', team1_scorePK: null, team2_scorePK: null },
            { id: 62, team1_id: 'ARG', team2_id: 'NED', team1_score: 0, team2_score: 0, phase: 'S', team1_scorePK: 4, team2_scorePK: 2 },
            { id: 64, team1_id: 'GER', team2_id: 'ARG', team1_score: 1, team2_score: 0, phase: 'F', team1_scorePK: null, team2_scorePK: null }
        ];
        const leaderboard = engine.compute(bets, matches);
        const expected = [
            { user: 'user1', wins: 1, total: 2, ratio: 50 },
            { user: 'user2', wins: 2, total: 3, ratio: 66.66666666666667 }
        ];
        assert.deepEqual(leaderboard, expected);
    });

});
