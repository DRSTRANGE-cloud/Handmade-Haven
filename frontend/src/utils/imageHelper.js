const RENDER_URL = 'https://handmade-haven-6ygd.onrender.com'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  const fixedPath = imagePath.replace(/\\/g, '/')
  return `${RENDER_URL}${fixedPath}`
}