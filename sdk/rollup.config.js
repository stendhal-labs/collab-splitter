import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2'
import sourceMaps from 'rollup-plugin-sourcemaps';
import pkg from './package.json';

export default [
	// browser-friendly UMD build
	{
		input: 'src/main.ts',
		output: {
			name: 'collabSplitter',
			file: pkg.browser,
			format: 'umd',
			preserveModules: true,
			preserveModulesRoot: 'src'
		},
		plugins: [
			resolve(), // so Rollup can find `ms`
			commonjs(), // so Rollup can convert `ms` to an ES module
			typescript({ useTsconfigDeclarationDir: true }),
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
		input: 'src/main.ts',
		external: ['ms', 'ethers'],
		output: [
			{
				file: pkg.main,
				format: 'cjs',
				sourcemap: true,
				preserveModules: true,
				preserveModulesRoot: 'src'
			},
			{
				file: pkg.module,
				format: 'es',
				sourcemap: true,
				preserveModules: true,
				preserveModulesRoot: 'src'
			}
		],
		plugins: [typescript({ useTsconfigDeclarationDir: true }), sourceMaps()]
	}
];
