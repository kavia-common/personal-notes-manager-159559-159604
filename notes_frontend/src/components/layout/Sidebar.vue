<script setup lang="ts">
defineOptions({ name: 'AppSidebar' })

import { useRouter } from 'vue-router'
import { useNotesStore } from '@/stores/notes'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const notes = useNotesStore()
const auth = useAuthStore()

function newNote() {
  notes.createNote({ title: 'Untitled', content: '' })
}
function logout() {
  auth.logout()
  router.replace('/login')
}
</script>

<template>
  <aside class="sidebar">
    <div class="brand">
      <div class="logo">📝</div>
      <div class="title">Notes</div>
    </div>
    <nav class="nav">
      <button class="nav-item" @click="notes.fetchNotes()">All Notes</button>
      <button class="nav-item" @click="newNote">New Note</button>
    </nav>
    <div class="spacer"></div>
    <div class="user">
      <div class="email" :title="auth.user?.email">{{ auth.user?.email }}</div>
      <button class="btn secondary small" @click="logout">Logout</button>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  height: 100%;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  gap: 1rem;
}
.brand {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.logo {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  border-radius: 8px;
  background: color-mix(in srgb, var(--primary) 12%, transparent);
}
.title {
  font-weight: 700;
  color: var(--primary);
}
.nav {
  display: grid;
  gap: 0.25rem;
}
.nav-item {
  text-align: left;
  padding: 0.6rem 0.75rem;
  border-radius: 8px;
  border: 1px solid transparent;
  background: transparent;
  color: var(--color-text);
  cursor: pointer;
}
.nav-item:hover {
  background: var(--color-background);
  border-color: var(--color-border);
}
.spacer {
  flex: 1;
}
.user {
  display: grid;
  gap: 0.5rem;
}
.email {
  color: var(--text-muted);
  font-size: 0.875rem;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
