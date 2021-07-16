import { useEffect, useRef } from 'react'

// https://github.com/apollographql/apollo-client/issues/6039#issuecomment-657703849

export const usePreviousNonNullish = <T>(value: T): T => {
  const ref = useRef<T>(value)
  useEffect(() => {
    if (value !== null && value !== undefined) {
      ref.current = value
    }
  })
  return ref.current
}

export const usePreviousNotEmpty = <T>(value: T[]): T[] => {
  const ref = useRef<T[]>(value)
  useEffect(() => {
    if (value !== undefined && value.length) {
      ref.current = value
    }
  })
  return ref.current
}
