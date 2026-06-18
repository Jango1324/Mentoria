export type Theme = 'light' | 'dark' | 'system'

export const THEME_KEY = 'mentoria-theme'

export const THEMES: Theme[] = ['light', 'dark', 'system']

export function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_KEY)
    if (stored === 'light' || stored === 'dark' || stored === 'system') return stored
  } catch {
    // localStorage unavailable (SSR or private browsing)
  }
  return 'system'
}

export function applyTheme(theme: Theme): void {
  const root = document.documentElement
  if (theme === 'dark') {
    root.setAttribute('data-theme', 'dark')
  } else if (theme === 'light') {
    root.setAttribute('data-theme', 'light')
  } else {
    // system — remove attribute, let @media (prefers-color-scheme) take over
    root.removeAttribute('data-theme')
  }
  try {
    localStorage.setItem(THEME_KEY, theme)
  } catch {
    // ignore write failures
  }
}
