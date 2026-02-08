import { ESLint } from 'eslint';

export default ({
	filter = /\.(?:jsx?|tsx?|mts|cts|mjs|cjs|vue|svelte)$/,
	...eslintOptions
} = {}) => ({
	name: 'esbuild-plugin:eslint',
	setup(build) {
		const eslint = new ESLint(eslintOptions);
		const targetFiles = [];
		build.onLoad({ filter }, ({ path }) => {
			if (!path.includes('node_modules')) {
				targetFiles.push(path);
			}
			return null;
		});

		build.onEnd(async () => {
			const results = await eslint.lintFiles(targetFiles);
			const formatter = await eslint.loadFormatter();
			const output = await formatter.format(results);

			if (eslintOptions.fix) {
				await ESLint.outputFixes(results);
			}

			if (output.length > 0) {
				console.log(output);
			}
		});
	}
});
