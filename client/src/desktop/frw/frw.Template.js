/**********************************************************
 * Template Engine
 * @class
 */
export const Template = function () {};

/*
 * regexp hints:
 *   \w  is the "word" character class [A-Za-z0-9_]
 *   (?:  starts a non-capturing expression
 *   (?=  starts a positive lookahead expression
 *   
 * More about regular expressions:
 *  https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
 *  http://www.regular-expressions.info
 *  http://blog.stevenlevithan.com
 */
Template.prototype.PARSER = /<!-- (BEGIN|END): ([-\w]+) -->(.*?)(?=(?:<!-- (?:BEGIN|END): (?:[-\w]+) -->)|$)/sg;
Template.prototype.MAIN = '_main';

/**
 * Initialize the template object with the source text.
 * This calls the onCreate callback, passing it any additional parameter.
 */
Template.prototype.create = function (tplText, ...params) {
	this.onCreate(...params);

	// i18n support: replaces directly "{i18n.xxx}" by the string from the i18n repository.
	if (this.i18n) {
		tplText = tplText.replace(/{i18n\.([.\w]+)}/g, (match, key) => this.i18n[key] ?? match);
	}
	
	// Extract variables
	this.extractObjectVariables(tplText);
	
	// Main parsing
	this.make(tplText.trim());
};

Template.prototype.store = function(s, parent, child) {
	if (parent) {
		this.blocks[parent] += s;
		s = '';
	} else {
		parent = this.MAIN;
	}
	this.subBlocks[parent].push(child);
	return s;
};

Template.prototype.make = function (text) {
	this.blocks = {};
	this.subBlocks = {};
	this.parsedBlocks = {};
	const stack = [];

	this.subBlocks[this.MAIN] = [];
	this.blocks[this.MAIN] = text.replace(this.PARSER, (match, tag, blockName, content) => {
		let r;
		if (tag === 'BEGIN') {
			if (blockName in this.blocks) {
				console.error('Duplicated block <%s>.', blockName);
			}
			stack.push(blockName);
			this.blocks[blockName] = content;
			this.subBlocks[blockName] = [];
			r = '';
		} else if (tag === 'END') {
			const closed = stack.pop();
			if (closed !== blockName) {
				console.error('Incorrect block closed <%s>. Opened block was <%s>.', blockName, closed);
			}
			r = this.store('{blk_' + closed + '}' + content, stack[stack.length - 1], closed);
		}
		return r;
	});
	if (stack.length > 0) {
		console.error('There are unclosed blocks: <%s>.', stack.join('>, <'));
	}
};

/**
 * Extract variables containing '.', to optimize 'this.set' with object values.
 * No recursivity: only supports 'key.property', 'key1.key2.key3...property'
 */
Template.prototype.extractObjectVariables = function(text) {
	this.variables = {};
	const varList = text.match(/{[.\w]+}/g);
	if (varList) {
		for (const variable of varList) {
			const pos = variable.indexOf('.');
			if (pos > 1) { // account for '{' and no '.' as first character
				const objName = variable.slice(1, pos); // remove opening '{'
				const property = variable.slice(pos + 1, -1); // remove closing '}'
				if (!this.variables[objName]) {
					this.variables[objName] = {};
				}
				this.variables[objName][property] = true;
			}
		}
	}
};

/**
 * Set a template variable to a value.
 * If value is an object, all the template variables of the form 'key.property' are set to value[property].
 */
Template.prototype.set = function(key, value) {
	if (value && typeof value === 'object') { // filter out null (typeof null is "object")
		for (const p in this.variables[key]) {
			this.setValue(key + '.' + p, value[p]); // avoid recursivity (for now at least)
		}
	} else {
		this.setValue(key, value);
	}
};

Template.prototype.setValue = function (key, value) {
	this.data[key] = (value == null) ? '' : value;
};

Template.prototype.get = function (key) {
	return this.data[key] || '';
};

/**
 * Retrieve the parsed content.
 * An optional block id can be passed to target a specific block. The targeted block content is reset.
 */
Template.prototype.retrieve = function (blkId) {
	blkId = blkId || this.MAIN;
	const str = (this.parsedBlocks[blkId] || []).join('');
	this.parsedBlocks[blkId] = [];
	return str;
};

/**
 * Replace the placeholders in the string by the values in the object
 */
Template.prototype.supplant = function (str, o) {
	return str.replace(/{([.\w]+)}/g, (a, b) => o[b] ?? a);
};

/**
 * Parse the specified block.
 * Blocks allow conditional and multiple parsing of content.
 */
Template.prototype.parseBlock = function (blkId) {
	const children = this.subBlocks[blkId];
	if (!children) {
		console.error('Not existing block parsed <%s>.', blkId);
		return null;
	}
	for (const child of children) {
		this.set('blk_' + child, this.retrieve(child));
	}
	const str = this.supplant(this.blocks[blkId], this.data);
	if (!this.parsedBlocks[blkId]) this.parsedBlocks[blkId] = [];
	this.parsedBlocks[blkId].push(str);
};

/**
 * Parse the template.
 * Forward any argument to the onParse callback, that will prepare the data (using 'set' and 'parseBlock').
 */
Template.prototype.parse = function () {
	this.data = {}; // stores data to supplant in templates
	this.onParse.apply(this, arguments);
	this.parseBlock(this.MAIN);
};

/**
 * Load the parsed template
 * @param {string | DomNode} container
 * @param {string} [display] - During template load, the container will be set to `display: none`. This control the
 *                             value of the `display` property after the load. By default, the initial container
 *                             `display` is restored.
 * @param {string} [blk] - Only loads the specified subBlock in the container
 */
Template.prototype.load = function (container, display, blk) {
	if (typeof container === 'string') {
		container = document.getElementById(container);
	}
	if (container) {
		display = display || container.style.display;
		container.style.display = 'none';
		container.innerHTML = this.retrieve(blk); // assume no scripts to execute
		this.onLoad();
		container.style.display = display;
	}
};

/**
 * Standard callbacks to be overriden.
 */
Template.prototype.onCreate = function(i18nRepository) {
	// to be overridden
	this.i18n = i18nRepository;
};
Template.prototype.onParse = function (pfx, obj) {
	// to be overridden
	this.set(pfx, obj);
};
Template.prototype.onLoad = function () {
	// to be overridden
};
