var path = require("path");
var frw = require("../../src/server/frw/frw");

module.exports = function(grunt) {
	
	grunt.registerMultiTask('mergeTemplates', 'Merge templates.', function() {
		// Merge task-specific and/or target-specific options with these defaults.
		var options = this.options({
			prefix: "src/client/templates/"
		});
		
		var tpl = new frw.Template();
		tpl.create(grunt.file.read("src/server/templates/templates.tpl"));
		
	    // Iterate over all src-dest file pairs.
	    this.files.forEach(function(f) {
	    	var src = f.orig.src;
			for (var i = 0; i < src.length; i++) {
				var id = path.basename(src[i], path.extname(src[i]));
//				grunt.log.writeln('File: ' + id + ', ' + src[i]);
				tpl.set('id', id);
				tpl.set('content', grunt.file.read(options.prefix + src[i]));
				tpl.parseBlock('template');
			}
			tpl.parse();
			
			// Write the destination file.
			grunt.file.write(f.dest, tpl.retrieve());
			
			// Print a success message.
			grunt.log.writeln('File ' + f.dest + ' created.');
	    });
	});
};
