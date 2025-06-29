import sprite from '../plugins/sprite.js';

const config = {
	src: 'src/img/clubs/*.png',
	destImage: 'src/img/clubs-spritesheet.png',
	destCSS: 'src/css/clubs.css',
	cssTemplate: 'src/flags/clubs.css.handlebars',
	cssHandlebarsHelpers: {
		adjustY: (y) => y + 2,
		fifa: (name) => name,
	},
	algorithm: 'top-down',
	padding: 3
};

sprite(config);
