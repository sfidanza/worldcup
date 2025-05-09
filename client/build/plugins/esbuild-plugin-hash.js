import fs from 'node:fs';

/**
 * Copies index.html, replacing references to js/css paths with their hashed versions
 * @param {Object} configuration
 * @param {string} configuration.srcdir - source folder (to be ignored in metafile mappings)
 * @param {string} configuration.index - filename of index.html. Taken from `srcdir` and will be placed inside `outdir`.
 */
export default (configuration) => {
	return {
		name: 'esbuild-plugin:hash',
		setup(build) {
			const outdir = build.initialOptions.outdir; // should have trailing slash
			const srcdir = configuration.srcdir; // should have trailing slash
			const indexSrc = srcdir + configuration.index;
			const indexOut = outdir + configuration.index;

			build.onStart(() => {
				if (!build.initialOptions.metafile) {
					throw new Error('metafile is not enabled');
				}
				if (!build.initialOptions.outdir) {
					throw new Error('outdir must be set');
				}
			});

			build.onEnd(async result => {
				// Load index.html
				let indexHtml = (await fs.promises.readFile(indexSrc) ?? '').toString();

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
				await fs.promises.writeFile(indexOut, indexHtml);
			});
		}
	};
};
