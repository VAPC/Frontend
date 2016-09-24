var gulp = require('gulp');
var uglify = require('gulp-uglify');
var csso = require('gulp-csso');
var less = require('gulp-less');
var clean = require('gulp-clean');
var concat = require('gulp-concat');
var gutil = require('gulp-util');
var watch = require('gulp-watch');

require('require-dir')('./gulp');