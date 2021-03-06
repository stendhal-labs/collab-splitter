import preprocess from 'svelte-preprocess';
import adapter_ipfs from 'sveltejs-adapter-ipfs';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Consult https://github.com/sveltejs/svelte-preprocess
	// for more information about preprocessors
	preprocess: [
		preprocess({
			postcss: true
		})
	],

	kit: {
		adapter: adapter_ipfs({
			removeBuiltInServiceWorkerRegistration: true,
			injectPagesInServiceWorker: true,
			injectDebugConsole: true
		}),
		target: '#svelte',
		trailingSlash: 'ignore'
	}
};

export default config;
