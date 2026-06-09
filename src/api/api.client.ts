import axios from 'axios'
import { env } from '@/config/env'

type RequestOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  headers?: Record<string, string>
}

const api = axios.create({
  baseURL: env.EXTERNAL_API_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${env.EXTERNAL_API_KEY}`,
  },
})

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  try {
    const response = await api.request<T>({
      url: path,
      method: options.method ?? 'GET',
      data: options.body,
      headers: options.headers,
    })

    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(`External API error: ${error.response?.status ?? 'NO_RESPONSE'}`, {
        cause: error,
      })
    }

    throw error
  }
}
