import { useEffect, useState } from 'react'

export const useMop = (
  useOperation: Function,
  generator: Function,
  update = undefined
) => {
  const [prepared, setPrepared] = useState({
    variables: {},
    apollo: null,
    wantToSave: false,
  })

  const [mutate, result] = useOperation({ prepared, update })

  const attemptSave = async () => {
    const generated = await generator()
    setPrepared({ ...generated, wantToSave: true })
  }

  useEffect(() => {
    if (prepared.wantToSave) mutate()
  }, [prepared])

  return [attemptSave, result]
}
