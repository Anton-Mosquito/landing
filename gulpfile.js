const gulp = require('gulp');
const browserSync = require('browser-sync').create();
const pug = require('gulp-pug');
const sass = require('gulp-sass');
const spritesmith = require('gulp.spritesmith');
const rimraf = require('rimraf');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const concat = require('gulp-concat');

// Static server
gulp.task('server', function() {
    browserSync.init({
        server: {
            port: 9000,
            baseDir: "build"
        }
    });
    gulp.watch('build/**/*').on('change', browserSync.reload);
});

/*------------------Pug Compile------------------------*/
gulp.task('tamplates:compile', function buildHTML() {
    return gulp.src('source/template/index.pug')
        .pipe(pug({
            pretty: true
        }))
        .pipe(gulp.dest('build'))
});

/*------------------Style Compile------------------------*/
gulp.task('styles:compile', function() {
    return gulp.src("source/styles/main.scss")
        .pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
        .pipe(rename('main.min.css'))
        .pipe(gulp.dest("build/css"))
});


/*--------------------Sprites--------------------------*/
gulp.task('sprite', function(cb) {
    var spriteData = gulp.src('source/images/icons/*.png').pipe(spritesmith({
        imgName: 'sprite.png',
        imagePath: '../images/sprite.png',
        cssName: 'sprite.scss'
    }));
    spriteData.img.pipe(gulp.dest('build/images/'));
    spriteData.css.pipe(gulp.dest('source/styles/global/'));
    cb();
});

/*--------------- Delete ---------------------------------*/
gulp.task('clean', function del(cb) {
    return rimraf('build', cb)
});


/*---------------Copy fonts ----------------------------*/
gulp.task('copy:fonts', function() {
    return gulp.src('./source/fonts/**/*.*')
        .pipe(gulp.dest('build/fonts'));
});


/*---------------Copy images ----------------------------*/
gulp.task('copy:images', function() {
    return gulp.src('./source/images/**/*.*')
        .pipe(gulp.dest('build/images'));
});

/*---------------Copy---------------------------*/
gulp.task('copy', gulp.parallel('copy:fonts', 'copy:images'));



/*-------------- Watch ------------------------*/
gulp.task('watch', function() {
    gulp.watch('source/tamplate/**/*.pug', gulp.series('tamplates:compile'));
    gulp.watch('source/styles/**/*.scss', gulp.series('styles:compile'));
});


/* ------------ Auto-----------------*/
gulp.task('autoprefixer', function() {
    gulp.src('./source/styles/main.scss')
        .pipe(autoprefixer({
            cascade: false
        }))
        .pipe(gulp.dest('build/css'))
});


/* ------------ Source Map-----------------*/
gulp.task('javascript', function() {
    gulp.src('./source/js/*.js')
        .pipe(sourcemaps.init())
        .pipe(plugin1())
        .pipe(plugin2())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest('build/js'));
});


/*-------------- Concat ------------------- */
gulp.task('concat', function() {
    return gulp.src('./source/js/*.js')
        .pipe(concat('all.js'))
        .pipe(gulp.dest('build/js'));
});

/*---------------- Default ----------------- */
gulp.task('default', gulp.series(
    'clean',
    gulp.parallel('tamplates:compile', 'styles:compile', 'sprite', 'copy'),
    gulp.parallel('watch', 'server')
));