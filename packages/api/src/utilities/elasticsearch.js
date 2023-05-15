/**
 * Search and then scroll to retrieve all pages of search results.
 *
 * @param {elasticsearch.Client} esClient Elasticsearch client
 * @param {Object} searchParams Argument to elasticsearch.Client#search
 * @return {Object[]} Combined list of hits from all responses
 */
export async function fetchAllSearchResults(esClient, searchParams) {
  let allResults = []
  const responseQueue = []

  const size = searchParams.size || 1000
  const scroll = searchParams.scroll || '30s'
  
  // You can also retrieve hits.total as a number in the rest response by adding rest_total_hits_as_int=true
  // https://www.elastic.co/guide/en/elasticsearch/reference/current/breaking-changes-7.0.html#hits-total-now-object-search-response
  // Change between Elastic Search 7 and 6
  const rest_total_hits_as_int=true

  //console.log(searchParams)

  responseQueue.push(
    await esClient.search({
      ...searchParams,
      scroll,
      size,
      rest_total_hits_as_int
    })
  )


  while (responseQueue.length) {
    const response = responseQueue.shift()
    allResults = allResults.concat(response.hits.hits)

    //console.log(response)

    //if (allResults.length === response.hits.total) {
    if (allResults.length === response.hits.total.value) {
      // eslint-disable-next-line no-await-in-loop
      await esClient.clearScroll({
        scrollId: response._scroll_id,
      })
      break
    }

    responseQueue.push(
      // eslint-disable-next-line no-await-in-loop
      await esClient.scroll({
        scroll,
        scrollId: response._scroll_id,
      })
    )
  }
  

  return allResults
}
