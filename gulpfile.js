/*eslint-disable */

var del = require('del');
var gulp = require('gulp');
var gulpsync = require('gulp-sync')(gulp);
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
  js: ['./src/js/**/*.js'],
  libJs: [
  ],
  libCss: [
  ],
  libFonts: [
  ]
};

var destinations = {
  root: './dist',
  js: './dist/js',
  css: './dist/css',
  fonts: './dist/fonts',
  img: './dist/img',
};

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



function buildScript(file) {
  var bundler = browserify(file);
  function rebundle() {
    var stream = bundler.bundle();
    return stream
    .pipe(vinylSourceStream(file))
    .pipe(gulp.dest('./dist'));
  }
  bundler.on('update', function() {
    rebundle();
    gutil.log('Rebundle...');
  });
  return rebundle();
}


gulp.task('browserify', function () {
  return buildScript(sources.app);
});



/*gulp.task('browserify', function () {
  var browserified = vinylTransform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  
  return gulp.src(sources.app)
    .pipe(browserified)
    .pipe(gulp.dest('./dist'));
});*/

gulp.task('html', function() {
  return gulp.src(sources.html)
    .pipe(gulp.dest(destinations.root));
});

gulp.task('img', function() {
  return gulp.src(sources.img)
    .pipe(gulp.dest(destinations.img));
});

gulp.task('clean', function () {
  return gulp.src('./dist/*').pipe(vinylPaths(del));
});

gulp.task('watch', function() {
  gulp.watch(sources.js, ['browserify']);
  gulp.watch(sources.html, ['html']);
});

gulp.task('default', gulpsync.sync(['clean', ['html', 'lib-js', 'lib-css', 'lib-fonts', 'browserify'], 'watch']));

