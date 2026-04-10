/**********************************************************
 * Config
 **********************************************************/

/**
 * List of competitions (key in array is year modulo 4)
 */
const COMPETITIONS = ['euro', 'cwc', 'worldcup'];

export const config = {
	url: {
		templates: 'admin.json',
		history: 'api/2024/data/history',
		preview: (year) => `api/${year}/admin/preview`,
		setRanks: (year, gid, ranks) => `api/${year}/edit/setRanks?gid=${gid}&ranks=${ranks}`,
		logout: 'api/user/logout',
		login: (login) => `api/user/login?id=${login.id}&pwd=${login.pwd}`
	},
	getCompetitionId: (year) => COMPETITIONS[year % 4],
	i18n: {
		active: 'active',
		names: {
			cwc: (year) => `${year} FIFA Club World Cup`,
			euro: (year) => `UEFA Euro ${year}`,
			worldcup: (year) => `${year} FIFA Worldcup`,
		},
		title: (name, state) => `${name} - ${state}`,
		formats: {
			date: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' })
		}
	},
	area: {
		main: 'global-container',
		pwl: 'app-pwl',
		contents: 'contents',
		user: 'user-area'
	},
	defaultPage: 'list',
	lang: 'en-GB'
};
