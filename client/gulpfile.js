var gulp = require('gulp'),
  connect = require('gulp-connect'),
    livereload = require('gulp-livereload'),
  gulpNgConfig = require('gulp-ng-config');


var paths = {
  app: './',
  src: ['./*.html', './app/**/*.html', './css/*.css', './js/**/*.js']
};

gulp.task('connect', function() {
  connect.server({
    livereload: true,
      //host: 'localhost',
    port: 2772
  });
});

gulp.task('html', function() {
  gulp.src(paths.src)
    .pipe(connect.reload());
});

gulp.task('watch', function() {
    livereload.listen();
  gulp.watch([paths.src], ['html']);
});

gulp.task('configuration', function() {
    gulp.src('configFile.json')
        .pipe(gulpNgConfig('myApp.config'))
        .pipe(gulp.dest('.'))
});

gulp.task('default', [ 'watch', 'configuration']);


