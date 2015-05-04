// 先定義好安裝plugin的每個參數
var gulp = require('gulp'),
    gutil = require('gulp-util'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify'),
    compass = require('gulp-compass'),
    connect = require('gulp-connect'),
    gulpif = require('gulp-if'),
    uglify = require('gulp-uglify'),
    minifyHTML = require('gulp-minify-html'),
    jsonminify = require('gulp-jsonminify'),
    concat = require('gulp-concat');

// 定義所需組譯程式的參數
var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    outputDir,
    sassStyle;

// 設定NODE_ENV，將development資料夾內的js拷貝至production資料夾內
env = process.env.NODE_ENV || 'development';
if (env==='development') {
	// 這是用參數直接設定路徑
    outputDir = 'builds/development/';
    // 把sass檔案擴大化
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    // 壓縮sass解譯後的css
    sassStyle = 'compressed';
}




// 指定coffeescript的組譯路徑，* =>全部的檔案
coffeeSources = ['components/coffee/*.coffee'];
// 指定所有的js檔案
jsSources = [
    'components/scripts/rclick.js',
    'components/scripts/pixgrid.js',
    'components/scripts/tagline.js',
    'components/scripts/template.js'
];
// 指定sass檔案路徑
sassSources = ['components/sass/style.scss'];
// 指定html檔案路徑，outputDir是在上面NODE_ENV設定的路徑參數
htmlSources = [outputDir + '*.html'];
// 指定json檔案路徑，outputDir是在上面NODE_ENV設定的路徑參數
jsonSources = [outputDir + 'js/*.json'];
// 解譯coffeescript並指向解譯後的位置
gulp.task('coffee', function() {
    gulp.src(coffeeSources)
        .pipe(
            coffee({
                bare: true
            })
            .on('error', gutil.log)
        )
        .pipe(
            gulp.dest('components/scripts/')
        )
});
// 解譯coffeescript並指向解譯後的位置，outputDir是NODE_ENV設定的builds/development/位置
gulp.task('js', function() {
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        //使用gulpif讓script.js可以瞬間輕量化，從271KB瞬間變成93KB，真是太神奇了。
        .pipe(gulpif(env === 'production' , uglify()))
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});
// 解譯sass並指向解譯後的位置，outputDir是NODE_ENV設定的builds/development/
gulp.task('compass', function() {
    gulp.src(sassSources)
        .pipe(compass({
                sass: 'components/sass',
                image: outputDir + 'images',
                style: sassStyle
            })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});
// 設定監聽的檔案類型，讓他能夠間聽到我們指定的檔案，* 代表監聽全部。
gulp.task('watch', function() {
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch('components/sass/*.scss', ['compass']);
    gulp.watch('builds/development/*.html', ['html']);
    gulp.watch('builds/development/js/*.json', ['json']);
});
// 使用gulp-connect，並加入livereload功能讓瀏覽器能夠監聽檔案自動重整網頁，outputDir是NODE_ENV設定的builds/development/
gulp.task('connect', function() {
    connect.server({
        root: outputDir,
        livereload: true
    });
});
// 因為html以及json不需要解譯，他只要儲存就好，所以單獨設定他儲存後就可以重整
gulp.task('html', function() {
    gulp.src('builds/development/*.html')
    // 使用gulpif以及gulp-minify-html，讓html檔案輕量化，從7kb變成6kb(差異不大..)
    	.pipe(gulpif(env === 'production' , minifyHTML()))
    	.pipe(gulpif(env === 'production' , gulp.dest(outputDir)))
        .pipe(connect.reload())
});
// 因為html以及json不需要解譯，他只要儲存就好，所以單獨設定他儲存後就可以重整
gulp.task('json', function() {
    gulp.src('builds/development/js/*.json')
    // 使用gulpif以及gulp-jsonminify，讓json檔案輕量化(差異不大..)
    	.pipe(gulpif(env === 'production' , jsonminify()))
    	.pipe(gulpif(env === 'production' , gulp.dest('builds/production/js')))
        .pipe(connect.reload())
});
// 指定command line裡面所需下的指令，default為只要輸入"gulp"就開始運作
gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
