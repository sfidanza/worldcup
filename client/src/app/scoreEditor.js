/**********************************************************
 * Score Editor
 **********************************************************/

let page, frw;

export const scoreEditor = {};

scoreEditor.initialize = function (pageRef, frwRef) {
	page = pageRef;
	frw = frwRef;
	this.editor = document.getElementById('score-editor');
	this.editor.onkeydown = function (e) {
		if (e.code === 'ArrowUp') {
			scoreEditor.editor.classList.add('small');
		} else if (e.code === 'ArrowDown') {
			scoreEditor.editor.classList.remove('small');
		}
	};
	document.getElementById('score-editor-ok').onclick = function (e) {
		e.preventDefault();
		scoreEditor.submitScoreEdit();
	};
	document.getElementById('score-editor-cancel').onclick = function (e) {
		e.preventDefault();
		scoreEditor.cancelScoreEdit();
	};
};

scoreEditor.destroy = function () {
	this.editor = null;
};

scoreEditor.plug = function () {
	this.active = true;
	const calendar = document.getElementById('schedule-foot');
	if (calendar) {
		calendar.querySelectorAll('.score').forEach(score => {
			score.onclick = this.editScore.bind(this, score);
		});
	}
};

scoreEditor.unplug = function () {
	if (this.active) {
		this.active = false;
		const calendar = document.getElementById('schedule-foot');
		if (calendar) {
			calendar.querySelectorAll('.score').forEach(score => {
				score.onclick = null;
			});
		}
	}
};

scoreEditor.editScore = function (editedScore) {
	const user = page.data.user;
	if (user && user.isAdmin) {
		this.editedScore = editedScore;
		this.showScoreEditor();
	}
};

scoreEditor.showScoreEditor = function () {
	const pos = frw.dom.getPos(this.editedScore);
	const offsetTop = Math.round(this.editedScore.clientHeight / 2) - 13;
	const offsetLeft = Math.round(this.editedScore.clientWidth / 2 - this.editor.clientWidth / 2) - 2;
	this.editor.style.top = (pos.top + offsetTop) + 'px';
	this.editor.style.left = (pos.left + offsetLeft) + 'px';

	const mid = this.editedScore.parentNode.id.slice(2); // match id
	const match = page.data.matches.find(m => m.id == mid);
	if (match) {
		this.setScore('score1', match.team1_score);
		this.setScore('score2', match.team2_score);
		this.setScore('score1PK', match.team1_scorePK);
		this.setScore('score2PK', match.team2_scorePK);
		if (match.team1_scorePK + match.team2_scorePK) { // basic check to avoid one being 0
			scoreEditor.editor.classList.remove('small');
		} else {
			scoreEditor.editor.classList.add('small');
		}
		this.editor.style.visibility = 'visible';
		document.getElementById('score1').focus();
	}
};

scoreEditor.hideScoreEditor = function () {
	this.editor.style.visibility = 'hidden';
};

scoreEditor.submitScoreEdit = function () {
	this.hideScoreEditor();
	const score1 = this.getScore('score1');
	const score2 = this.getScore('score2');
	const score1PK = this.getScore('score1PK');
	const score2PK = this.getScore('score2PK');
	if ((score1 != null) && (score2 != null)) {
		const mid = this.editedScore.parentNode.id.slice(2); // match id
		const url = 'api/edit/editMatch?mid=' + mid + '&score1=' + score1 + '&score2=' + score2 +
			'&score1PK=' + score1PK + '&score2PK=' + score2PK;
		fetch(url)
			.then(response => response.json())
			.then(data => {
				if (data) {
					frw.data.update(page.data.matches, data.matches, 'id');
					frw.data.update(page.data.teams, data.teams, 'id');
					page.redrawView();
				}
				this.editedScore = null;
			});
	}
};

scoreEditor.cancelScoreEdit = function () {
	this.hideScoreEditor();
	this.editedScore = null;
};

scoreEditor.getScore = function (inputId) {
	const input = document.getElementById(inputId);
	if (input) {
		if ((input.value === '') || !isNaN(+input.value)) return input.value;
	}
	return null;
};

scoreEditor.setScore = function (inputId, score) {
	const input = document.getElementById(inputId);
	if (input) {
		input.value = (score == null) ? '' : score;
	}
	return null;
};

/**
 * Manually set ranks in a group. Updates DB (server will check for admin rights).
 *   Ex: scoreEditor.setRanks('A', ['CZE', 'GRE', 'RUS', 'POL'])
 * @param String group
 * @param Array  ranks
 */
scoreEditor.setRanks = function (group, ranks) {
	const sRank = ranks.join('-');
	if (group && sRank) {
		fetch('api/edit/setRanks?gid=' + group + '&ranks=' + sRank)
			.then(response => response.json())
			.then(data => {
				if (data) {
					frw.data.update(page.data.matches, data.matches, 'id');
					frw.data.update(page.data.teams, data.teams, 'id');
					page.redrawView();
				}
			});
	}
};
