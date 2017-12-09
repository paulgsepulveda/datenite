'use strict';

var gulp = require('gulp');
var sass = require('gulp-sass');
var cleanCSS = require('gulp-clean-css');

gulp.task('sass', function () {
    return gulp.src('resources/sass/bootstrap.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(cleanCSS())
      .pipe(gulp.dest('public/css'));
  });
   
gulp.task('sass:watch', function () {
    gulp.watch('./sass/**/*.scss', ['sass']);
});