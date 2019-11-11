import React from 'react'
import './tailwind.build.css'

function App() {
  return (
    <main>
      <header className="sm:flex sm:justify-between p-5">
        <div className="mb-4 sm:mb-0 sm:order-2">
          <button className="block w-full uppercase text-lg border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white py-1 sm:px-10">
            Upload
          </button>
        </div>

        <form className="sm:order-1">
          <input
            type="search"
            className="border text-lg w-full px-4 py-1"
            placeholder={'Search documents..'}
          />
        </form>
      </header>

      <section className="p-5">
        <header className="md:flex justify-between items-baseline mb-5">
          <h1 className="text-3xl md:text-4xl lg:text-5xl">6 documents</h1>
          <div className="text-lg">Total size: 600kb</div>
        </header>

        <section className="flex flex-wrap -mx-2">
          <article className="w-full sm:w-1/2 md:w-1/3 px-2 pb-4">
            <div className="border p-4 h-full">
              <h2 className="text-2xl mb-2">Doc1</h2>
              <div className="flex justify-between items-baseline">
                <div className="mr-4">100kb</div>
                <div>
                  <button className="text-sm border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white py-1 px-4">
                    delete
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="w-full sm:w-1/2 md:w-1/3 px-2 pb-4">
            <div className="border p-4 h-full">
              <h2 className="text-2xl mb-2">Doc1</h2>
              <div className="flex justify-between items-baseline">
                <div className="mr-4">100kb</div>
                <div>
                  <button className="text-sm border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white py-1 px-4">
                    delete
                  </button>
                </div>
              </div>
            </div>
          </article>

          <article className="w-full sm:w-1/2 md:w-1/3 px-2 pb-4">
            <div className="border p-4 h-full">
              <h2 className="text-2xl mb-2">Doc1</h2>
              <div className="flex justify-between items-baseline">
                <div className="mr-4">100kb</div>
                <div>
                  <button className="text-sm border border-blue-900 bg-blue-400 hover:bg-blue-900 hover:text-white focus:bg-blue-900 focus:text-white py-1 px-4">
                    delete
                  </button>
                </div>
              </div>
            </div>
          </article>
        </section>
      </section>
    </main>
  )
}

export default App
