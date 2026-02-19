import { readFile, writeFile, mkdir } from 'fs/promises'
import path from 'path'

export interface TranslatorPost {
  id: string
  url: string
  xUsername: string
  xUserId: string
  createdAt: string
}

const DATA_DIR = path.join(process.cwd(), 'data')
const POSTS_FILE = path.join(DATA_DIR, 'translator-posts.json')
const KV_KEY = 'translator_posts'

async function loadFromFile(): Promise<TranslatorPost[]> {
  try {
    const data = await readFile(POSTS_FILE, 'utf-8')
    return JSON.parse(data)
  } catch {
    return []
  }
}

async function saveToFile(posts: TranslatorPost[]): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true })
  await writeFile(POSTS_FILE, JSON.stringify(posts, null, 2), 'utf-8')
}

export async function loadPosts(): Promise<TranslatorPost[]> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv')
      const data = await kv.get<TranslatorPost[]>(KV_KEY)
      return Array.isArray(data) ? data : []
    } catch (error) {
      console.error('KV load error:', error)
      return []
    }
  }
  return loadFromFile()
}

export async function savePosts(posts: TranslatorPost[]): Promise<void> {
  if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
    try {
      const { kv } = await import('@vercel/kv')
      await kv.set(KV_KEY, posts)
    } catch (error) {
      console.error('KV save error:', error)
      throw new Error('Не удалось сохранить пост')
    }
  } else {
    await saveToFile(posts)
  }
}
