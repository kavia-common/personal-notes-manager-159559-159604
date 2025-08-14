<script setup lang="ts">
import { onMounted } from 'vue'
import Sidebar from '@/components/layout/Sidebar.vue'
import TopBar from '@/components/layout/TopBar.vue'
import NotesList from '@/components/notes/NotesList.vue'
import NoteEditor from '@/components/notes/NoteEditor.vue'
import { useNotesStore } from '@/stores/notes'

const notes = useNotesStore()

onMounted(() => {
  notes.fetchNotes().catch(() => {
    // handled elsewhere
  })
})
</script>

<template>
  <div class="notes-layout">
    <Sidebar class="sidebar" />
    <div class="content">
      <TopBar class="topbar" />
      <div class="main">
        <div class="list-pane">
          <NotesList />
        </div>
        <div class="editor-pane">
          <NoteEditor />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.notes-layout {
  display: grid;
  grid-template-columns: 260px 1fr;
  min-height: 100vh;
  background: var(--color-background);
}
.sidebar {
  border-right: 1px solid var(--color-border);
  background: var(--color-background-soft);
}
.content {
  display: grid;
  grid-template-rows: 64px 1fr;
  height: 100vh;
}
.topbar {
  border-bottom: 1px solid var(--color-border);
}
.main {
  display: grid;
  grid-template-columns: 360px 1fr;
  height: calc(100vh - 64px);
}
.list-pane {
  border-right: 1px solid var(--color-border);
  overflow: auto;
  background: var(--color-background-soft);
}
.editor-pane {
  overflow: auto;
}
@media (max-width: 1024px) {
  .notes-layout {
    grid-template-columns: 1fr;
  }
  .sidebar {
    display: none;
  }
  .content {
    grid-template-rows: auto 1fr;
  }
  .main {
    grid-template-columns: 1fr;
    grid-template-rows: 1fr 1fr;
  }
  .list-pane {
    border-right: 0;
    border-bottom: 1px solid var(--color-border);
  }
}
</style>
