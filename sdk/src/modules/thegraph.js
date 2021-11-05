export async function getAllocationsByAccount(fetch, theGraphUrl, address) {
	const res = await req(
		fetch,
		theGraphUrl,
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
export async function getCollab(fetch, theGraphUrl, id) {
	const res = await req(
		fetch,
		theGraphUrl,
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

/**
 * Make the GraphQL query
 * @param {*} fetch
 * @param {*} theGraphUrl
 * @param {*} query
 * @returns
 */
async function req(fetch, theGraphUrl, query) {
	const res = await fetch(theGraphUrl, {
		method: 'POST',
		body: JSON.stringify({ query })
	});
	return res;
}
