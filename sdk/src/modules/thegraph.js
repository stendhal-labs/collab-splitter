export async function getAllocationsByAccount(fetch, address) {
	const res = await req(
		fetch,
		`{
        account(id:"${address}") {
          id
          allocations {
            id
            splitter{
              id
              name
              allocationsCount
              allocations {
                recipient {
                  id
                }
                allocation
              }
              tokens {
                token {
                  id
                  name
                  symbol
                }
              }
          }
            allocation
          }
        }
      }`
	);
	const data = await res.json();

	return data.data.account ? data.data.account.allocations : [];
}
export async function getCollab(fetch, id) {
	const res = await req(
		fetch,
		`{
            collabSplitter(id:"${id}"){
                id
                name
                allocationsCount
                allocations{
                  id
                  recipient {
                    id
                  }
                  allocation
                }
                tokens {
                  token {
                    id
                    name
                    symbol
                  }
                }
              }
        }`
	);
	const data = await res.json();

	return data.data.collabSplitter;
}

async function req(fetch, query) {
	const res = await fetch(process.env.THEGRAPH_URL, {
		method: 'POST',
		body: JSON.stringify({ query })
	});
	return res;
}
