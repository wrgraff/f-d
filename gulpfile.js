var gulp = require('gulp'),
    sass = require('gulp-sass'),
    cssmin = require('gulp-cssmin'),
    autoprefixer = require('gulp-autoprefixer'),
    jshint = require('gulp-jshint'),
    uglify = require('gulp-uglify-es').default,
    rename = require('gulp-rename'),
    clone = require('gulp-clone'),
    concat = require('gulp-concat'),
    include = require("gulp-include"),
	nunjucks = require('gulp-nunjucks-render'),
	htmlmin = require('gulp-htmlmin'),
	typograf = require('gulp-typograf'),
	imagemin = require('gulp-imagemin'),
	webp = require('gulp-webp'),
	del = require('del'),
    browserSync = require('browser-sync').create();

gulp.task('scss', () => {
    return gulp.src('src/scss/style.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('dist/static/css'))
        .pipe(browserSync.stream())
        .pipe(clone())
        .pipe(cssmin())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/css'))
        .pipe(browserSync.stream());
});

gulp.task('js', () => {
    return gulp.src('src/js/scripts.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist/static/js'))
        .pipe(uglify())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/js'));
});

gulp.task('njk', () => {
	return gulp.src('src/njk/pages/**/*.njk')
        .pipe(nunjucks({
            path: ['src/njk/layouts']
		}))
		.pipe(typograf({ locale: ['ru', 'en-US'], htmlEntity: { type: 'name' } }))
		// .pipe(prettier({ proseWrap: 'never', printWidth: 800, tabWidth: 4, useTabs: true }))
		.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
});

gulp.task('img', () => {
	return gulp.src('src/img/**/*')
		.pipe(imagemin([
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 3}),
		    imagemin.svgo({
		        plugins: [
					{cleanupIDs: false},
					{removeUselessDefs: false}
		        ]
		    })
		]))
        .pipe(gulp.dest('dist/static/img'))
		.pipe(webp())
		.pipe(gulp.dest('dist/static/img'));
});

gulp.task('favicons', () => {
	return gulp.src('src/favicons/**/*')
		.pipe(imagemin([
		    imagemin.jpegtran({progressive: true}),
		    imagemin.optipng({optimizationLevel: 3}),
		    imagemin.svgo({
		        plugins: [
		            {cleanupIDs: true}
		        ]
		    })
		]))
        .pipe(gulp.dest('dist/static/favicons'));
});

gulp.task('fonts', () => {
	return gulp.src('src/fonts/**/*{woff,woff2}')
        .pipe(gulp.dest('dist/static/fonts'));
});

gulp.task('manifest', () => {
	return gulp.src('src/**/*{xml,json}')
        .pipe(gulp.dest('dist/'));
});

gulp.task('settings', () => {
	return gulp.src('src/_redirects')
        .pipe(gulp.dest('dist/'));
});

gulp.task('del', () => {
	return del('dist');
});


gulp.task('serve', () => {
	browserSync.init({
        server: "./dist"
    });

    gulp.watch('src/scss/**/*.scss', gulp.series('scss'));
	gulp.watch('src/njk/**/*.njk', gulp.series('njk'));
    gulp.watch('src/js/**/*.js', gulp.series('js'));

	gulp.watch('dist/**/*.js').on('change', browserSync.reload);
	gulp.watch('dist/**/*.html').on('change', browserSync.reload);
});

gulp.task('build', gulp.series(
	'del',
	'scss',
	'njk',
	'js',
	'img',
	'favicons',
	'fonts',
	'manifest',
	'settings'
));

gulp.task('default', gulp.series(
	'build',
	'serve'
));
