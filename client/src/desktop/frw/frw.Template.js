/* global frw */
/**********************************************************
 * Template Engine
 * 
 * regexp hints:
 *   \w is the "word" character class [A-Za-z0-9_]
 *   (?: starts a non-capturing expression
 *   (?= starts a positive lookahead expression
 * More about regular expressions: http://www.regular-expressions.info
 **********************************************************/

frw.Template = function () {
	this.data = {}; // stores data to supplant in templates
	//	this.mode = 'default'; // 'default' supports blocks inside blocks, but create is longer
	this.mode = 'noSubBlock'; // 'noSubBlock' triggers simpler parsing (faster create)
	this.defExpr = /(?:<!-- BEGIN: ([-\w]+) -->)?([\s\S]*?)(?:<!-- END: ([-\w]+) -->|(?=<!-- BEGIN: [-\w]+ -->))/g;
	this.nsbExpr = /<!-- BEGIN: ([-\w]+) -->([\s\S]*?)<!-- END: ([-\w]+) -->/g;
};
frw.Template.prototype.MAIN = "_main";

/**
 * Initialize the template object with the source text
 *  this calls the onCreate callback, passing it any additional parameter
 */
frw.Template.prototype.create = function (tplText, ...params) {
	this.onCreate(...params);
	this.make(tplText.trim());
};

frw.Template.prototype.store = function (s, child) {
	let current;
	if (this.stack.length > 0) {
		current = this.stack[this.stack.length - 1];
		this.blocks[current] += s;
		s = "";
	} else {
		current = this.MAIN;
	}
	if (child) {
		this.subBlocks[current].push(child);
	}
	return s;
};

frw.Template.prototype.make = function (text) {
	const expr = (this.mode == 'noSubBlock') ? this.nsbExpr : this.defExpr;

	this.blocks = {};
	this.subBlocks = {};
	this.parsedBlocks = {};
	this.stack = [];

	this.subBlocks[this.MAIN] = [];
	this.parsedBlocks[this.MAIN] = [];
	this.blocks[this.MAIN] = text.replace(expr, (a, b, c, d) => {
		if (b) { // BEGIN
			this.stack.push(b);
			this.blocks[b] = "";
			this.subBlocks[b] = [];
			this.parsedBlocks[b] = [];
			this.set("blk_" + b, "");
		}

		let r = this.store(c);

		if (d) { // END
			const closed = this.stack.pop(); // closed === d
			r = this.store("{blk_" + closed + "}", closed);
		}
		return r;
	});
};

/**
 * Set a template variable to a value
 *  if value is an object, all its properties are placed into key_property
 */
frw.Template.prototype.set = function (key, value) {
	if (typeof value === 'object') {
		for (const p in value) {
			this.setValue(key + '.' + p, value[p]);
		}
	} else {
		this.setValue(key, value);
	}
};

frw.Template.prototype.setValue = function (key, value) {
	this.data[key] = (value != null) ? value : "";
};

frw.Template.prototype.get = function (key) {
	return this.data[key] || '';
};

/**
 * Retrieve the parsed content
 *  An optional block id can be passed to target a specific block
 *  The targeted block content is reset
 */
frw.Template.prototype.retrieve = function (blkId) {
	blkId = blkId || this.MAIN;
	const str = this.parsedBlocks[blkId].join('');
	this.parsedBlocks[blkId] = [];
	return str;
};

/**
 * Replace the placeholders in the string by the values in the object
 */
frw.Template.prototype.supplant = function (str, o) {
	return str.replace(/{([^{}]*)}/g,
		function (a, b) {
			let r = o[b];
			return (r !== undefined) ? r : a;
		}
	);
};

/**
 * Parse the specified block
 *  Blocks allow conditional and multiple parsing of content
 */
frw.Template.prototype.parseBlock = function (blkId) {
	const children = this.subBlocks[blkId];
	if (!children) return null;
	for (const child of children) {
		this.set("blk_" + child, this.retrieve(child));
	}
	const str = this.supplant(this.blocks[blkId], this.data);
	this.parsedBlocks[blkId].push(str);
};

/**
 * Parse the template
 *  Pass any argument to the OnParse callback, that should prepare the data
 *  (using 'set' and 'parseBlock')
 */
frw.Template.prototype.parse = function () {
	this.onParse.apply(this, arguments);
	this.parseBlock(this.MAIN);
};

frw.Template.prototype.load = function (container, display, block) {
	if (typeof container === "string") {
		container = document.getElementById(container);
	}
	if (container) {
		display = display || container.style.display;
		container.style.display = "none";
		frw.dom.updateContainer(this.retrieve(block), container);
		this.onLoad.apply(this);
		container.style.display = display;
	}
};

frw.Template.prototype.onCreate = function () {
	// to be overridden
};
frw.Template.prototype.onParse = function (pfx, obj) {
	// to be overridden
	this.set(pfx, obj);
};
frw.Template.prototype.onLoad = function () {
	// to be overridden
};
