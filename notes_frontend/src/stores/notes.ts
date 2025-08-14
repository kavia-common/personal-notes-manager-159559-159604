import { defineStore } from 'pinia'
import type { Note } from '@/services/notes'
import * as NotesService from '@/services/notes'

interface NotesState {
  notes: Note[]
  selectedNoteId: string | null
  loading: boolean
  error: string | null
  searchQuery: string
}

export const useNotesStore = defineStore('notes', {
  state: (): NotesState => ({
    notes: [],
    selectedNoteId: null,
    loading: false,
    error: null,
    searchQuery: '',
  }),
  getters: {
    selectedNote: (state): Note | null =>
      state.notes.find((n) => n.id === state.selectedNoteId) || null,
    filteredNotes: (state): Note[] => {
      const q = state.searchQuery.trim().toLowerCase()
      if (!q) return state.notes.slice().sort(byUpdatedDesc)
      return state.notes
        .filter(
          (n) =>
            n.title.toLowerCase().includes(q) ||
            (n.content || '').toLowerCase().includes(q)
        )
        .sort(byUpdatedDesc)
    },
  },
  actions: {
    // PUBLIC_INTERFACE
    async fetchNotes() {
      /** Load user notes from backend. */
      this.loading = true
      this.error = null
      try {
        const items = await NotesService.listNotes()
        this.notes = items.sort(byUpdatedDesc)
        if (!this.selectedNoteId && this.notes.length > 0) {
          this.selectedNoteId = this.notes[0].id
        }
      } catch (e: unknown) {
        const message = e instanceof Error ? e.message : String(e)
        this.error = message || 'Failed to load notes'
        throw e
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async createNote(defaults?: Partial<Pick<Note, 'title' | 'content'>>) {
      /** Create a new note and select it. */
      this.loading = true
      try {
        const newNote = await NotesService.createNote(defaults)
        this.notes.unshift(newNote)
        this.selectedNoteId = newNote.id
      } finally {
        this.loading = false
      }
    },
    // PUBLIC_INTERFACE
    async updateSelectedNote(payload: Partial<Pick<Note, 'title' | 'content'>>) {
      /** Update currently selected note and sync in store. */
      if (!this.selectedNoteId) return
      const updated = await NotesService.updateNote(this.selectedNoteId, payload)
      const idx = this.notes.findIndex((n) => n.id === this.selectedNoteId)
      if (idx !== -1) this.notes[idx] = updated
    },
    // PUBLIC_INTERFACE
    async deleteSelectedNote() {
      /** Delete currently selected note and select another if available. */
      if (!this.selectedNoteId) return
      const id = this.selectedNoteId
      await NotesService.deleteNote(id)
      this.notes = this.notes.filter((n) => n.id !== id)
      this.selectedNoteId = this.notes.length ? this.notes[0].id : null
    },
    // PUBLIC_INTERFACE
    selectNote(id: string) {
      /** Select a note by id. */
      this.selectedNoteId = id
    },
    // PUBLIC_INTERFACE
    setSearch(query: string) {
      /** Set the search query for filtering notes. */
      this.searchQuery = query
    },
  },
})

function byUpdatedDesc(a: Note, b: Note) {
  return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
}
