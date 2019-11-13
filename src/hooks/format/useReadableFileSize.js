import { useMemo } from 'react'

/**
 * converts the given size in bytes into a readable format
 *
 * @see https://stackoverflow.com/a/20732091
 *
 * @param {number} sizeInBytes
 * @returns {string}
 */
const useReadableFileSize = (sizeInBytes) => {
  return useMemo(() => {
    if (!sizeInBytes) {
      return '0b'
    }

    const i = Math.floor(Math.log(sizeInBytes) / Math.log(1000))

    return (
      (sizeInBytes / Math.pow(1000, i)).toFixed(2) * 1 +
      //' ' +
      ['b', 'kb', 'mb', 'gb', 'tb'][i]
    )
  }, [sizeInBytes])
}

export default useReadableFileSize
