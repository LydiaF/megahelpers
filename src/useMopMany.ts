import { useEffect, useState } from 'react'

export const useMopMany = (useOperation, generator, update = undefined) => {
  const [prepared, setPrepared] = useState({
    variables: {},
    apollos: [],
    wantToSave: false,
  })
  const [mutate, result] = useOperation({ prepared, update })

  const attemptSave = async () => {
    const proms = await generator()

    let objects = []
    let apollos = []
    let on_conflict

    for await (const g of proms) {
      objects.push(g.variables.object)
      on_conflict = g.variables.on_conflict // does not need to be done each time!
      apollos.push(g.apollo)
    }

    setPrepared({
      variables: { objects, on_conflict },
      apollos,
      wantToSave: true,
    })
  }

  useEffect(() => {
    if (prepared.wantToSave) mutate()
  }, [prepared.wantToSave])

  return [attemptSave, result]
}
