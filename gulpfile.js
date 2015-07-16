/**
 * Module Dependencies
 */

var gulp = require('gulp');
var browserSync = require('browser-sync');
var gulpNgConfig = require('gulp-ng-config');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');

/**
 * Gulp Tasks
 */

// set up browser-sync for auto browser refresh. This has been configured to work with nodemon

gulp.task('browser-sync', ['nodemon'], function() {
    browserSync({
        proxy: "localhost:3000",  // local node app address
        port: 9000,  // use *different* port than above
        notify: false,
        browser: ["chrome"]
    });
});

// set up nodemon for restart on server changes.  This has been configured to work with browser-sync

gulp.task('nodemon', function (cb) {
    var called = false;
    return nodemon({
        script: 'server/app.js',
        ignore: [
            'gulpfile.js',
            'node_modules/',
            'client/**/*'
        ]
    })
        .on('start', function () {
            if (!called) {
                called = true;
                cb();
            }
        })
        .on('restart', function () {
            setTimeout(function () {
                reload({ stream: false });
            }, 1000);
        });
});

// client side baseUrl configuration

gulp.task('client-config', function() {
    gulp.src('client/configFile.json')
        .pipe(gulpNgConfig('myApp.config'))
        .pipe(gulp.dest('client/'))
});

// refresh browser on client side changes

gulp.task('watch', function() {
    gulp.watch(['client/app/**/*', 'client/*.html' ], reload);
});

gulp.task('default', ['browser-sync', 'client-config', 'watch']);
