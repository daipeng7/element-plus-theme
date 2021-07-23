/*
 * @Author: daipeng7
 * @Date: 2021-07-22 17:14:03
 * @LastEditTime: 2021-07-23 14:20:39
 * @LastEditors: daipeng7
 * @Description:
 */
const { program } = require('commander');
const main = require('../src/index.js');
const path = require('path');

const cwd = process.cwd();

const config = {
	sourcePath: path.resolve(cwd, './node_modules', './element-plus/packages/theme-chalk/src'),
	projectSourcePath: '',
	outPath: path.resolve(cwd, 'element-theme'),
	minimize: false,
	watch: false,
	browsers: ['ie > 9', 'last 2 versions']
};

console.log();
program.version(require('../package.json').version)
	.option('-i --input [filePath]', 'source file path', function (source) { config.sourcePath = source; })
	.option('-w --watch', 'watch variable changes then build')
	.option('-o --out [outPath]', 'output path', function (out) { config.outPath = out; })
	.option('-m --minimize', 'compressed file', function (minimize) { config.minimize = minimize !== false; })
	.option('-b --browsers <items>', 'set browsers', function (browsers) { config.browsers = browsers.split(','); })
	.parse(process.argv);

const options = program.opts();

if (!config.projectSourcePath) {
	config.projectSourcePath = path.resolve(config.outPath, 'src');
}

options.watch ? main.watch(config) : main.build(config)();
