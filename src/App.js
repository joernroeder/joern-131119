import React from 'react'
import './tailwind.build.css'

import useReadableFileSize from './hooks/format/useReadableFileSize'

import AppHeader from './components/AppHeader'
import File from './components/File'

function App() {
  const data = [
    {
      id: 'string',
      name: 'filename',
      size: 18435,
    },
    {
      id: 'string',
      name: 'other',
      size: 658754,
    },
    {
      id: 'string',
      name: 'third',
      size: 8076546,
    },
  ]

  const filesCount = data.length
  const totalFileSize = data.reduce((total, file) => {
    const { size } = file

    if (!size || isNaN(size)) {
      return total
    }

    return total + size
  }, 0)
  const readableTotalFileSize = useReadableFileSize(totalFileSize)
  const files = data.map((file, k) => {
    const { id, name, size } = file

    return <File key={k} id={id} name={name} size={size} />
  })

  return (
    <main>
      <AppHeader />

      <section className="px-5 pb-5">
        <header className="md:flex justify-between items-baseline mb-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl">
            {filesCount} {filesCount === 1 ? 'document' : 'documents'}
          </h1>
          <div className="text-lg">Total size: {readableTotalFileSize}</div>
        </header>

        <section className="flex flex-wrap -mx-2">{files}</section>
      </section>
    </main>
  )
}

export default App
