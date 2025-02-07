import gulp from 'gulp';
import terser from 'gulp-terser';
import csso from 'gulp-csso';
import htmlmin from 'gulp-htmlmin';

const terserSettings = {
    format: {
        quote_style: 3, // This is needed so that behavior for swapping values into config.js is unaffected by minification.
    },
};

// 'restructure' results in changes to look-and-feel and so is disabled.
const cssoSettings = {
    restructure: false,
};

// Whitespace is collapsed to reduce file size, but conservativeCollapse is enabled to avoid changes to look-and-feel.
const htmlminSettings = {
    collapseWhitespace: true,
    conservativeCollapse: true,
};

// Minify JS
gulp.task('minifyJs', () => {
    return gulp
        .src(['public/*.js', '!public/*.test.js'])
        .pipe(terser(terserSettings))
        .pipe(gulp.dest('public2'));
});
gulp.task('minifyJsInject', () => {
    return gulp
        .src(['inject/*.js', '!inject/*.test.js'])
        .pipe(terser(terserSettings))
        .pipe(gulp.dest('inject2'));
});

// Minify CSS
gulp.task('minifyCss', () => {
    return gulp
        .src('public/*.css')
        .pipe(csso(cssoSettings))
        .pipe(gulp.dest('public2'));
});
gulp.task('minifyCssInject', () => {
    return gulp
        .src('inject/*.css')
        .pipe(csso(cssoSettings))
        .pipe(gulp.dest('inject2'));
});

// Minify HTML
gulp.task('minifyHtml', () => {
    return gulp
        .src('public/*.html')
        .pipe(htmlmin(htmlminSettings))
        .pipe(gulp.dest('public2'));
});
gulp.task('minifyHtmlInject', () => {
    return gulp
        .src('inject/*.html')
        .pipe(htmlmin(htmlminSettings))
        .pipe(gulp.dest('inject2'));
});

// Copy other files (e.g. fonts)
gulp.task('copyOtherFiles', () => {
    return gulp
        .src(
            ['public/**/*', '!public/*.js', '!public/*.css', '!public/*.html'],
            { encoding: false }
        )
        .pipe(gulp.dest('public2'));
});

gulp.task(
    'default',
    gulp.parallel(
        'minifyJs',
        'minifyJsInject',
        'minifyCss',
        'minifyCssInject',
        'minifyHtml',
        'minifyHtmlInject',
        'copyOtherFiles'
    )
);
