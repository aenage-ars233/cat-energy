import gulp from 'gulp';
import plumber from 'gulp-plumber';
import less from 'gulp-less';
import postcss from 'gulp-postcss';
import autoprefixer from 'autoprefixer';
import htmlmin from 'gulp-htmlmin';
import csso from 'postcss-csso';
import rename from 'gulp-rename';
import terser from 'gulp-terser';
import {deleteAsync} from 'del';
import webp from 'gulp-webp';
import browser from 'browser-sync';

// Styles

export const styles = () => {
  return gulp.src('source/less/style.less', { sourcemaps: true })
    .pipe(plumber())
    .pipe(less())
    .pipe(postcss([
      autoprefixer(),
      csso()
    ]))
    .pipe(rename('style.min.css'))
    .pipe(gulp.dest('build/css', { sourcemaps: '.' }))
    .pipe(browser.stream());
}

//HTML

const html = () => {
  return gulp.src('source/*.html')
    .pipe(htmlmin({ collapseWhitespace: true }))
    .pipe(gulp.dest('build'));
}

//Scripts

const script = () => {
  return gulp.src('source/js/menu-toggle.js')
    .pipe(terser())
    .pipe(rename('menu-toggle.min.js'))
    .pipe(gulp.dest('build/js'));
}

//Images

const copyImages = () => {
  return gulp.src('source/img/*.{jpg, png, svg}')
    .pipe(gulp.dest('build/img'))
}

//Webp

const createWebp = () => {
  return gulp.src('source/img/**/*.{jpg, png}')
    .pipe(webp( {quality: 90}))
    .pipe(gulp.dest('build/img'))
}

//Copy

const copy = (done) => {
  gulp.src([
    'source/js/catalog-menu-toggle.js',
    'source/img/*.{jpg, png, svg}',
    'source/fonts/*.{woff2, woff}',
    'source/*.ico'
  ], {
    base: 'source'
  })
    .pipe(gulp.dest('build'))
  done();
}

//Clean

// Server

const server = (done) => {
  browser.init({
    server: {
      baseDir: 'build'
    },
    cors: true,
    notify: false,
    ui: false,
  });
  done();
}

// Watcher

const watcher = () => {
  gulp.watch('source/less/**/*.less', gulp.series(styles));
  gulp.watch('source/*.html').on('change', browser.reload);
}

//Build

const build = gulp.series(
  copy,
  gulp.parallel(
    styles,
    html,
    script,
    createWebp
  ),
);


export default gulp.series(
  styles, html, script, copy, createWebp, server, watcher
);
