export function getOrCreateUserId(): string {
  const localStorageKey = 'user_id'

  // Check if the user ID already exists in localStorage
  let userId = localStorage.getItem(localStorageKey)
  if (userId) {
    return userId
  }

  // Generate a new user ID (UUID-like)
  userId = crypto.randomUUID() // requires a browser that supports Web Crypto API
  localStorage.setItem(localStorageKey, userId)
  return userId
}
