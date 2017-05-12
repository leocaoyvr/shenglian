// Requirements
var browserSync  = require('browser-sync').create();
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var csslint      = require('gulp-csslint');
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');

// Browser Sync Dev
gulp.task('browserSync', function() {
  browserSync.init({
    notify: false,
    port: 8080,
    ghostMode: false,
    server: {
      baseDir: './dev',
      index: '/index.html'
    }
  });

  var reloadBrowser = function() {
    browserSync.reload();
  };

  gulp.watch(['dev/*.html']).on('change', reloadBrowser);
  gulp.watch(['dev/assets/js/*.js']).on('change', reloadBrowser);
  gulp.watch(['dev/assets/img/*']).on('change', reloadBrowser);
  gulp.watch(['dev/assets/css/*.css'], ['css']);
});

// css
gulp.task('css', function() {
  return gulp.src('dev/assets/css/*.css')
    .pipe(plumber())
    .pipe(csslint('csslintrc.json'))
    .pipe(csslint.formatter())
    .pipe(csslint.formatter('fail'))
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9']
    }))
    .on('error', function (error) {
      console.error(error);
      this.emit('end');
    })
    .pipe(gulp.dest('dev/assets/css'))
    .pipe(browserSync.stream());
});

// Serve Dev
gulp.task('serve', function(done) {
  runSequence('browserSync', function() {});
});