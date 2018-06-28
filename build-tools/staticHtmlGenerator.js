var path = require('path');
var {readdir, mkdir, writeFile} = require('fs');
var {removeSync} = require('fs-extra');
var evaluate = require('eval');

function StaticHtmlGenerator(options) {
	this.options = options || {};
}

StaticHtmlGenerator.prototype = {

	apply: function (compiler) {
		// build html output and prevent creating output js file
		compiler.hooks.afterCompile.tap('kate-plugin', (compilation) => {
			// get webpack output data
			const {output: {filename}} = compilation.getStats().compilation.options;
			// get html output
			const htmlOutput = this.getOutput(compilation.assets[filename]);
			// build static html file
			this.buildOutput(htmlOutput);
			// delete js output file
			delete compilation.assets[filename];
		});

		// remove output folder if empty
		compiler.hooks.afterEmit.tap('kate-plugin', (compilation) => {
			// get webpack output data
			const {output: {path}} = compilation.getStats().compilation.options;
			// if output dir is empty delete it
			this.deleteEmptyDir(path);
		});
	},

	deleteEmptyDir: function (path) {
		readdir(path, (err, files) => {
			if (err) {
				console.log(err);
				return;
			}
			if (!files.length) removeSync(path);
		});
	},

	getOutput: function (asset) {
		const {data = {}} = this.options.output;
		// get source of the file and execute it
		const source = asset.source();
		const render = evaluate(source, '', {}, true).default;
		return render(data);
	},

	buildOutput: function (output) {
		const {file, path: outputPath} = this.options.output;
		// remove path
		removeSync(outputPath);
		// create folder and file
		mkdir(outputPath, (err) => {
			if (err) console.log(err);
			writeFile(path.resolve(outputPath, file), output, '', (err) => {
				if (err) console.log(err);
			});
		});
	},
}

module.exports = StaticHtmlGenerator;
