import { map } from 'lodash'
import { useState } from 'react'

export const useSelectIds = (incoming, keyField = 'id') => {
  const [state, setState] = useState(map(incoming, keyField))
  const itemOnClick = (object) =>
    state.includes(object[keyField])
      ? setState((s) => s.filter((i) => i !== object[keyField]))
      : setState((s) => [...s, object[keyField]])

  return {
    deselected: [],
    selectedToGo: state,
    itemOnClick,
    objectDiff: [true], // COMBAK
  }
}
