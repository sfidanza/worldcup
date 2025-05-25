'use strict';

import fs from 'node:fs';
import path from 'path';
import fastGlob from 'fast-glob';
import templater from 'spritesheet-templates';
import Spritesmith from 'spritesmith';

export default async function run(data) {
	const files = await fastGlob(data.src);

	Spritesmith.run({
		src: files,
		engine: data.engine,
		algorithm: data.algorithm,
		algorithmOpts: data.algorithmOpts,
		padding: data.padding,
		exportOpts: {
			format: 'png',
			quality: data.quality || 100
		},
		cssTemplate: data.cssTemplate,
		destImage: data.destImage,
		destCSS: data.destCSS
	}, (err, result) => {
		if (err) {
			throw err;
		}
		createImage(result, data);
		createCSS(result, data);
	});
}

async function createImage(result, data) {
	if (!data.destImage) return;

	await fs.promises.writeFile(data.destImage, result.image);
	console.log(`[spritesmith] ${data.destImage} created.`);
}

async function createCSS(result, data) {
	if (!data.destCSS) return;

	const cssFormat = 'sprite-custom';
	templater.addHandlebarsTemplate(cssFormat, fs.readFileSync(data.cssTemplate, 'utf8'));

	// register handlebars helpers
	const handlebarsHelpers = data.cssHandlebarsHelpers;
	if (handlebarsHelpers) {
		Object.entries(handlebarsHelpers).forEach(([key, helper]) => {
			templater.registerHandlebarsHelper(key, helper);
		});
	}

	const sprites = Object.entries(result.coordinates).map(([file, sprite]) => {
		// Extract name from original file path
		sprite.name = path.parse(file).name;
		sprite.source_image = file;
		return sprite;
	});

	const cssStr = templater({
		sprites: sprites,
		spritesheet: {
			image: 'img/' // fake data, needed to not break
		}
	}, {
		format: cssFormat
	});

	await fs.promises.writeFile(data.destCSS, cssStr);
	console.log(`[spritesmith] ${data.destCSS} created.`);
}
