var gulp = require('gulp'),
  source = require('vinyl-source-stream'),
  browserify = require('browserify'),
  server = require('gulp-express'),
  connect = require('gulp-connect-multi')();

  //$ = require('gulp-load-plugins')();

// Scripts
gulp.task('scripts-client', function () {
    return  browserify({
      entries: ['./app/js/client-example.jsx'],
      debug: true
    })

    .on('error', function(log) {
      console.log(log);
    })
    .bundle()
    .on('error', function(log) {
      console.log(log);
    })
    .pipe(source('client.js'))
    // .pipe($.jshint('.jshintrc'))
    // .pipe($.jshint.reporter('default'))
    .pipe(gulp.dest('app/js'))

    .pipe(connect.reload())

    //.on('error', $.util.beep);
});
gulp.task('scripts-server', function () {
    return  browserify({
      entries: ['./app/js/server-example.jsx'],
      debug: true
    })

    .on('error', function(log) {
      console.log(log);
    })
    .bundle()
    .on('error', function(log) {
      console.log(log);
    })
    .pipe(source('server.js'))
    // .pipe($.jshint('.jshintrc'))
    // .pipe($.jshint.reporter('default'))
    .pipe(gulp.dest('app/js'))
    //start the server at the beginning of the task
    .pipe(server.run({
        file: 'app.js'
    }));

    //.on('error', $.util.beep);
});


//styles
gulp.task('styles', function() {
  //for now just reload the server
  connect.reload();
});

// Connect
gulp.task('connect', connect.server({
    root: ['app'],
    port: 9003,
    livereload: true,
    open:{
    browser:  'Google Chrome' //'chrome'
  }
}));

gulp.task('watch-client', ['scripts-client', 'connect'], function () {
    gulp.watch(['app/js/**/*.js','app/js/**/*.jsx','!app/js/app.js'], ['scripts-client']);
    gulp.watch(['app/css/**.css'], ['styles']);
});
gulp.task('watch-server', ['scripts-server', 'connect'], function () {
    gulp.watch(['app/js/**/*.js','app/js/**/*.jsx','!app/js/app.js'], ['scripts-server']);
    gulp.watch(['app/css/**.css'], ['styles']);
});

gulp.task('default', ['watch-client']);
