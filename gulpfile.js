/**
 * Module Dependencies
 */
'use strict';

var gulp = require('gulp');
var browserSync = require('browser-sync');
var gulpNgConfig = require('gulp-ng-config');
var reload = browserSync.reload;
var nodemon = require('gulp-nodemon');
var browserify = require('browserify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var uglify = require('gulp-uglify');
var sourcemaps = require('gulp-sourcemaps');
var gutil = require('gulp-util');
var watchify = require('watchify');
var assign = require('lodash.assign');

var clientDeps =
    [
        'node_modules/angular/angular.js',
        'node_modules/angular-ui-router/build/angular-ui-router.js',
        'node_modules/angular-ui-bootstrap/ui-bootstrap-tpls.js',
        'node_modules/bootstrap/dist/js/bootstrap.js'
    ];

var paths = {
    scripts : 'client/app/**/*.js'
}

// add custom browserify options here
var customOpts = {
    entries: clientDeps,
    debug: true
};
var opts = assign({}, watchify.args, customOpts);
var b = watchify(browserify(opts));

gulp.task('js', bundle); // so you can run `gulp js` to build the file
b.on('update', bundle); // on any dep update, runs the bundler
b.on('log', gutil.log); // output build logs to terminal

function bundle() {
    return b.bundle()
        // log errors if they happen
        .on('error', gutil.log.bind(gutil, 'Browserify Error'))
        .pipe(source('bundle.js'))
        // optional, remove if you don't need to buffer file contents
        .pipe(buffer())
        // optional, remove if you dont want sourcemaps
        .pipe(sourcemaps.init({loadMaps: true})) // loads map from browserify file
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .pipe(sourcemaps.write('.')) // writes .map file
        .pipe(gulp.dest('client/dist'));
}

/*gulp.task('javascript', function () {
    // set up the browserify instance on a task basis
    var b = browserify({
        entries: clientDeps,
        debug: true
    });

    return b.bundle()
        .pipe(source('bundled.js'))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        // Add transformation tasks to the pipeline here.
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('client/dist'))
        .pipe(gulp.dest('client/dist/'));
});*/

gulp.task('client-deps', function() {
    gulp.src(clientDeps)
        .pipe(browserify({
            insertGlobals: true,
            debug: true
        }))
        .pipe(concat('bundled.js'))
        .pipe(gulp.dest('./client/dist/lib/'));
})

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

gulp.task('default', ['browser-sync', 'client-config', 'watch', 'js']);
