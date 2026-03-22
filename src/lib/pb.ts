import PocketBase from 'pocketbase'

const pb = new PocketBase(import.meta.env.VITE_API_URL || 'https://wonka.linyuu.dev')

export default pb
