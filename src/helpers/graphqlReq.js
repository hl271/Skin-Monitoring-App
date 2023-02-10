import {HASURA_GRAPHQL_ENDPOINT} from "@env"

export default async function graphqlReq (query, variables, userToken) {
    let graphqlReq = {query, variables}
    // console.log(HASURA_GRAPHQL_ENDPOINT)
    let hasuraRes = await fetch(`${HASURA_GRAPHQL_ENDPOINT}`, {
        method: 'POST',
        headers: {
        'content-type' : 'application/json', 
        'Authorization': "Bearer " + userToken
        },
        body: JSON.stringify(graphqlReq)
    })
    hasuraRes = await hasuraRes.json()
    // console.log(hasuraRes)
    if (hasuraRes["errors"]) {
        console.log(hasuraRes)
        throw Error("Error from GraphQL Server")
    }
    return hasuraRes
}