//'use strict';
//
//var gulp = require('gulp');
//var browserSync = require('browser-sync');
//var reload = browserSync.reload;
//
//gulp.task('watch', function () {
//    gulp.watch('dev/src/{app,components}/**/*.less', ['injector:css']);
//    gulp.watch('dev/src/{app,components}/**/*.js', ['injector:js']);
//    gulp.watch('dev/elvis_components/**/*.html', ['partials_for_elvis']);
//    gulp.watch('dev/elvis_components/**/*.js', ['elvis_components:js', 'elvis_loader:js']);
//    gulp.watch('dev/elvis_components/**/*.less', ['elvis_components:css']);
//    gulp.watch('dev/assets/images/**/*', ['images']);
//    gulp.watch('bower.json', ['wiredep']);
//});
