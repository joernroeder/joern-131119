module.exports = {
  theme: {
    extend: {},
  },
  variants: {
    backgroundColor: ['hover', 'focus', 'disabled'],
    textColor: ['hover', 'focus', 'disabled'],
  },
  corePlugins: {
    container: false,
  },
  plugins: [
    function({ addComponents }) {
      addComponents({
        '.container': {
          maxWidth: '100%',
          '@screen sm': {
            maxWidth: '600px',
          },
          '@screen md': {
            maxWidth: '700px',
          },
          '@screen lg': {
            maxWidth: '800px',
          },
          '@screen xl': {
            maxWidth: '960px',
          },
        },
      })
    },
  ],
}
