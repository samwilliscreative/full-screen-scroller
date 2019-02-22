const gulp = require("gulp");
const babel = require("gulp-babel");
const rename = require("gulp-rename");
const replace = require('gulp-token-replace');
const fileinclude = require('gulp-file-include');
const sass = require("gulp-sass");
const uglify = require("gulp-uglify");
const connect = require("gulp-connect");
const swap = require('gulp-replace');
const merge = require('merge-stream');
const sourcemaps = require('gulp-sourcemaps');
const autoprefixer = require('gulp-autoprefixer');
const config = require('./config.js');

// Define directory structure
const root = __dirname;
const files = {
  styles: [`./src/scss/**/*.scss`],
  scripts: [`./src/js/**/*.js`],
  html: [`./src/**/*.html`]
};

function connectServer(done) {
  connect.server({
      root: './',
      port: 8008,
      livereload: true
  });
  done()
};

function compSass() {
  const options = {
    sass: {
      outputStyle: "compressed"
    }
  };
  return gulp
    .src(files.styles)
    .pipe(sourcemaps.init())
    .pipe(sass(options.sass))
    .pipe(rename("style.css"))
    .pipe(autoprefixer({
        cascade: false
    }))
    .pipe(sourcemaps.write(`${root}/dist/css`))
    .pipe(gulp.dest(`${root}/dist/css`))
    .pipe(connect.reload());
};

function compJs() {
  const options = {
    babel: {
      presets: ["@babel/preset-env"]
    }
  };
  return gulp
    .src(files.scripts)
    .pipe(babel(options.babel))
    .pipe(sourcemaps.write("./maps"))
    .pipe(rename("app.min.js"))
    .pipe(gulp.dest(`${root}/dist/js`))
    .pipe(connect.reload());
};

function htmlLocal() {  
  var index = gulp.src(['./src/html/index.html'])
              .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
              }))
              .on("error", errorHandler)
              .pipe(swap('{{img}}', '{{img.local}}'))
              .pipe(swap('{{dist}}', '{{dist.local}}'))
              .pipe(replace({global:config}))
              .pipe(gulp.dest('./'))
              .pipe(connect.reload());

  var pages = gulp.src(['./src/html/pages/*.html'])
              .pipe(fileinclude({
                prefix: '@@',
                basepath: '@file'
              }))
              .on("error", errorHandler)
              .pipe(swap('{{img}}', '{{img.local}}'))
              .pipe(swap('{{dist}}', '{{dist.local}}'))
              .pipe(replace({global:config}))
              .pipe(gulp.dest('./pages/'))
              .pipe(connect.reload());

  return merge(index, pages);
};

function htmlRemote() {  
    var index = gulp.src(['./src/html/index.html'])
                .pipe(fileinclude({
                  prefix: '@@',
                  basepath: '@file'
                }))
                .on("error", errorHandler)
                .pipe(swap('{{img}}', '{{img.remote}}'))
                .pipe(swap('{{dist}}', '{{dist.remote}}'))
                .pipe(replace({global:config}))
                .pipe(gulp.dest('./'))
                .pipe(connect.reload());
  
    var pages = gulp.src(['./src/html/pages/*.html'])
                .pipe(fileinclude({
                  prefix: '@@',
                  basepath: '@file'
                }))
                .on("error", errorHandler)
                .pipe(swap('{{img}}', '{{img.remote}}'))
                .pipe(swap('{{dist}}', '{{dist.remote}}'))
                .pipe(replace({global:config}))
                .pipe(gulp.dest('./pages/'))
                .pipe(connect.reload());
  
    return merge(index, pages);
  };

function watchFiles(done) {
  gulp.watch(files.styles, compSass);
  gulp.watch(files.scripts, compJs);
  gulp.watch('./src/**/*.html', htmlLocal);
  done()
};

const local = gulp.parallel(htmlLocal, compSass, compJs, connectServer, watchFiles);
const remote = gulp.parallel(htmlRemote, compSass, compJs);

// Simple error handler.
function errorHandler (error) {
  console.log(error.toString());
  this.emit('end');
}
exports.local = local;
exports.remote = remote;
