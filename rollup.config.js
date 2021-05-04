import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import minify from 'rollup-plugin-babel-minify';

export default [{
    input: 'dist/index.js',
    output: {
        name: "atlClient",
        file: "dist/atlClient.js",
        format: 'iife',
        sourcemap: 'inline',
    },
    plugins: [
        resolve(),
        commonjs(),
        minify({ comments: false }),
    ],
}];
