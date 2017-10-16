'use strict';

// let gulp = require('gulp');
let gulp = require('gulp-help')(require('gulp'));

let merge = require('merge-stream');
let del = require('del');
let runSequence = require('run-sequence');


gulp.task('copy', 'Copy site files (polyfills, etc.) to dist/', function () {

  let app = gulp.src([
    '*',
    '!{README.md,package.json,gulpfile.js,yarn.lock}'
  ], {nodir: true})
    .pipe(gulp.dest('dist'));

  let src = gulp.src([
    'src/*',
    'src/**/*',
    '!{src/*.pyc, src/**/*.pyc}'
  ], {nodir: true})
    .pipe(gulp.dest('dist/src'));

  let admin = gulp.src([
    'bq-square-admin/dist/*',
    'bq-square-admin/dist/**/*'
  ], {base: 'bq-square-admin/'})
    .pipe(gulp.dest('dist/admin'));

  return merge(app, src, admin)

});

gulp.task('clean', 'Remove dist/ and other built files', function () {
  return del(['dist']);
});

// Default task. Build the dest dir.
gulp.task('default', 'Build site', ['clean'], function (done) {
  runSequence(
    'copy',
    done);
});
