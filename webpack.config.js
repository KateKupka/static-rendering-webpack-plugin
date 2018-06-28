const webpack = require('webpack');
const path = require('path');

const StaticHtmlGenerator = require('./build-tools/staticHtmlGenerator');

// dummy data
const data = require('./data.json');

const config = {
	mode: 'development',
	target: 'node',
	entry: './app/app.jsx',
	output: {
		path: path.resolve(process.cwd(), 'dist'),
		filename: 'app.js',
		publicPath: '/',
	},
	module: {
		rules: [
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules)/,
				use: {
					loader: 'babel-loader',
				},
			},
		],
	},
	plugins: [
		new StaticHtmlGenerator({
			output: {
				path: path.resolve(process.cwd(), 'output'),
				file: 'index.html',
				data,
			},
		}),
	]
}

const compiler = webpack(config);
compiler.run(() => {
});
