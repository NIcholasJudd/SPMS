var gulp = require('gulp'),
  connect = require('gulp-connect'),
  gulpNgConfig = require('gulp-ng-config');


var paths = {
  app: './',
  src: ['./*.html', './views/*.html', './css/*.css', './js/*.js']
};

gulp.task('connect', function() {
  connect.server({
    root: paths.app,
    livereload: true,
    port: 2772
  });
});

gulp.task('html', function() {
  gulp.src(paths.src)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch([paths.src], ['html']);
});

gulp.task('configuration', function() {
    gulp.src('configFile.json')
        .pipe(gulpNgConfig('myApp.config'))
        .pipe(gulp.dest('.'))
});

gulp.task('default', ['connect', 'watch', 'configuration']);


