import { variables } from '../variables';

export async function getCollabsByAccount(fetch, address: string) {
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
            }
            allocation
          }
        }
      }`
	);
	const data = await res.json();

	return data.data.account?.allocations || [];
}
export async function getCollab(fetch, id: string) {
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
              }
        }`
	);
	const data = await res.json();

	return data.data.collabSplitter || null;
}

export default async function req(fetch, query) {
	const res = await fetch(variables.THEGRAPH_URL, {
		method: 'POST',
		body: JSON.stringify({ query })
	});
	return res;
}
