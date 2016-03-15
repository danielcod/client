var gulp = require('gulp'),
    gutil = require('gulp-util');
var uglify = require('gulp-uglify');
var minifyCss = require('gulp-minify-css');
var concat = require('gulp-concat');


gulp.task('minify-css', ['moveCss'] , function() {
    return gulp.src(['assets/css/*.css','!assets/css/main.css','!assets/css/custom.css'])
        .pipe(minifyCss({compatibility: 'ie8'}))
        .pipe(concat('vendor.css'))
        .pipe(gulp.dest('./dist'));
});
gulp.task('moveCss', function() {
    return gulp.src(['assets/css/main.css','assets/css/custom.css'])
        .pipe(minifyCss())
        .pipe(concat('main.css'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('compress', function() {
    return gulp.src(
        ['./assets/js/jquery.min.js',
            './assets/js/jquery-ui.js',
            './assets/js/angular.js',
            './assets/js/angular-animate.min.js',
            './assets/js/angular-route.min.js',
            './assets/js/ui-bootstrap-tpls.min.js',
            './assets/js/ng-videosharing-embed.min.js',
            './assets/js/angular-bootstrap-lightbox.min.js',
            './assets/js/ng-sortable.min.js',
            './assets/js/bootstrap.min.js',
            './assets/js/ng-videosharing-embed.min.js',
            './assets/js/moment.min.js',
            './assets/js/daterangepicker.js',
            './assets/js/jquery.marquee.min.js'])
        .pipe(concat('vendor.js'))
        .pipe(gulp.dest('./dist'));
});

gulp.task('scripts', function() {
    return gulp.src('./scripts/**/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('./dist'));
});


gulp.task('default', ['minify-css', 'compress', 'scripts']);