const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    merge = require('merge2'),
    webpack = require('webpack-stream');

gulp.task('typescript', () => {
    const project = tsc.createProject('tsconfig.json');

    let out = gulp.src('./src/*.ts')
        .pipe(project())

    return merge([
        out.js.pipe(gulp.dest('lib')),
        out.dts.pipe(gulp.dest('lib'))
    ]);
});

gulp.task('webpack', () => {

    return gulp.src('src/index.ts')
        .pipe(webpack({
            resolve: {
                extensions: ['', '.js', '.ts'],
            },
            module: {
                loaders: [{
                    test: /\.ts(x?)$/,
                    loader: 'babel-loader!ts-loader'
                }]
            },
            output: {
                library: "di",
                libraryTarget: "umd",
                filename: 'slick.di.js'
            },
        /*externals: {
            "debug": "debug"
        }*/
        })).pipe(gulp.dest('dist'))

})