module.exports = async () => {
	return {
		verbose: true,
		preset: 'rollup-jest',
		transform: {
			'\\.m?js$': ['rollup-jest', { output: { sourcemap: true } }]
		}
	};
};
