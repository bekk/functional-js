'use strict';
var gulp = require('gulp');
var browserify = require('browserify');
var watchify = require('watchify');
var source = require('vinyl-source-stream');
var notify = require('gulp-notify');
var less = require('gulp-less');
var path = require('path');
var autoprefixer = require('gulp-autoprefixer');

var css = './style/**/*.less';
var js = __dirname + '/browser/main.js';

var bundle = function (bundler) {
  return bundler.bundle()
    .on('error', notify.onError('Browserification failed! <%= error.message %>'))
    .pipe(source('bundle.js'))
    .pipe(gulp.dest(__dirname + '/static/'))
    .pipe(notify('Browserification done'));
};

gulp.task('js', function () {
  var bundler = browserify(js, { debug: true });
  return bundle(browserify(js));
});

gulp.task('js-watch', function () {
  var args = watchify.args;
  args.debug = true;
  var b = browserify(js, args);
  var bundler = watchify(b);
  bundler.on('update', bundle.bind(this, bundler));
  return bundle(bundler);
});

gulp.task('less', function () {
  gulp.src('./style/main.less')
    .pipe(less({
      paths: [ path.join(__dirname, 'style', 'includes') ]
    }))
    .on('error', notify.onError('Error with less! <%= error.message %>'))
    .pipe(autoprefixer({ cascade: true }))
    .pipe(gulp.dest('./static/'))
    .pipe(notify({
      message: 'Less compiled',
      onLast: true
    }));
});

// Rerun the task when a file changes
gulp.task('watch', ['js-watch'], function() {
  gulp.watch(css, ['less']);
});


gulp.task('default', ['less', 'js']);