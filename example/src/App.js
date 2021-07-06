import React from 'react'

import { useMyHook } from 'megahelpers'

const App = () => {
  const example = useMyHook()
  return (
    <div>
      {example}
    </div>
  )
}
export default App
