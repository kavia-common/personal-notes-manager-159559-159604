export const config = {
  // Base URL for backend API, must be set via .env using VITE_API_BASE_URL
  apiBaseUrl: (import.meta.env.VITE_API_BASE_URL as string) || '',
}

if (!config.apiBaseUrl) {
  console.warn(
    '[Config] VITE_API_BASE_URL is not set. API calls will fail. Provide it in your environment.'
  )
}
