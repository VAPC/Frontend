'use strict';

var gulp = require('gulp');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');

gulp.task('vendor', ['vendor:js', 'vendor:css']);

gulp.task('vendor:js', function () {
    return gulp.src([
        'node_modules/jquery/dist/jquery.min.js',
        'node_modules/angular/angular.min.js',
        'node_modules/angular-route/angular-route.min.js',
        'node_modules/angular-cookies/angular-cookies.min.js',
        'node_modules/angular-resource/angular-resource.min.js',
        'node_modules/bootstrap/dist/js/bootstrap.min.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev/js'));
});

gulp.task('vendor:css', function () {
    return gulp.src([
        'node_modules/bootstrap/dist/css/bootstrap-theme.css',
        'node_modules/bootstrap/dist/css/bootstrap.css',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('vendor.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dev/css"));
});