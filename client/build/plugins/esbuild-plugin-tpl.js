import fs from 'node:fs';
import path from 'path';
import fastGlob from 'fast-glob';

/**
 * Bundles templates together
 * @param {Object} configuration
 * @param {string[]} configuration.files - list of file patterns to build
 * @param {string} configuration.dest - destination file to write the bundle. Will be placed inside `outdir`.
 */
export default (configuration) => {
	return {
		name: 'esbuild-plugin:tpl',
		setup(build) {
			const outdir = build.initialOptions.outdir; // should have trailing slash
			const dest = outdir + configuration.dest;

			build.onStart(() => {
				if (!build.initialOptions.outdir) {
					throw new Error('outdir must be set');
				}
			});

			build.onEnd(async () => {
				// Resolve template files patterns
				const files = await fastGlob(configuration.files);

				// Iterate over all template files
				const tpl = Object.fromEntries(await Promise.all(files.map(src => {
					const id = path.basename(src, path.extname(src));
					return fs.promises.readFile(src, 'utf-8')
						.then(contents => [id, contents]);
				})));

				// Write the destination file
				await fs.promises.writeFile(dest, JSON.stringify({ templates: tpl }));
				const size = (fs.statSync(dest).size / 1024).toFixed(2);
				console.log(`  ${dest}  ${size}kb (${files.length} templates)`);
			});
		}
	};
};
