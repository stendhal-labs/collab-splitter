import * as ethers from 'ethers';

/**
 * Get the Merkle node of an tuple account, percent
 * @param account
 * @param percent
 * @returns
 */
export function getNode(account, percent) {
	return ethers.utils.keccak256(
		ethers.utils.defaultAbiCoder.encode(['address', 'uint256'], [account, percent])
	);
}

/**
 * Get Merkle root of a collaboration (list of recipients with percent)
 * @param collab
 * @returns
 */
export function getRoot(collab) {
	return merkleRoot(collab.map((a) => getNode(a.account, a.percent)));
}

/**
 * Get the Merkle proof of a recipient (account, percent)
 * @param collab
 * @param index
 * @returns
 */
export function getProof(collab, index: number) {
	return merkleProof(
		collab.map((a) => getNode(a.account, a.percent)),
		getNode(collab[index].account, collab[index].percent)
	);
}

function merkleRoot(txs: string[]) {
	if (txs.length === 1) {
		return txs[0];
	}

	return merkleRoot(toPairs(txs).map((pair) => hashPair(pair[0], pair[1])));
}

function merkleProof(txs: string[], tx: string, proof = []) {
	if (txs.length === 1) {
		return proof;
	}

	const tree = [];

	toPairs(txs).forEach((pair: string[]) => {
		const hash = hashPair(pair[0], pair[1]);

		if (pair.includes(tx)) {
			const idx = pair[0] === tx ? 1 : 0 | 0;
			proof.push(pair[idx]);
			tx = hash;
		}

		tree.push(hash);
	});

	return merkleProof(tree, tx, proof);
}

function merkleProofRoot(proof, tx: string) {
	return proof.reduce((root, [idx, tx]) => (idx ? hashPair(root, tx) : hashPair(tx, root)), tx);
}

function toPairs(arr: string[]) {
	return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) => arr.slice(i * 2, i * 2 + 2));
}

function hashPair(a: string, b: string = a) {
	let temp;
	// for some reason, MerkleRoot.verify() always put the lowest value left
	if (ethers.BigNumber.from(a).gt(ethers.BigNumber.from(b))) {
		temp = a;
		a = b;
		b = temp;
	}

	return ethers.utils.keccak256(ethers.utils.solidityPack(['bytes32', 'bytes32'], [a, b]));
}
