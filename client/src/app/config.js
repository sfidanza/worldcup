/**********************************************************
 * Config
 **********************************************************/

export const config = {
	url: {
		templates: 'app.xml',
		data: (year) => `api/${year}/data/all`,
		editMatch: (year, mid, score1, score2, score1PK, score2PK) =>
            `api/${year}/edit/editMatch?mid=${mid}&score1=${score1}&score2=${score2}&score1PK=${score1PK}&score2PK=${score2PK}`,
		setRanks: (year, gid, ranks) => `api/${year}/edit/setRanks?gid=${gid}&ranks=${ranks}`,
		betOnChampion: (year, teamId) => `api/${year}/bet/champion?champion=${teamId}`,
		betOnMatchWinner: (year, mid, teamId) => `api/${year}/bet/match?mid=${mid}&winner=${teamId}`,
		logout: 'api/user/logout',
		login: (login) => `api/user/login?id=${login.id}&pwd=${login.pwd}`,
		register: (login) => `api/user/register?id=${login.id}&pwd=${login.pwd}&name=${login.name}`,
		auth: (provider) => `api/auth/url?provider=${provider}`,
		authProfile: (code) => `api/auth/profile?code=${code}`
	},
	getCompetitionId: (year) => (year % 4 === 2) ? 'wc' : 'e', // Worldcup or Euro?
	i18n: {
		names: {
			e: (year) => `UEFA Euro ${year}`,
			wc: (year) => `${year} FIFA Worldcup`,
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
	lang: 'en-GB'
};
