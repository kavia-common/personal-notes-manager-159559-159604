import { defineStore } from 'pinia'
import type { User } from '@/services/auth'
import * as AuthService from '@/services/auth'

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: localStorage.getItem('auth_token'),
    user: (() => {
      const raw = localStorage.getItem('auth_user')
      return raw ? (JSON.parse(raw) as User) : null
    })(),
    loading: false,
    error: null,
  }),
  getters: {
    isAuthenticated: (state) => !!state.token,
  },
  actions: {
    // PUBLIC_INTERFACE
    async login(email: string, password: string) {
      /** Log user in and persist token. */
      this.loading = true
      this.error = null
      try {
        const res = await AuthService.login(email, password)
        this.token = res.token
        this.user = res.user
        localStorage.setItem('auth_token', res.token)
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        this.error = message || 'Login failed'
        throw e
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async register(email: string, password: string, name?: string) {
      /** Register user and persist token. */
      this.loading = true
      this.error = null
      try {
        const res = await AuthService.register(email, password, name)
        this.token = res.token
        this.user = res.user
        localStorage.setItem('auth_token', res.token)
        localStorage.setItem('auth_user', JSON.stringify(res.user))
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        this.error = message || 'Registration failed'
        throw e
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async fetchMe() {
      /** Fetch current user profile and store it. */
      try {
        const user = await AuthService.me()
        this.user = user
        localStorage.setItem('auth_user', JSON.stringify(user))
      } catch {
        // ignore, handled by api.ts on 401
      }
    },
    // PUBLIC_INTERFACE
    logout() {
      /** Clear auth information and storage. */
      this.token = null
      this.user = null
      localStorage.removeItem('auth_token')
      localStorage.removeItem('auth_user')
    },
  },
})
