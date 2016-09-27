var gulp = require('gulp');
var react = require('gulp-react');
var uglify = require('gulp-uglify');
var order = require("gulp-order");
var concat = require('gulp-concat');
var minifyCSS = require('gulp-minify-css');
var del = require('del');
var ignore = require('gulp-ignore');
var util = require('gulp-util');
var insert = require('gulp-insert');
var fs = require('node-fs');
var version, pckg, copyright, bumpType;

// Merge-reduce all CSS to Styles/Qwiery.min.css
gulp.task('MergeCSS', function() {
    return gulp.src('Styles/**/*.css')
        .pipe(minifyCSS())
        .pipe(concat("Qwiery.min.css"))
        .pipe(gulp.dest('Styles'));
});

// Merge-reduce all components to build/Qwiery.UI.min.js
gulp.task('MakeUglyComponents', function() {
    return gulp.src('Babble/Components/*.jsx')
        .pipe(react())
        .pipe(ignore.exclude(["**/*.map"]))
        .pipe(uglify().on('error', util.log), {mangle: true, preserveComments: false})
        .pipe(concat('Qwiery.UI.min.js'))
        .pipe(gulp.dest('build'));
    //.on('error', gutil.log);
});

// Make all components to build/Qwiery.UI.min.js
gulp.task('MakeComponents', function() {
    return gulp.src('Babble/Components/*.jsx')
        .pipe(react())
        .pipe(concat('Qwiery.UI.js'))
        .pipe(gulp.dest('build'));
});

// Uglifies the client to build/Qwiery.js
gulp.task('UglifyQwiery', function() {
    return gulp.src('Babble/Scripts/Qwiery.js')
        .pipe(uglify(), {mangle: true, preserveComments: false})
        .pipe(gulp.dest('build'));
});

// Copies to build/Qwiery.js
gulp.task('CopyQwiery', function() {
    return gulp.src('Babble/Scripts/Qwiery.js')
        .pipe(gulp.dest('build'));
});

// Removing things before making a new Gulp
gulp.task('Clean', function() {
    return del([
        'Babble/Components/**/*.map',
        'Babble/Components/**/*.js',
        'Babble/build/**/*.*',
        'Babble/Scripts/Qwiery.UI.min.js',
        'Babble/Scripts/Qwiery.all.min.js',
        'Babble/Scripts/Qwiery.all.js',
        'Styles/Qwiery.min.css'
    ]);
});

// Bumps the version
gulp.task('Bump', function() {
    var bump = require("gulp-bump");
    var options = {
        type: bumpType
    };
    gulp.src('./package.json')
        .pipe(bump(options))
        .pipe(gulp.dest('./'));

    // using the copyright.txt for the header
    //copyright = fs.readFileSync('copyright.txt', 'utf8').toString();

    // fetching info from the package
    pckg = JSON.parse(fs.readFileSync('./package.json'));
    version = pckg.version;
    //copyright = copyright.replace(/VERSION/gi, version);
    console.log("\nBuilding v" + version + "\n");
});

// Babble-Dev will create Babble/Scripts/Qwiery.all.js
gulp.task('Babble-Dev', ['Bump', 'Clean', 'MakeComponents', 'CopyQwiery'], function() {
    bumpType = 'patch'; //minor, major
    return gulp.src('build/*.js')
        .pipe(concat('Qwiery.all.js'))
        //.pipe(insert.prepend(copyright))
        .pipe(gulp.dest('Babble/Scripts'));

});
var sass = require('gulp-sass');
gulp.task('sass', function () {
    return gulp.src('./Dashboard/sass/global/components-md.scss')
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest('./Dashboard/temp/'));
});

// Babble-Release will create Scripts/Qwiery.all.min.js
gulp.task('Babble-Release', ['Clean', 'MakeUglyComponents', 'UglifyQwiery', 'MergeCSS'], function() {
    return gulp.src('build/*.js')
        .pipe(concat('Qwiery.all.min.js'))
        .pipe(insert.prepend(copyright))
        .pipe(gulp.dest('Babble/Scripts'));
});


gulp.task('default', ['Babble-Dev']);