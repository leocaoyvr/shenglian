// Requirements
var browserSync  = require('browser-sync').create();
var gulp         = require('gulp');
var autoprefixer = require('gulp-autoprefixer');
var plumber      = require('gulp-plumber');
var runSequence  = require('run-sequence');
var htmlclean    = require('gulp-htmlclean');
var uglify       = require('gulp-uglify');
var csso         = require('gulp-csso');
var sourcemaps   = require('gulp-sourcemaps');

// Browser Sync Dev
gulp.task('browserSync', function() {
  browserSync.init({
    notify: false,
    port: 8080,
    ghostMode: false,
    server: {
      baseDir: './dist',
      index: '/index.html'
    }
  });

  var reloadBrowser = function() {
    browserSync.reload();
  };

  gulp.watch(['./dev/assets/favicon.ico'], function() {
    runSequence('favicon', reloadBrowser);
  });

  gulp.watch(['./dev/*.html'], function() {
    runSequence('html', reloadBrowser);
  });

  gulp.watch(['./dev/assets/img/**'], function() {
    runSequence('image', reloadBrowser);
  });

  gulp.watch(['./dev/assets/vendor/**'], function() {
    runSequence('vendor', reloadBrowser);
  });

  gulp.watch(['./dev/assets/js/*'], function() {
    runSequence('script', reloadBrowser);
  });

  gulp.watch(['./dev/assets/css/**'], ['css']);
});

// css
gulp.task('css', function() {
  return gulp.src('./dev/assets/css/**')
    .pipe(plumber())
    .pipe(sourcemaps.init())
    .pipe(autoprefixer({
      browsers: ['last 2 versions', 'ie 8', 'ie 9']
    }))
    .pipe(csso({
      sourceMap: true,
      comments: false, // no comments in deployment
      debug: false
    }))
    // .pipe(sourcemaps.write()) // no sourcemaps in deployment
    .on('error', function (error) {
      console.error(error);
      this.emit('end');
    })
    .pipe(gulp.dest('./dist/assets/css/'))
    .pipe(browserSync.stream());
});

// html
gulp.task('html', function() {
  return gulp.src('./dev/*.html')
    .pipe(plumber())
    .pipe(htmlclean())
    .on('error', function (error) {
      console.error(error);
      this.emit('end');
    })
    .pipe(gulp.dest('./dist'))
});

// favicon
gulp.task('favicon', function () {
  return gulp.src('./dev/*.ico')
    .pipe(gulp.dest('./dist'))
});

// image
gulp.task('image', function () {
  return gulp.src('./dev/assets/img/**')
    .pipe(gulp.dest('./dist/assets/img/'))
});

// script
gulp.task('script', function () {
  return gulp.src('./dev/assets/js/**')
    .pipe(uglify())
    .pipe(gulp.dest('./dist/assets/js/'))
});

// vendor
gulp.task('vendor', function () {
  return gulp.src('./dev/assets/vendor/**')
    .pipe(gulp.dest('./dist/assets/vendor/'))
});

// development
gulp.task('serve', function(done) {
  runSequence('favicon', 'html', 'image', 'css', 'vendor', 'script',  'browserSync', function() {});
});
