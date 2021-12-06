export async function copyToClipBoard(text: string) {
	if (navigator.clipboard) {
		await navigator.clipboard.writeText(text);
	} else {
		console.log('Write to clipBoard not supported');
	}
}