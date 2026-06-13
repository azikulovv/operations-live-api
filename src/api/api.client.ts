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

export class ExternalApiError extends Error {
  constructor(
    public readonly statusCode: number | null,
    public readonly path: string,
  ) {
    super(`External API error: ${statusCode ?? 'NO_RESPONSE'}`)
  }
}

export function isExternalApiError(error: unknown): error is ExternalApiError {
  return error instanceof ExternalApiError
}

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
      throw new ExternalApiError(error.response?.status ?? null, path)
    }

    throw error
  }
}
