const gulp = require('gulp'),
    tsc = require('gulp-typescript'),
    merge = require('merge2'),
    webpack = require('webpack-stream'),
    babel = require('gulp-babel'),
    bump = require('gulp-bump'),
    typeDoc = require('gulp-typedoc');

gulp.task('typescript', () => {
    const project = tsc.createProject('tsconfig.json', {
        declaration: true
    });

    let out = gulp.src('./src/*.ts')
        .pipe(project())

    return merge([
        out.js.pipe(babel({
            presets: ['es2015', 'stage-0']
        })).pipe(gulp.dest('lib')),
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
                    loader: 'babel-loader?presets[]=es2015&presets[]=stage-0!ts-loader'
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

});


gulp.task('documentation', () => {

    return gulp.src('src/**/*.ts')
        .pipe(typeDoc({
            module: 'commonjs',
            target: 'ed2017',

            includeDeclarations: true,
            name: "SlickDI",
            entryPoint: 'Container',
            out: './docs',
            readme: './README.md',
            ignoreCompilerErrors: true

        }));

});


gulp.task('default', ['webpack', 'typescript']);

gulp.task('bump', () => {
    return gulp.src('package.json')
        .pipe(bump()).pipe(gulp.dest('.'));
});

gulp.task('bump:minor', () => {
    return gulp.src('package.json')
        .pipe(bump({
            type: 'minor'
        }))
        .pipe(gulp.dest('.'));
})