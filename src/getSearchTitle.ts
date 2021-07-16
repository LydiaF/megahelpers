export const getSearchTitle = ({
  loading,
  query,
  result,
}: {
  loading: boolean
  query: string
  result: any[] | undefined
}) =>
  result
    ? `Search Results (${result.length})`
    : loading || query.length
    ? 'Search'
    : undefined
