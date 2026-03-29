const BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://handmade-haven-6ygd.onrender.com'
  : 'http://localhost:5000'

export const getImageUrl = (imagePath) => {
  if (!imagePath) return ''
  const fixedPath = imagePath.replace(/\\/g, '/')
  return `${BASE_URL}${fixedPath}`
}