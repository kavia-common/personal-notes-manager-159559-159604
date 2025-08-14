<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute, RouterLink } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const route = useRoute()
const auth = useAuthStore()

const email = ref('')
const password = ref('')
const error = ref<string | null>(null)
const loading = ref(false)

async function onSubmit() {
  error.value = null
  loading.value = true
  try {
    await auth.login(email.value, password.value)
    const redirect = (route.query.redirect as string) || '/notes'
    router.replace(redirect)
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : String(e)
    error.value = message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>Welcome back</h1>
      <p class="muted">Sign in to continue</p>
      <form @submit.prevent="onSubmit" class="form">
        <label>Email</label>
        <input v-model="email" type="email" required placeholder="you@example.com" />
        <label>Password</label>
        <input v-model="password" type="password" required placeholder="••••••••" />
        <button class="btn primary" type="submit" :disabled="loading">
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>
        <p v-if="error" class="error">{{ error }}</p>
      </form>
      <p class="alt">
        New here?
        <RouterLink to="/register">Create an account</RouterLink>
      </p>
    </div>
  </div>
</template>

<style scoped>
.auth-container {
  min-height: 100vh;
  display: grid;
  place-items: center;
  background: var(--color-background-soft);
}
.auth-card {
  width: 100%;
  max-width: 420px;
  background: var(--vt-c-white);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 24px rgba(0,0,0,0.06);
}
h1 {
  margin-bottom: 0.25rem;
}
.muted {
  color: var(--text-muted);
  margin-bottom: 1.25rem;
}
.form {
  display: grid;
  gap: 0.5rem;
}
label {
  font-size: 0.875rem;
  color: var(--text-muted);
}
input {
  padding: 0.75rem 0.9rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  outline: none;
}
input:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--primary) 20%, transparent);
}
.btn {
  margin-top: 0.75rem;
}
.error {
  color: #b91c1c;
  margin-top: 0.5rem;
}
.alt {
  margin-top: 1rem;
  color: var(--text-muted);
  text-align: center;
}
</style>
