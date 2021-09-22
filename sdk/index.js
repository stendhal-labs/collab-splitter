const ethers = require('ethers');

function getNode(account, percent) {
	return ethers.utils.keccak256(
			ethers.utils.defaultAbiCoder.encode(
					['address', 'uint256'],
					[account, percent],
			),
	);
}

function merkleRoot(txs) {
	if (txs.length === 1) {
			return txs[0];
	}

	return merkleRoot(toPairs(txs).map((pair) => hashPair(...pair)));
};

function merkleProof(txs, tx, proof = []) {
	if (txs.length === 1) {
			return proof;
	}

	const tree = [];

	toPairs(txs).forEach((pair) => {
			const hash = hashPair(...pair);

			if (pair.includes(tx)) {
					const idx = (pair[0] === tx) | 0;
					proof.push(pair[idx]);
					tx = hash;
			}

			tree.push(hash);
	});

	return merkleProof(tree, tx, proof);
};

function merkleProofRoot(proof, tx) {
	return proof.reduce(
			(root, [idx, tx]) => (idx ? hashPair(root, tx) : hashPair(tx, root)),
			tx,
	);
}

function getRoot(collab) {
	return merkleRoot(collab.map((a) => getNode(a.account, a.percent)));
}

function getProof(collab, index) {
	return merkleProof(
			collab.map((a) => getNode(a.account, a.percent)),
			getNode(collab[index].account, collab[index].percent),
	);
}

function toPairs(arr) {
	return Array.from(Array(Math.ceil(arr.length / 2)), (_, i) =>
			arr.slice(i * 2, i * 2 + 2),
	);
}

function hashPair(a, b = a) {
	// for some reason, MerkleRoot.verify() always put the lowest value left
	if (ethers.BigNumber.from(a).gt(ethers.BigNumber.from(b))) {
			temp = a;
			a = b;
			b = temp;
	}

	return ethers.utils.keccak256(
			ethers.utils.solidityPack(['bytes32', 'bytes32'], [a, b]),
	);
};

module.exports = {
	getNode,
	getProof,
	getRoot,
	merkleProof,
	merkleProofRoot
}