import React from 'react'

const AppHeader = () => {
  return (
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
          placeholder="Search documents…"
        />
      </form>
    </header>
  )
}

export default AppHeader
