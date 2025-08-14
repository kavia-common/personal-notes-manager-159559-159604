<script setup lang="ts">
import { computed } from 'vue'
import { useNotesStore } from '@/stores/notes'
import type { Note } from '@/services/notes'

const notesStore = useNotesStore()
const items = computed<Note[]>(() => notesStore.filteredNotes)
const selectedId = computed(() => notesStore.selectedNoteId)

function select(id: string) {
  notesStore.selectNote(id)
}

async function remove(id: string, e: MouseEvent) {
  e.stopPropagation()
  if (confirm('Delete this note?')) {
    const wasSelected = notesStore.selectedNoteId === id
    await notesStore.deleteSelectedNote.call({ ...notesStore, selectedNoteId: id })
    if (wasSelected && notesStore.notes.length === 0) {
      // nothing to select
    }
  }
}

function formatDate(s: string) {
  try {
    const d = new Date(s)
    return d.toLocaleString()
  } catch {
    return s
  }
}
</script>

<template>
  <div class="notes-list">
    <div
      v-for="n in items"
      :key="n.id"
      class="note-item"
      :class="{ active: n.id === selectedId }"
      @click="select(n.id)"
    >
      <div class="title-row">
        <div class="title">{{ n.title || 'Untitled' }}</div>
        <button class="icon-btn danger" title="Delete" @click="(e) => remove(n.id, e)">🗑️</button>
      </div>
      <div class="preview">{{ n.content?.slice(0, 100) }}</div>
      <div class="meta">Updated {{ formatDate(n.updatedAt) }}</div>
    </div>

    <div v-if="items.length === 0" class="empty">No notes yet. Create your first note!</div>
  </div>
</template>

<style scoped>
.notes-list {
  padding: 0.75rem;
  display: grid;
  gap: 0.5rem;
}
.note-item {
  border: 1px solid var(--color-border);
  background: var(--vt-c-white);
  border-radius: 10px;
  padding: 0.75rem;
  display: grid;
  gap: 0.25rem;
  cursor: pointer;
}
.note-item.active {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}
.title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}
.title {
  font-weight: 600;
}
.preview {
  color: var(--text-muted);
  font-size: 0.9rem;
}
.meta {
  color: var(--text-muted);
  font-size: 0.75rem;
}
.icon-btn {
  border: none;
  background: transparent;
  cursor: pointer;
  border-radius: 8px;
  padding: 0.25rem 0.4rem;
}
.icon-btn:hover {
  background: var(--color-background-soft);
}
.icon-btn.danger:hover {
  color: #b91c1c;
}
.empty {
  color: var(--text-muted);
  text-align: center;
  padding: 2rem 1rem;
}
</style>
