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
		import: (year) => `api/${year}/admin/import`,
		preview: (year) => `api/${year}/admin/preview`,
		jobs: (year) => `api/${year}/admin/jobs`,
		schedule: (year) => `api/${year}/admin/schedule`,
		unschedule: (year) => `api/${year}/admin/unschedule`,
		reset: 'api/admin/reset',
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
			date: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full' }),
			datetime: new Intl.DateTimeFormat('en-GB', { dateStyle: 'full', timeStyle: 'medium' }),
		}
	},
	area: {
		main: 'global-container',
		pwl: 'app-pwl',
		contents: 'contents',
		jobs: 'jobs',
		user: 'user-area'
	},
	defaultPage: 'list',
	lang: 'en-GB'
};
