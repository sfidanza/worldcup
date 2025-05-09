import stylelint from 'stylelint';

export default ({
	filter = /\.(css)$/,
	...stylelintOptions
} = {}) => ({
	name: 'esbuild-plugin:stylelint',
	setup(build) {
		const targetFiles = [];
		build.onLoad({ filter }, ({ path }) => {
			if (!path.includes('node_modules')) {
				targetFiles.push(path);
			}
		});

		build.onEnd(async () => {
			const result = await stylelint.lint({
				formatter: 'string',
				...stylelintOptions,
				files: targetFiles,
			});
			const { report } = result;
			if (report.length > 0) {
				console.log(report);
			}
		});
	}
});
