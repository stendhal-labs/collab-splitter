export function copyToClipBoard(text: string) {
	if (navigator.clipboard) {
		navigator.clipboard.writeText(text);
	} else {
		console.log('Write to clipBoard not supported');
	}
}