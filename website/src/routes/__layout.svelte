<script>
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';

	import '../app.postcss';
</script>

<Header />
<slot />
<Footer />
