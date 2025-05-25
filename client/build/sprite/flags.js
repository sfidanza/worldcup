import countries from './countries.json' with { type: 'json' };
import sprite from '../plugins/sprite.js';

const config = {
	src: 'src/img/flags/*.png',
	destImage: 'src/img/flags-spritesheet.png',
	destCSS: 'src/css/flags.css',
	cssTemplate: 'src/flags/flags.css.handlebars',
	cssHandlebarsHelpers: {
		adjustY: (y) => y + 2,
		fifa: (name) => countries[name] ?? name,
	},
	algorithm: 'top-down',
	padding: 3
};

sprite(config);
