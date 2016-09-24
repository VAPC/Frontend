'use strict';

var gulp = require('gulp');
var less = require('gulp-less');
var browserSync = require('browser-sync').create();
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);
var sourcemaps = require('gulp-sourcemaps');

gulp.task('serve', gulpsync.sync([
    'clean:index',
    'make:index',
    'vendor',
    'less',
    'dev:js',
    'copy:images',
    'copy:favicon',
]), function () {

    browserSync.init({
        server: {
            baseDir: './dev',
            directory: false
        }
    });

    gulp.watch("src/**/*.less", ['less']);
    gulp.watch("src/**/*.js", gulpsync.sync(['dev:js', 'reload']));
    gulp.watch("src/*.html", gulpsync.sync(['make:index', 'reload']));
});

gulp.task('reload', function () {
    browserSync.reload();
});

gulp.task('less', function () {
    return gulp.src("src/**/*.less")
        .pipe(sourcemaps.init())
        .pipe(less())
        .pipe(concat('style.css'))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("dev/css"))
        .pipe(browserSync.stream());
});

// js
gulp.task('dev:js', function () {
    return gulp.src([
        'src/app.js',
        'src/**/*.mdl.js',
        'src/**/*.js',
    ])
        .pipe(sourcemaps.init())
        .pipe(concat('app.js'))
        // .pipe(uglify({mangle: false}))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('dev/js'));
});

gulp.task('copy:images', function () {
    return gulp.src(['src/css/img/*.*'])
        .pipe(gulp.dest('dev/css/img'));
});

gulp.task('copy:favicon', function () {
    return gulp.src(['src/favicon.png'])
        .pipe(gulp.dest('dev'));
});

gulp.task('make:index', gulpsync.sync(['copy:index']));

gulp.task('copy:index', function () {
    return gulp.src(['src/*.html'])
        .pipe(gulp.dest('dev'));
});

gulp.task('clean:index', function () {
    del([
        'dev/*.html',
        'dev/css/**/*',
        'dev/js/**/*',
        '!dev/css/vendor.css',
        '!dev/js/vendor.js',
    ]);
});