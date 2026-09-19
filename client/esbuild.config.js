/* global process */

import * as esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { clean, hash, eslint, stylelint, tpl, worldWatcher } from '@sfidanza/netherforge';

const config = {
	logLevel: 'info',
	entryPoints: [ 'src/app/app.js', 'src/app.css', 'src/admin/admin.js', 'src/admin.css' ],
	entryNames: '[name]-[hash]',
	bundle: true,
	sourcemap: true,
	metafile: true,
	external: [ 'img/*' ],
	outdir: 'target/static/',
	plugins: [
		eslint(),
		stylelint(),
		clean({
			onStartPatterns: [ 'target/*' ]
		}),
		hash({
			srcdir: 'src/',
			index: [ 'index.html', 'admin.html' ]
		}),
		tpl({
			files: [ 'src/templates/**/*.html' ],
			dest: 'app.json'
		}),
		tpl({
			files: [ 'src/admin/templates/**/*.html' ],
			dest: 'admin.json'
		}),
		copy({
			assets: [{
				from: [ 'src/img/**/*' ],
				to: [ 'img/' ],
			}, {
				from: [ 'src/signin.html' ],
				to: [ '' ],
			}]
		})
	]
};

worldWatcher.oversee(esbuild, config);
