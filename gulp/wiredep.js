'use strict';

var gulp = require('gulp');
var inject = require('gulp-inject');

// inject bower components
gulp.task('wiredep', function () {
    var wiredep = require('wiredep').stream;

    return gulp.src('dev/index.html')
        .pipe(wiredep({
            directory: 'dev/vendor'
        }))
        .pipe(gulp.dest('dev'));
});

gulp.task('inject', function () {
    var sources = gulp.src([
        'dev/js/*.js',
        'dev/vendor/**/dist/**/*.css',
        '!dev/vendor/**/dist/**/*.min.css',
        'dev/css/import.css'
    ], {read: false});

    return gulp.src('dev/index.html')
        .pipe(inject(sources, {
            ignorePath: 'dev',
            addRootSlash: false}))
        .pipe(gulp.dest('dev'));
});

