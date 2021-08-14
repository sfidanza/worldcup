/**********************************************************
 * Template Engine
 * 
 * regexp hints:
 *   \w is the "word" character class [A-Za-z0-9_]
 *   (?: starts a non-capturing expression
 *   (?= starts a positive lookahead expression
 * More about regular expressions: http://www.regular-expressions.info
 **********************************************************/

const MAIN = "_main";

class Template {
	constructor() {
		this.data = {}; // stores data to supplant in templates
		//	this.mode = 'default'; // 'default' supports blocks inside blocks, but create is longer
		this.mode = 'noSubBlock'; // 'noSubBlock' triggers simpler parsing (faster create)
		this.defExpr = /(?:<!-- BEGIN: ([-\w]+) -->)?([\s\S]*?)(?:<!-- END: ([-\w]+) -->|(?=<!-- BEGIN: [-\w]+ -->))/g;
		this.nsbExpr = /<!-- BEGIN: ([-\w]+) -->([\s\S]*?)<!-- END: ([-\w]+) -->/g;
	}
	/**
	 * Initialize the template object with the source text
	 *  this calls the onCreate callback, passing it any additional parameter
	 */
	create(tplText) {
		let params = Array.prototype.slice.call(arguments, 1);
		this.onCreate.apply(this, params);
		this.make(tplText.trim());
	}
	store(s, child) {
		let current;
		if (this.stack.length > 0) {
			current = this.stack[this.stack.length - 1];
			this.blocks[current] += s;
			s = "";
		} else {
			current = MAIN;
		}
		if (child) {
			this.subBlocks[current].push(child);
		}
		return s;
	}
	make(text) {
		let self = this;
		let expr = (this.mode == 'noSubBlock') ? this.nsbExpr : this.defExpr;

		this.blocks = {};
		this.subBlocks = {};
		this.parsedBlocks = {};
		this.stack = [];

		this.subBlocks[MAIN] = [];
		this.parsedBlocks[MAIN] = [];
		this.blocks[MAIN] = text.replace(expr, function (a, b, c, d) {
			if (b) { // BEGIN
				self.stack.push(b);
				self.blocks[b] = "";
				self.subBlocks[b] = [];
				self.parsedBlocks[b] = [];
				self.set("blk_" + b, "");
			}

			let r = self.store(c);

			if (d) { // END
				let closed = self.stack.pop(); // closed === d
				r = self.store("{blk_" + closed + "}", closed);
			}
			return r;
		});
	}
	/**
	 * Set a template variable to a value
	 *  if value is an object, all its properties are placed into property key
	 */
	set(key, value) {
		if (typeof value === 'object') {
			for (let p in value) {
				this.setValue(key + '.' + p, value[p]);
			}
		} else {
			this.setValue(key, value);
		}
	}
	setValue(key, value) {
		this.data[key] = (value != null) ? value : "";
	}
	get(key) {
		return this.data[key] || '';
	}
	/**
	 * Retrieve the parsed content
	 *  An optional block id can be passed to target a specific block
	 *  The targeted block content is reset
	 */
	retrieve(blkId) {
		blkId = blkId || MAIN;
		let str = this.parsedBlocks[blkId].join('');
		this.parsedBlocks[blkId] = [];
		return str;
	}
	/**
	 * Replace the placeholders in the string by the values in the object
	 */
	supplant(str, o) {
		return str.replace(/{([^{}]*)}/g,
			function (a, b) {
				let r = o[b];
				return (r !== undefined) ? r : a;
			}
		);
	}
	/**
	 * Parse the specified block
	 *  Blocks allow conditional and multiple parsing of content
	 */
	parseBlock(blkId) {
		let children = this.subBlocks[blkId];
		if (!children)
			return null;
		for (let i = 0; i < children.length; i++) {
			this.set("blk_" + children[i], this.retrieve(children[i]));
		}
		let str = this.supplant(this.blocks[blkId], this.data);
		this.parsedBlocks[blkId].push(str);
	}
	/**
	 * Parse the template
	 *  Pass any argument to the OnParse callback, that should prepare the data
	 *  (using 'set' and 'parseBlock')
	 */
	parse() {
		this.onParse.apply(this, arguments);
		this.parseBlock(MAIN);
	}
	onCreate() {
		// to be overridden
	}
	onParse(pfx, obj) {
		// to be overridden
		this.set(pfx, obj);
	}
}

module.exports = Template;
