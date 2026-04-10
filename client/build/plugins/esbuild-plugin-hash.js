import fs from 'node:fs';

/**
 * Copies html files from `srcdir` to `outdir`, replacing references to js/css paths with their hashed versions
 * @param {Object} configuration
 * @param {string} configuration.srcdir - source folder (to be ignored in metafile mappings)
 * @param {string[]} configuration.index - list of filenames, typically `['index.html']`
 */
export default (configuration) => {
	return {
		name: 'esbuild-plugin:hash',
		setup(build) {
			const outdir = build.initialOptions.outdir; // should have trailing slash
			const srcdir = configuration.srcdir; // should have trailing slash

			build.onStart(() => {
				if (!build.initialOptions.metafile) {
					throw new Error('metafile is not enabled');
				}
				if (!build.initialOptions.outdir) {
					throw new Error('outdir must be set');
				}
			});

			build.onEnd(async result => {
				for (const indexFile of configuration.index) {
					// Load index.html
					let indexHtml = (await fs.promises.readFile(srcdir + indexFile) ?? '').toString();

					// Parse metafile and replace hashed filenames in memory
					if (result.metafile?.outputs) {
						Object.entries(result.metafile.outputs).forEach(([ output, input ]) => {
							if (input.entryPoint) {
								const target = output.replace(outdir, '');
								const source = input.entryPoint.replace(srcdir, '');
								// console.log(`target: ${target}, source: ${source}`);
								indexHtml = indexHtml.replace(source, target);
							}
						});
					}

					// Save target index.html
					await fs.promises.writeFile(outdir + indexFile, indexHtml);
				}
			});
		}
	};
};
