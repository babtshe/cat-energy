var gulp = require('gulp'),
  prefixer = require('gulp-autoprefixer'),
  cssmin = require('gulp-clean-css'),
  imagemin = require('gulp-imagemin'),
  sass = require('gulp-sass'),
  sourcemaps = require('gulp-sourcemaps'),
  browsersync = require('browser-sync'),
  jsmin = require('gulp-uglify'),
  pump = require('pump'),
  watch = require('gulp-watch'),
  del = require('del'),
  handlebars = require('gulp-compile-handlebars'),
  rename = require('gulp-rename'),
  wait = require('gulp-wait'),
  //webp = require('imagemin-webp'),
  webp = require('gulp-webp'),
  svgsprite = require('gulp-svg-sprite'),
  concat = require('gulp-concat'),
  reload = browsersync.reload;

var path = {
  build: {
    html: 'build/',
    fonts: 'build/fonts/',
    img: 'build/img/',
    js: 'build/js/',
    css: 'build/css/'
  },
  source: {
    markup: 'source/*.hbs',
    partials: 'source/partials',
    fonts: 'source/fonts/**/*.{woff2,woff,ttf}',
    img: {
      svg: 'source/img/**/*.svg',
      raster: 'source/img/**/*.{png,jpg}'
    },
    js: 'source/js/*.js',
    style: 'source/scss/style.scss'
  },
  watch: {
    markup: 'source/**/*.{html,hbs}',
    fonts: 'source/fonts/**/*.{woff2,woff,ttf}',
    img: 'source/img/**/*.{png,jpg,svg}',
    js: 'source/js/**/*.js',
    style: ['source/scss/*.scss','source/scss/blocks/*.scss'] //так стабильнее компилируется
  },
  clean: './build'
};

gulp.task('default', ['build', 'webserver', 'watch']);

gulp.task('html:build', function (callback) {
  pump([
    gulp.src(path.source.markup, {
      nodir: true
    }),
    handlebars({}, {
      ignorePartials: true,
      batch: path.source.partials
    }),
    rename({
      extname: '.html'
    }),
    gulp.dest(path.build.html),
    reload({
      stream: true
    })
  ], callback);
});

gulp.task('fonts:build', function () {
  gulp.src(path.source.fonts, {
      nodir: true
    })
    .pipe(gulp.dest(path.build.fonts));
});

gulp.task('image:build',['raster-image:build', 'webp-image:build', 'svg-image:build'], function () {
    reload({
      stream: true
    });
});

gulp.task('raster-image:build', function () {
  gulp.src(path.source.img.raster)//оптимизируем растровые картинки
  .pipe(imagemin({
    progressive: true,
    interlaced: true
  }))
  .pipe(gulp.dest(path.build.img))
});

gulp.task('webp-image:build', function () {
  gulp.src(path.source.img.raster)//генерируем webp
  //.pipe(imagemin([webp()]))
  .pipe(webp())
  // .pipe(rename({
  //   extname: '.webp'
  // }))
  .pipe(gulp.dest(path.build.img))
});

var svgsConfig = {
  //https://github.com/jkphl/svg-sprite/blob/master/docs/configuration.md
  //doc
  mode: {
    view: {
      dest: '',
      sprite: 'sprite.svg',
      prefix: "@mixin sprite-%s",
      bust: false,
      render: {
        scss: {
          template: 'source/partials/sprite.hbs',
          dest: '../../source/scss/_generated-sprite.scss'
        }
      }
    }
  }
}


gulp.task('svg-image:build', function (callback) {
  pump([
    gulp.src(path.source.img.svg), //собираем спрайты
    svgsprite(svgsConfig),
    gulp.dest(path.build.img)
  ], callback)
  gulp.src(path.source.img.svg)//копируем свг
  .pipe(imagemin())
  .pipe(gulp.dest(path.build.img))
});


gulp.task('js:build', function (callback) {
  pump([ //если будут ошибки pump наябедничает
    gulp.src(path.source.js),
    sourcemaps.init(),
    jsmin(),
    concat('script.js'),
    sourcemaps.write(),
    gulp.dest(path.build.js),
    reload({
      stream: true
    })
  ], callback);
});

gulp.task('style:build', function (callback) {
  pump([
    gulp.src(path.source.style),
    wait(50), //fix for file not found error
    sourcemaps.init(),
    sass(),
    prefixer(),
    cssmin(),
    sourcemaps.write(),
    gulp.dest(path.build.css),
    reload({
      stream: true
    })
  ], callback);
});

gulp.task('build', [
  'html:build',
  'fonts:build',
  'image:build',
  'js:build',
  'style:build'
]);

gulp.task('clean', function () {
  del(path.clean);
});

var bsConfig = {
  server: {
    baseDir: path.clean + '/'
  },
  tunnel: false,
  notify: false,
  host: 'localhost',
  port: 3000,
  logPrefix: 'browsersync'
};

gulp.task('webserver', function () {
  browsersync(bsConfig);
});

gulp.task('watch', function () {
  watch([path.watch.markup], function (event, callback) {
    gulp.start('html:build');
  });
  watch([path.watch.fonts], function (event, callback) {
    gulp.start('fonts:build');
  });
  watch([path.watch.img], function (event, callback) {
    gulp.start('image:build');
  });
  watch([path.watch.js], function (event, callback) {
    gulp.start('js:build');
  });
  watch(path.watch.style, function (event, callback) {
    gulp.start('style:build');
  });
});
