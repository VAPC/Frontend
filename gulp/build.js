'use strict';

var gulp = require('gulp');
var del = require('del');
var gulpsync = require('gulp-sync')(gulp);
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var inject = require('gulp-inject');
var sourcemaps = require('gulp-sourcemaps');
var imagemin = require('gulp-imagemin');
var staticHash = require('gulp-static-hash');

// paths to assets
var paths = {
    assets: {
        images: 'dev/css/img/*.*',
        api: 'dev/api/**/*',
        other: [
            'dev/*.json',
            'dev/favicon*.*'
        ]
    },
    styles: {
        project: [
            'dev/css/*.css'
        ],
        vendor: [
            'dev/vendor/**/dist/**/*.css',
            '!dev/vendor/**/dist/**/*.min.css'
        ]
    },
    scripts: {
        project: [
            'dev/src/**/*.js'
        ],
        vendor: [
            'dev/vendor/angular/angular.js',
            'dev/vendor/angular-route/angular-route.js',
            'dev/vendor/angular-sanitize/angular-sanitize.js',
            'dev/vendor/jquery/dist/jquery.js',
            'dev/vendor/bootstrap/dist/js/bootstrap.js',
            'dev/vendor/glidejs/dist/glide.js'
        ]
    }
};

gulp.task('build', gulpsync.sync([
    'build:clear',
    'build:less',
    'build:imagemin',
    'build:js',
    'build:vendor:css',
    'build:vendor:js',
    'build:copy:html',
    'build:copy:api',
    'build:copy:other',
    'build:inject',
    'build:hash'
]));

// clear build
gulp.task('build:clear', function () {
    del('build/**/*')
});

// less
gulp.task('build:less', ['less'], function () {
    return gulp.src(paths.styles.project)
        .pipe(concat('style.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('build/css'));
});

// js
gulp.task('build:js', function () {
    return gulp.src(paths.scripts.project)
        //.pipe(sourcemaps.init())
        .pipe(concat('project.js'))
        .pipe(uglify(
            {
                mangle: {toplevel: true},
                squeeze: {dead_code: false},
                codegen: {quote_keys: true}
            }
        ))
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

// vendor less
gulp.task('build:vendor:css', function () {
    return gulp.src(paths.styles.vendor)
        .pipe(concat('vendor.css'))
        .pipe(minifyCss())
        .pipe(gulp.dest('build/css'));
});

// vendor js
gulp.task('build:vendor:js', function () {
    return gulp.src(paths.scripts.vendor)
        //.pipe(sourcemaps.init())
        .pipe(concat('vendor.js'))
        .pipe(uglify())
        //.pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});

// copy html
gulp.task('build:copy:html', function () {
    return gulp.src(['dev/src/*.html'])
        .pipe(gulp.dest('build'));
});

// copy other
gulp.task('build:copy:other', function () {
    return gulp.src(paths.assets.other)
        .pipe(gulp.dest('build'));
});

// copy api
gulp.task('build:copy:api', function () {
    return gulp.src(paths.assets.api)
        .pipe(gulp.dest('build/api'));
});

// copy font, image

// imagemin
gulp.task('build:imagemin', ['copy:images', 'copy:favicon'], function () {
    return gulp.src(paths.assets.images)
        .pipe(imagemin({
            progressive: true
        }))
        .pipe(gulp.dest('build/css/img'));
});

// inject
gulp.task('build:inject', function () {
    var sources = gulp.src([
        'build/js/vendor.js',
        'build/js/project.js',
        'build/css/vendor.css',
        'build/css/style.css'
    ], {read: false});

    return gulp.src('build/index.html')
        .pipe(inject(sources, {
            ignorePath: 'build',
            addRootSlash: false
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('build:hash', function () {
    gulp.src('build/index.html')
        .pipe(staticHash({asset: 'build'}))
        .pipe(gulp.dest('build'));
});