export type SiteTone = 'light' | 'dark';

export const SITE_TONE_STORAGE_KEY = 'targetprep_site_tone';
export const SITE_TONE_EVENT = 'targetprep-site-tone-change';

const LIGHT_SHELL_COLOR = '#f5f8fc';
const DARK_SHELL_COLOR = '#121826';

function getShellColor(tone: SiteTone) {
  return tone === 'dark' ? DARK_SHELL_COLOR : LIGHT_SHELL_COLOR;
}

export function readSiteTone(): SiteTone {
  if (typeof window === 'undefined') return 'dark';

  try {
    return window.localStorage.getItem(SITE_TONE_STORAGE_KEY) === 'light' ? 'light' : 'dark';
  } catch {
    return 'dark';
  }
}

export function subscribeToSiteTone(callback: () => void) {
  if (typeof window === 'undefined') return () => {};

  const eventListener = () => callback();
  const storageListener = (event: StorageEvent) => {
    if (event.key === SITE_TONE_STORAGE_KEY) callback();
  };

  window.addEventListener(SITE_TONE_EVENT, eventListener);
  window.addEventListener('storage', storageListener);

  return () => {
    window.removeEventListener(SITE_TONE_EVENT, eventListener);
    window.removeEventListener('storage', storageListener);
  };
}

export function syncDocumentTone(tone: SiteTone) {
  if (typeof document === 'undefined') return;

  document.documentElement.dataset.siteTone = tone;
  document.documentElement.style.colorScheme = tone;
  document.documentElement.style.backgroundColor = getShellColor(tone);
}

export function applySiteTone(tone: SiteTone) {
  if (typeof window === 'undefined') return;

  syncDocumentTone(tone);
  try {
    window.localStorage.setItem(SITE_TONE_STORAGE_KEY, tone);
  } catch {
    // Ignore storage failures (private browsing, locked storage, etc.)
  }
  window.dispatchEvent(new Event(SITE_TONE_EVENT));
}
