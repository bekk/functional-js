var gulp        = require('gulp');
var gulpif      = require('gulp-if');
var sass        = require('gulp-sass');
var path        = require('path');
var prefix      = require('gulp-autoprefixer');
var cp          = require('child_process');
var webpack     = require('gulp-webpack');
var named       = require('vinyl-named');

gulp.task('jekyll-build', function (done) {
  return cp.spawn('jekyll', ['build'], {stdio: 'inherit'})
  .on('close', done);
});

gulp.task('sass', function () {
  return gulp.src('_sass/main.scss')
  .pipe(sass({
    includePaths: ['_sass']
  }))
  .on('error', console.error.bind(console))
  .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7']))
  .pipe(gulp.dest('_site/css'))
  .pipe(gulp.dest('css'));
});

gulp.task('js', js({}));
gulp.task('js-watch', js({ watch: true }));

gulp.task('watch', ['default'], function () {
  gulp.watch([
    '!scripts/*.build.js',
    'scripts/**.js',
    'scripts/**/*.js',

  ], ['js-watch']);
  gulp.watch('_sass/**/*.scss', ['sass']);
  gulp.watch([
    // 'scripts/**/*.js',
    '_workshop/*.js',
    '**/*.html',
    '!_site/**/*',
     '**/*.md'], ['jekyll-build']);
});

gulp.task('default', ['sass', 'jekyll-build', 'js']);

function js (options) {
  return function () {
    return gulp.src('scripts/entry.js')
      .pipe(named(function (file) {
        return path.basename(file.path, path.extname(file.path)) + '.build';
      }))
      .pipe(webpack(require('./webpack')(options)))
      .pipe(gulpif(options.watch, gulp.dest('_site/scripts/'), gulp.dest('scripts/')));
  }
}
