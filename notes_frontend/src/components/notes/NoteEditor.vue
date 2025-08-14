<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useNotesStore } from '@/stores/notes'

const notes = useNotesStore()

const localTitle = ref('')
const localContent = ref('')

const selected = computed(() => notes.selectedNote)

watch(
  () => notes.selectedNoteId,
  () => {
    localTitle.value = selected.value?.title || ''
    localContent.value = selected.value?.content || ''
  },
  { immediate: true }
)

async function save() {
  if (!notes.selectedNoteId) return
  await notes.updateSelectedNote({ title: localTitle.value, content: localContent.value })
}

</script>

<template>
  <div class="editor">
    <div v-if="selected" class="editor-inner">
      <input
        v-model="localTitle"
        class="title"
        placeholder="Title"
        @change="save"
      />
      <textarea
        v-model="localContent"
        class="content"
        placeholder="Start typing your note..."
        @change="save"
      ></textarea>
      <div class="toolbar">
        <button class="btn accent" @click="save">Save</button>
      </div>
    </div>
    <div v-else class="empty-editor">
      Select a note from the list or create a new one.
    </div>
  </div>
</template>

<style scoped>
.editor {
  height: 100%;
  display: grid;
  grid-template-rows: 1fr;
}
.editor-inner {
  display: grid;
  grid-template-rows: auto 1fr auto;
  padding: 1rem;
  gap: 0.75rem;
  max-width: 1100px;
  margin: 0 auto;
  width: 100%;
}
.title {
  font-size: 1.4rem;
  font-weight: 600;
  padding: 0.6rem 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  background: var(--vt-c-white);
}
.content {
  width: 100%;
  height: 100%;
  resize: none;
  padding: 0.75rem;
  border-radius: 10px;
  border: 1px solid var(--color-border);
  line-height: 1.6;
  background: var(--vt-c-white);
}
.toolbar {
  display: flex;
  justify-content: flex-end;
}
.empty-editor {
  height: 100%;
  display: grid;
  place-items: center;
  color: var(--text-muted);
}
</style>
