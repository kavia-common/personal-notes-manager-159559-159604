<script setup lang="ts">
import { ref, watch } from 'vue'
import { useNotesStore } from '@/stores/notes'

const notes = useNotesStore()
const query = ref(notes.searchQuery)

watch(query, (q) => notes.setSearch(q))
function newNote() {
  notes.createNote({ title: 'Untitled', content: '' })
}
</script>

<template>
  <header class="topbar">
    <div class="search-box">
      <span class="icon">🔎</span>
      <input v-model="query" type="search" placeholder="Search notes..." />
    </div>
    <div class="actions">
      <button class="btn primary" @click="newNote">New Note</button>
    </div>
  </header>
</template>

<style scoped>
.topbar {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.75rem 1rem;
  backdrop-filter: blur(6px);
  background: var(--color-background);
}
.search-box {
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  border-radius: 10px;
  padding: 0.5rem 0.75rem;
}
.search-box .icon { opacity: 0.6; }
.search-box input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
}
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
