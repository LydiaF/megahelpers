import { fromPairs, orderBy } from 'lodash'
import { useEffect } from 'react'
import { getObjectDiff } from './getObjectDiff'
import { useImmerReducer } from 'use-immer'

type draft = {
  [rascalColumn: string]: {
    id: string
  }
}

type action = {
  type:
    | 'add'
    // *** Mark1
    | 'remove'
  rascal?: {
    id: string
  }
  child?: {
    rascal_id: string
    ['rascalColumn']: string
  }
}

const reducer = (
  draft: draft,
  action: action,
  rascalColumn: string,
  parentColumn?: string,
  parent_id?: string | undefined
) => {
  switch (action.type) {
    case 'add':
      let x = {
        // ...tgroup_tsession_default,
        [rascalColumn]: action.rascal.id,
        rascal: {
          // ...tgroup_default, shouldn't need this in most cases...
          ...action.rascal,
        },
      }

      if (parent_id && parentColumn) x[parentColumn] = parent_id

      // @ts-expect-error
      draft[action.rascal.id] = x

      return void draft
    case 'remove':
      delete draft[action[rascalColumn]]
      return void draft
    // ***Mark3
  }
}

export const useSelectManyChildsForParent = ({
  parent,
  parentColumn,
  rascalColumn,
  childField = 'child_field',
  includePreselected = true,
  autoAdd,
  onChange,
}: {
  parent?: {
    id: string
  }
  parentColumn?: string
  rascalColumn: string
  childField?: string
  includePreselected: boolean
  autoAdd?: { id: string }[] // COMBAK
  onChange?: (s) => void
}) => {
  const old: draft = fromPairs(
    parent?.[childField].map((c) => [c[rascalColumn], c])
  )

  const [state, dispatch] = useImmerReducer<draft, action>(
    (draft, action) =>
      reducer(draft, action, rascalColumn, parentColumn, parent?.id),
    includePreselected ? old : {}
  )

  const objectDiff = getObjectDiff(old, state)

  const selectedIds = Object.keys(state)
  const selected = orderBy(Object.values(state), 'title')

  let selectedToGo = selected.map((s) => ({
    // *** MarkSelectedToGoObject
    [rascalColumn]: s[rascalColumn],
  }))

  if (parent && parentColumn)
    selectedToGo = selectedToGo.map((s) => ({
      ...s,
      [parentColumn]: parent.id,
    }))

  const itemOnClick = (rascal: { id: string }) =>
    selectedIds.includes(rascal.id)
      ? dispatch({ type: 'remove', [rascalColumn]: rascal.id })
      : dispatch({ type: 'add', rascal })

  useEffect(() => onChange && onChange(selectedIds), [state])

  useEffect(
    () =>
      autoAdd?.forEach((rascal) => {
        if (!selectedIds.includes(rascal.id)) dispatch({ type: 'add', rascal })
      }),
    []
  )

  return {
    itemOnClick,
    state,
    dispatch,
    objectDiff,
    selected,
    selectedIds,
    selectedToGo,
  }
}
