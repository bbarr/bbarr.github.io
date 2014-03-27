
var gulp = require('gulp')
var uglify = require('gulp-uglify')
var concat = require('gulp-concat')

gulp.task('build', function() {
  gulp.src([
      './src/index.js',
      './src/hub.js',
      './src/rivets_config.js',
      './src/widget.js'
    ])
    .pipe(concat('woodpecker.js'))
    .pipe(gulp.dest('./dist'))
})

gulp.task('watch', function () {
  gulp.watch('./src/*.js', [ 'build' ]);
});
