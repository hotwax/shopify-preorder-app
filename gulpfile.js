const { dest, src } = require('gulp');
const minify = require("gulp-minify");

function defaultTask() {
    return src([
        'public/*.js',
        '!public/*.min.js'
      ])
      .pipe(minify({
        ext: {
          src: '.js',
          min: '.min.js'
        }
      }))
      .pipe(dest('public'));
}
exports.default = defaultTask;