// Pulls every image out of the local `src/assets/images` folder at build time.
// Drop more photos in there and they'll be swept into the storm automatically.
const modules = import.meta.glob('../assets/images/*.jpg', {
  eager: true,
  query: '?url',
  import: 'default',
})

const byNumber = (s) => {
  const m = s.match(/(\d+)/)
  return m ? parseInt(m[1], 10) : 0
}

const urls = Object.entries(modules)
  .sort((a, b) => byNumber(a[0]) - byNumber(b[0]))
  .map(([, url]) => url)

export const stormImages = urls.slice(0, 12).map((url, i) => ({
  id: `img-${String(i + 1).padStart(2, '0')}`,
  url,
}))
