/*
 * @Author: daipeng7
 * @Date: 2021-07-23 09:15:20
 * @LastEditTime: 2021-07-23 14:45:08
 * @LastEditors: daipeng7
 * @Description:
 */
const { series, src, dest, watch } = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const autoprefixer = require('gulp-autoprefixer');
const cssmin = require('gulp-cssmin');
const rename = require('gulp-rename');
const fsextra = require('fs-extra');
const ora = require('ora');
const path = require('path');

const noElPrefixFile = /(index|base|display)/;

function compile(config) {
	const spinner = ora('build element theme').start();
	return src(path.resolve(config.projectSourcePath, '*.scss'))
		.pipe(sass.sync())
		.pipe(autoprefixer({ cascade: false, browsers: config.browsers }))
		.pipe(cssmin())
		.pipe(rename(function (path) {
			if (!noElPrefixFile.test(path.basename)) {
				path.basename = `el-${path.basename}`;
			}
		}))
		.pipe(dest(path.resolve(config.outPath, './lib')))
		.on('end', function () {
			spinner.succeed();
		});
}

function copyfont(config) {
	const spinner = ora('build theme font').start();
	return src(path.resolve(config.projectSourcePath, './fonts/**'))
		.pipe(cssmin())
		.pipe(dest(path.resolve(config.outPath, './lib/fonts')))
		.on('end', function () {
			spinner.succeed();
		});
}

// copy source sass variable
function copySource(config) {
	const spinner = ora('Generator Source file').start();

	if (fsextra.existsSync(config.projectSourcePath)) {
		spinner.text = 'Source file already exists.';
		spinner.fail();
	} else {
		fsextra.copySync(config.sourcePath, config.projectSourcePath);
		spinner.succeed();
	}
}

// build css
function build(config) {
	if (!fsextra.existsSync(config.projectSourcePath)) {
		copySource(config);
		return series(compile.bind(undefined, config), copyfont.bind(undefined, config));
	} else {
		return series(compile.bind(undefined, config), copyfont.bind(undefined, config));
	}
}

exports.build = build;

exports.watch = function(config) {
	build(config)();
	return watch([path.resolve(config.projectSourcePath, '*.scss')], compile.bind(undefined, config));
};
