export const mergeRefsBy = (
  field: string,
  existing = [],
  incoming: any[],
  { readField }
) => {
  const merged = existing ? existing.slice(0) : []
  const existingIdSet = new Set(merged.map((x) => readField(field, x)))

  incoming = incoming.filter((x) => !existingIdSet.has(readField(field, x)))

  merged.push(...incoming)

  return merged
}
