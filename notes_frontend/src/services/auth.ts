import { apiRequest } from './api'

export interface User {
  id: string
  email: string
  name?: string
}

export interface AuthResponse {
  token: string
  user: User
}

// PUBLIC_INTERFACE
export async function login(email: string, password: string): Promise<AuthResponse> {
  /** Authenticate a user with email and password.
   * - returns: { token, user }
   */
  return apiRequest<AuthResponse>('/api/auth/login', {
    method: 'POST',
    body: { email, password },
  })
}

// PUBLIC_INTERFACE
export async function register(email: string, password: string, name?: string): Promise<AuthResponse> {
  /** Register a new user account.
   * - returns: { token, user }
   */
  return apiRequest<AuthResponse>('/api/auth/register', {
    method: 'POST',
    body: { email, password, name },
  })
}

// PUBLIC_INTERFACE
export async function me(): Promise<User> {
  /** Retrieve current authenticated user profile. */
  return apiRequest<User>('/api/auth/me', { auth: true })
}
