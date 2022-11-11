import gulp from 'gulp';
import sass from 'gulp-dart-sass';
import cssmin from 'gulp-cssmin';
import autoprefixer from 'gulp-autoprefixer';
import jshint from 'gulp-jshint';
import uglify from 'gulp-uglify-es';
import rename from 'gulp-rename';
import clone from 'gulp-clone';
import include from "gulp-include";
import nunjucks from 'gulp-nunjucks-render';
import htmlmin from 'gulp-htmlmin';
import typograf from 'gulp-typograf';
import squoosh from 'gulp-libsquoosh';
import { deleteAsync } from 'del';
import browserSync from 'browser-sync';

const scss = () => {
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
}

const js = () => {
    return gulp.src('src/js/scripts.js')
        .pipe(include())
        .on('error', console.log)
        .pipe(gulp.dest('dist/static/js'))
        .pipe(uglify.default())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest('dist/static/js'));
}

const njk = () => {
	return gulp.src('src/njk/pages/**/*.njk')
        .pipe(nunjucks({
            path: ['src/njk/layouts']
		}))
		.pipe(typograf({ locale: ['ru', 'en-US'], htmlEntity: { type: 'name' } }))
		// .pipe(prettier({ proseWrap: 'never', printWidth: 800, tabWidth: 4, useTabs: true }))
		.pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(gulp.dest('dist'));
}

const img = () => {
	return gulp.src('src/img/**/*')
		.pipe(
			squoosh({
				webp: {},
			})
		)
		.pipe(gulp.dest('dist/static/img'));
}

const favicons = () => {
	return gulp.src('src/favicons/**/*')
		.pipe(
			squoosh()
		)
        .pipe(gulp.dest('dist/static/favicons'));
}

const fonts = () => {
	return gulp.src('src/fonts/**/*{woff,woff2}')
        .pipe(gulp.dest('dist/static/fonts'));
}

const manifest = () => {
	return gulp.src('src/**/*{xml,json}')
        .pipe(gulp.dest('dist/'));
}

const settings = () => {
	return gulp.src('src/_redirects')
        .pipe(gulp.dest('dist/'));
}

const clean = () => {
	return deleteAsync('dist');
}

const serve = () => {
	browserSync.init({
        baseDir: './dist'
    });

    gulp.watch('src/scss/**/*.scss', gulp.series(scss));
	gulp.watch('src/njk/**/*.njk', gulp.series(njk));
    gulp.watch('src/js/**/*.js', gulp.series(js));

	gulp.watch('dist/**/*.js').on('change', browserSync.reload);
	gulp.watch('dist/**/*.html').on('change', browserSync.reload);
}

export const build = gulp.series(
	clean,
	scss,
	njk,
	js,
	img,
	favicons,
	fonts,
	manifest,
	settings
);

export default gulp.series(
	build,
	serve
);
