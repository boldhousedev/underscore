import babel from 'rollup-plugin-babel';
import { eslint } from 'rollup-plugin-eslint';
import json from 'rollup-plugin-json';
import { terser } from 'rollup-plugin-terser';
import { version } from './package.json';

const globals = {
    'underscore': '_',
};

const now = new Date();
const year = now.getFullYear();

const banner = `/**
* @license
* Underscore
* ----------------------------------
* v${version}
*
* Distributed under MIT license
*
*/\n\n`;

const footer = '';

export default [
    {
        input: 'src/underscore.js',
        external: ['underscore'],
        output: [
            {
                file: 'lib/underscore.js',
                format: 'umd',
                name: '_x',
                exports: 'named',
                sourcemap: true,
                globals,
                banner,
                footer
            },
            {
                file: 'lib/underscore.esm.js',
                format: 'es'
            }
        ],
        plugins: [
            eslint({ exclude: ['package.json'] }),
            json(),
            babel()
        ]
    },
    {
        input: 'src/underscore.js',
        external: ['underscore'],
        output: [
            {
                file: 'lib/underscore.min.js',
                format: 'umd',
                name: '_x',
                exports: 'named',
                sourcemap: true,
                globals,
                banner,
                footer
            }
        ],
        plugins: [
            json(),
            babel(),
            terser({ output: { comments: /@license/ } })
        ]
    }
]