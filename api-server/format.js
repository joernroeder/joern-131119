const formatError = (err) => {
  const { message } = err

  return {
    errors: [
      {
        title: message,
      },
    ],
  }
}

const pickObjectKeys = (obj, keysToPick = []) => {
  if (!keysToPick.length) {
    return obj
  }

  return keysToPick.reduce((accumulator, key) => {
    console.log('key:', key)
    if (!obj[key]) {
      return accumulator
    }

    return {
      ...accumulator,
      [key]: obj[key],
    }
  }, {})
}

const formatList = (items, opts) => {
  return {
    data: items.map((item) => {
      return formatFile(item, opts)
    }),
  }
}

const formatFile = (
  item,
  opts = { type: 'file', attributes: ['name', 'size'] }
) => {
  const { type, attributes: attributeKeysToPick = [] } = opts

  console.log(item)
  const { id, ...attributes } = item

  return {
    type,
    id,
    attributes: pickObjectKeys(attributes, attributeKeysToPick),
  }
}

module.exports = {
  formatError,
  formatList,
  formatFile,
}
