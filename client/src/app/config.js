/**********************************************************
 * Config
 **********************************************************/

const FEATURE_TOGGLES = {
	LIVE: false // enable live updates using server-sent events
};

/**
 * Support query parameter override for feature toggles: ?OV_LIVE=true
 */
const overrides = Object.fromEntries(
	new URLSearchParams(window.location.search).entries()
		.filter(([k]) => k.startsWith('OV_'))
		.map(([k, v]) => [k.slice(3), v])
);

function isEnabled(ft) {
	const override = overrides[ft];
	return override ? (/^TRUE$/i).test(override) : !!FEATURE_TOGGLES[ft];
}

export const config = {
	url: {
		templates: 'app.json',
		data: (year) => `api/${year}/data/all`,
		editMatch: (year, mid, score1, score2, score1PK, score2PK) =>
            `api/${year}/edit/editMatch?mid=${mid}&score1=${score1}&score2=${score2}&score1PK=${score1PK}&score2PK=${score2PK}`,
		setRanks: (year, gid, ranks) => `api/${year}/edit/setRanks?gid=${gid}&ranks=${ranks}`,
		betOnChampion: (year, teamId) => `api/${year}/bet/champion?champion=${teamId}`,
		betOnMatchWinner: (year, mid, teamId) => `api/${year}/bet/match?mid=${mid}&winner=${teamId}`,
		live: 'api/live',
		logout: 'api/user/logout',
		login: (login) => `api/user/login?id=${login.id}&pwd=${login.pwd}`,
		register: (login) => `api/user/register?id=${login.id}&pwd=${login.pwd}&name=${login.name}`,
		auth: (provider) => `api/auth/url?provider=${provider}`,
		authProfile: (code) => `api/auth/profile?code=${code}`
	},
	getCompetitionId: (year) => (year % 4 === 2) ? 'worldcup' : 'euro', // Worldcup or Euro?
	i18n: {
		names: {
			euro: (year) => `UEFA Euro ${year}`,
			worldcup: (year) => `${year} FIFA Worldcup`,
		},
		title: (name, state) => `${name} - ${state}`,
		group: (group) => `Group ${group}`,
		phaseG: 'Group Matches',
		phaseH: 'Round of 16',
		phaseQ: 'Quarter-Finals',
		phaseS: 'Semi-Finals',
		phaseT: 'Third place',
		phaseF: 'Final',
		formats: {
			date: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' })
		}
	},
	area: {
		main: 'global-container',
		pwl: 'app-pwl',
		contents: 'contents',
		user: 'user-area',
		loginDlg: 'login-dlg'
	},
	defaultYear: '2022',
	defaultPage: 'schedule',
	lang: 'en-GB',
	ft: { // Feature Toggles
		get LIVE() { return isEnabled('LIVE'); }
	}
};
