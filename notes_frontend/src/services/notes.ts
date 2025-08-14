import { apiRequest } from './api'

export interface NotePayload {
  title: string
  content: string
}

export interface Note extends NotePayload {
  id: string
  createdAt: string
  updatedAt: string
}

// PUBLIC_INTERFACE
export async function listNotes(): Promise<Note[]> {
  /** Fetch all notes for the authenticated user. */
  return apiRequest<Note[]>('/api/notes', { auth: true })
}

// PUBLIC_INTERFACE
export async function getNote(id: string): Promise<Note> {
  /** Fetch a single note by id. */
  return apiRequest<Note>(`/api/notes/${encodeURIComponent(id)}`, { auth: true })
}

// PUBLIC_INTERFACE
export async function createNote(payload: Partial<NotePayload> = {}): Promise<Note> {
  /** Create a new note with optional title/content. */
  return apiRequest<Note>('/api/notes', { method: 'POST', auth: true, body: payload })
}

// PUBLIC_INTERFACE
export async function updateNote(id: string, payload: Partial<NotePayload>): Promise<Note> {
  /** Update an existing note by id. */
  return apiRequest<Note>(`/api/notes/${encodeURIComponent(id)}`, {
    method: 'PUT',
    auth: true,
    body: payload,
  })
}

// PUBLIC_INTERFACE
export async function deleteNote(id: string): Promise<{ success: boolean }> {
  /** Delete an existing note by id. */
  return apiRequest<{ success: boolean }>(`/api/notes/${encodeURIComponent(id)}`, {
    method: 'DELETE',
    auth: true,
  })
}
