/**********************************************************
 * Score Editor
 **********************************************************/
 
page.scoreEditor = {};

page.scoreEditor.initialize = function() {
	this.editor = document.getElementById("score-editor");
	this.editor.onkeydown = function(e) {
		if (e.keyCode === 38) { // Up
			frw.dom.addClass(page.scoreEditor.editor, 'small');
		} else if (e.keyCode === 40) { // Down
			frw.dom.removeClass(page.scoreEditor.editor, 'small');
		}
	};
	document.getElementById("score-editor-ok").onclick = function(e) {
		frw.stopEvent(e);
		page.scoreEditor.submitScoreEdit();
	};
	document.getElementById("score-editor-cancel").onclick = function(e) {
		frw.stopEvent(e);
		page.scoreEditor.cancelScoreEdit();
	};
};

page.scoreEditor.destroy = function() {
	this.editor = null;
};

page.scoreEditor.plug = function() {
	this.active = true;
	var calendar = document.getElementById("schedule-foot");
	if (calendar) {
		var scores = getElementsByClassName(calendar, "score");
		for (var i = 0; i < scores.length; i++) {
			scores[i].onclick = this.editScore.bind(this, scores[i]);
		}
	}
};

page.scoreEditor.unplug = function() {
	if (this.active) {
		this.active = false;
		var calendar = document.getElementById("schedule-foot");
		if (calendar) {
			var scores = getElementsByClassName(calendar, "score");
			for (var i = 0; i < scores.length; i++) {
				scores[i].onclick = null;
			}
		}
	}
};

page.scoreEditor.editScore = function(editedScore) {
	var user = page.data.user;
	if (user && user.isAdmin) {
		this.editedScore = editedScore;
		this.showScoreEditor();
	}
};

page.scoreEditor.showScoreEditor = function() {
	var pos = frw.dom.getPos(this.editedScore);
	var offsetTop = Math.round(this.editedScore.clientHeight/2) - 13;
	var offsetLeft = Math.round(this.editedScore.clientWidth/2 - this.editor.clientWidth/2) - 2;
	this.editor.style.top = (pos.top + offsetTop) + "px";
	this.editor.style.left = (pos.left + offsetLeft) + "px";
	
	var mid = this.editedScore.parentNode.id.slice(2); // match id
	var match = frw.data.query(page.data.matches, '$.id === ' + mid)[0];
	if (match) {
		this.setScore("score1", match.team1_score);
		this.setScore("score2", match.team2_score);
		this.setScore("score1PK", match.team1_scorePK);
		this.setScore("score2PK", match.team2_scorePK);
		if (match.team1_scorePK + match.team2_scorePK) { // basic check to avoid one being 0
			frw.dom.removeClass(page.scoreEditor.editor, 'small');
		} else {
			frw.dom.addClass(page.scoreEditor.editor, 'small');
		}
		this.editor.style.visibility = "visible";
		score1.focus();
	}
};

page.scoreEditor.hideScoreEditor = function() {
	this.editor.style.visibility = "hidden";
};

page.scoreEditor.submitScoreEdit = function() {
	this.hideScoreEditor();
	var score1 = this.getScore("score1");
	var score2 = this.getScore("score2");
	var score1PK = this.getScore("score1PK");
	var score2PK = this.getScore("score2PK");
	if ((score1 != null) && (score2 != null)) {
		var mid = this.editedScore.parentNode.id.slice(2); // match id
		var url = "api/edit/editMatch?mid=" + mid + "&score1=" + score1 + "&score2=" + score2 +
			"&score1PK=" + score1PK + "&score2PK=" + score2PK;
		frw.ssa.sendRequest({
			url: url,
			type: 'json',
			callback: page.scoreEditor.afterScoreEdit,
			override: page.scoreEditor
		});
	}
};

page.scoreEditor.afterScoreEdit = function(data) {
	if (data) {
		frw.data.update(page.data.matches, data.matches, "id");
		frw.data.update(page.data.teams, data.teams, "id");
		page.redrawView();
	}
	this.editedScore = null;
};

page.scoreEditor.cancelScoreEdit = function() {
	this.hideScoreEditor();
	this.editedScore = null;
	return false;
};

page.scoreEditor.getScore = function(inputId) {
	var input = document.getElementById(inputId);
	if (input) {
		if ((input.value === "") || !isNaN(+input.value)) return input.value;
	}
	return null;
};

page.scoreEditor.setScore = function(inputId, score) {
	var input = document.getElementById(inputId);
	if (input) {
		input.value = (score == null) ? '' : score;
	}
	return null;
};

/**
 * Manually set ranks in a group. Updates DB (server will check for admin rights).
 *   Ex: page.scoreEditor.setRanks('A', ['CZE', 'GRE', 'RUS', 'POL'])
 * @param String group
 * @param Array  ranks
 */
page.scoreEditor.setRanks = function(group, ranks) {
	var sRank = ranks.join('-');
	if (group && sRank) {
		var url = "api/edit/setRanks?gid=" + group + "&ranks=" + sRank;
		frw.ssa.sendRequest({
			url: url,
			type: 'json',
			callback: page.scoreEditor.afterSetRanks,
			override: page.scoreEditor
		});
	}
};

page.scoreEditor.afterSetRanks = function(data) {
	if (data) {
		frw.data.update(page.data.matches, data.matches, "id");
		frw.data.update(page.data.teams, data.teams, "id");
		page.redrawView();
	}
};
