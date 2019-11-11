import React from 'react'
import './tailwind.build.css'

import AppHeader from './components/AppHeader'
import File from './components/File'

function App() {
  const files = Array.from({ length: 3 }, (_, k) => <File key={k} />)

  return (
    <main>
      <AppHeader />

      <section className="p-5">
        <header className="md:flex justify-between items-baseline mb-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl">6 documents</h1>
          <div className="text-lg">Total size: 600kb</div>
        </header>

        <section className="flex flex-wrap -mx-2">{files}</section>
      </section>
    </main>
  )
}

export default App
