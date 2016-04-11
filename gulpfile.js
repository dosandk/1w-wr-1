var gulp = require('gulp');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var requirejsOptimize = require('gulp-requirejs-optimize');
var eslint = require('gulp-eslint');
var minify = require('gulp-cssnano');
var preprocess = require('gulp-preprocess');
var clean = require('gulp-clean');
var connect = require('gulp-connect');

var preprocessConfig = {
    context: {
        NODE_ENV: 'development',
        IMG_PATH: 'localhost:6042/1w-wr/app/img'
    }
};

gulp.task('build', ['build-css', 'build-css-img', 'build-img', 'build-ui-min-js']);

gulp.task('clean', function () {
    return gulp.src('./dist', { read: false })
        .pipe(clean());
});

gulp.task('test', function() {
    console.error('tests were run');
});

gulp.task('build-html', function() {
    return gulp.src(['app/index.html'])
        .pipe(preprocess(preprocessConfig))
        .pipe(gulp.dest('./dist/'));
});

gulp.task('default', ['lint'], function() {
    console.error('default task');
});

gulp.task('lint', function () {
    return gulp.src(['app/js/ui/views/**/*.js'])
        // eslint() attaches the lint output to the eslint property
        // of the file object so it can be used by other modules.
        .pipe(eslint())
        // eslint.format() outputs the lint results to the console.
        // Alternatively use eslint.formatEach() (see Docs).
        .pipe(eslint.format())
        // To have the process exit with an error code (1) on
        // lint error, return the stream and pipe to failOnError last.
        .pipe(eslint.failOnError());
});

gulp.task('runLocalServer', function() {
    connect.server({
        port: 6042,
        root: './app'
    });
});

gulp.task('build-css', ['compile-scss'], function() {
    gulp.src(['./app/css/**/*.css'])
        .pipe(concat('ui.min.css'))
        .pipe(minify())
        .pipe(gulp.dest('./dist/css'));
});

gulp.task('build-img', function() {
    return gulp.src(['./app/img/**'])
        .pipe(gulp.dest('./dist/img'));
});

gulp.task('build-css-img', function() {
    return gulp.src(['./app/css/jqueryui/images/**'])
        .pipe(gulp.dest('./dist/css/images'));
});

gulp.task('build-core-min-js', function() {
    return gulp.src(['./app/js/core/main-core.js'])

        .pipe(requirejsOptimize({
            baseUrl: './app',
            name: 'js/core/main-core',
            mainConfigFile: 'app/js/core/main-core.js',
            optimize: 'uglify2',
            throwWhen: {
                optimize: true
            },
            findNestedDependencies: true,
            paths: {
                requireLib: './js/core/libs/require-2.1.22',
                'requirejs-config': 'empty'
            },
            include: ['requireLib'],
            optimizeAllPluginResources: true,
            preserveLicenseComments: false
        }))
        .pipe(concat('core.min.js'))
        .pipe(preprocess(preprocessConfig))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('build-ui-min-js', function() {
    return gulp.src(['./app/js/ui/main-ui.js'])

        .pipe(requirejsOptimize({
            baseUrl: './app',
            name: 'js/ui/main-ui',
            mainConfigFile: 'app/js/ui/main-ui.js',
            optimize: 'uglify2',
            throwWhen: {
                optimize: true
            },
            findNestedDependencies: true,
            paths: {
                requireLib: './js/core/libs/require-2.1.22'
            },
            include: ['requireLib'],
            optimizeAllPluginResources: true,
            preserveLicenseComments: false
        }))
        .pipe(concat('ui.min.js'))
        .pipe(preprocess(preprocessConfig))
        .pipe(gulp.dest('dist/js'));
});

gulp.task('compile-scss', function() {
    return gulp.src('./app/scss/**/*.scss')
        .pipe(compass({
            config_file: './config.rb',
            css: 'app/css',
            sass: 'app/scss'
        }))
        .pipe(preprocess(preprocessConfig))
        .pipe(gulp.dest('./app/css'));
});

gulp.task('compass-watch', function() {
    gulp.watch('app/scss/**/*.scss', ['compile-scss']);
});