import { map, difference } from 'lodash'
import { useState } from 'react'

export const useSelectIds = (incoming, keyField = 'id') => {
  const original = map(incoming, keyField)
  const [state, setState] = useState(original)
  const itemOnClick = (object) =>
    state.includes(object[keyField])
      ? setState((s) => s.filter((i) => i !== object[keyField]))
      : setState((s) => [...s, object[keyField]])

  return {
    deselected: difference(original, state),
    selectedToGo: state,
    itemOnClick,
    objectDiff: [true], // COMBAK
  }
}
