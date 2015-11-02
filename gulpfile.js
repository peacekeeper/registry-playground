var del = require('del');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
var gulpbower = require('gulp-bower');
var gulpstreamify = require('gulp-streamify')
var gulpuglify = require('gulp-uglify')
var concat = require('gulp-concat');
var rename = require('gulp-rename');
var vinylTransform = require('vinyl-transform');
var vinylPaths = require('vinyl-paths');
var vinylSourceStream = require('vinyl-source-stream');
var browserify = require('browserify');

var sources = {
  app: './src/app.js',
  html: './src/index.html',
  img: './src/img/**/*',
  libJs: [
    './src/js/**/*.js'
  ],
  libCss: [
    './src/css/**/*.css'
  ],
  libFonts: [
  ]
};

var destinations = {
  html: './dist',
  bower: './dist/bower',
  img: './dist/img',
  js: './dist/js',
  css: './dist/css',
  fonts: './dist/fonts',
};

gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulp.dest(destinations.html));
});

gulp.task('bower', function() {
  return gulpbower()
    .pipe(gulp.dest(destinations.bower))
});

gulp.task('img', function() {
  return gulp.src(sources.img)
    .pipe(gulp.dest(destinations.img));
});

gulp.task('lib-js', function() {
  return gulp.src(sources.libJs)
    .pipe(concat('lib.js'))
    .pipe(gulp.dest(destinations.js));
});

gulp.task('lib-css', function() {
  return gulp.src(sources.libCss)
    .pipe(concat('lib.css'))
    .pipe(gulp.dest(destinations.css));
});

gulp.task('lib-fonts', function() {
  return gulp.src(sources.libFonts)
    .pipe(gulp.dest(destinations.fonts));
});

gulp.task('browserify', function() {
  var bundleStream = browserify(sources.app).bundle();

  bundleStream
    .pipe(vinylSourceStream('index.js'))
    .pipe(gulpstreamify(gulpuglify()))
    .pipe(rename('app.js'))
    .pipe(gulp.dest('./dist'));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*').pipe(vinylPaths(del));
});

gulp.task('default', gulpsync.sync(['clean', ['html', 'bower', 'img', 'lib-js', 'lib-css', 'lib-fonts', 'browserify']]));

