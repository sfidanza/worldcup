import { deleteAsync, deleteSync } from 'del';

/**
 * Cleans target folder
 * @param {Object} configuration
 * @param {string[]} [configuration.onStartPatterns=[]] - file clean patterns (onStart)
 * @param {string[]} [configuration.onEndPatterns=[]] - file clean patterns (onEnd)
 * @param {boolean} [configuration.dryRun=false] - use dry-run mode to see what's going to happen (enables verbose option automatically)
 * @param {boolean} [configuration.verbose=false] - enable verbose logging to see what's happening
 */

export default (configuration) => {
	const {
		onStartPatterns = [],
		onEndPatterns = [],
		dryRun = false,
		verbose = false,
	} = configuration;

	const logCleanFiles = (event, deletedFilePaths) => {
		if (verbose || dryRun) {
			const pfx = dryRun ? 'dryRun:' : '';
			console.log(`[${pfx}${event}] files deleted:`);
			deletedFilePaths.forEach(it => { console.log(`  ${it}`); });
		}
	};

	return {
		name: 'esbuild-plugin:clean',
		setup(build) {
			if (onStartPatterns.length) {
				build.onStart(() => {
					// Use sync delete onStart to avoid deleting new files after they are generated
					const deletedFilePaths = deleteSync(onStartPatterns, { dryRun });
					logCleanFiles('onStart', deletedFilePaths);
				});
			}

			if (onEndPatterns.length) {
				build.onEnd(async () => {
					// Use async deletion onEnd
					const deletedFilePaths = await deleteAsync(onEndPatterns, { dryRun });
					logCleanFiles('onEnd', deletedFilePaths);
				});
			}
		},
	};
};