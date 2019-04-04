// import commonjs from 'rollup-plugin-commonjs';
// import nodeResolve from 'rollup-plugin-node-resolve';
// import license from 'rollup-plugin-license';
import babel from 'rollup-plugin-babel';
import {
    uglify
} from 'rollup-plugin-uglify';

var plugins = [
    // nodeResolve({
    //     jsnext: true,
    //     main: true
    // }),
    // commonjs(),
    babel({
        exclude: 'node_modules/**'
    }),
    uglify()
];

export default [{
    input: 'src/bootup-sandbox.js',
    output: {
        file: 'dist/bootup-sandbox.js',
        format: 'umd',
        name: 'BootupSandbox'
    },
    plugins: plugins
}];