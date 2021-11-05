import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import sourceMaps from 'rollup-plugin-sourcemaps';
import replace from '@rollup/plugin-replace';
import pkg from './package.json';
import { config } from 'dotenv';

const production = !process.env.ROLLUP_WATCH;

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.js',
		output: {
			name: 'collabSplitter',
			file: pkg.browser,
			format: 'umd',
			sourcemap: true
		},
		plugins: [
			replace({
				'process.env.FACTORY_ADDRESS': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
				'process.env.THEGRAPH_URL': JSON.stringify(
					'https://api.thegraph.com/subgraphs/name/stendhal-labs/collab-splitter-rinkeby'
				)
			}),
			resolve(),
			commonjs(),
			sourceMaps()
		]
	},

	// CommonJS (for Node) and ES module (for bundlers) build.
	// (We could have three entries in the configuration array
	// instead of two, but it's quicker to generate multiple
	// builds from a single configuration where possible, using
	// an array for the `output` option, where we can specify
	// `file` and `format` for each target)
	{
		input: 'src/main.js',
		external: ['ethers'],
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: true
			},
			{
				file: pkg.module,
				format: 'es',
				sourcemap: true
			}
		],
		plugins: [
			replace({
				preventAssignment: true,
				'process.env.FACTORY_ADDRESS': '0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B',
				'process.env.THEGRAPH_URL': JSON.stringify(
					'https://api.thegraph.com/subgraphs/name/stendhal-labs/collab-splitter-rinkeby'
				)
				// process: JSON.stringify({
				// 	env: {
				// 		isProd: production,
				// 		...config().parsed
				// 	}
				// })
			}),
			sourceMaps()
		]
	}
];
