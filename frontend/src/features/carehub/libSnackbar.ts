// Lightweight snackbar shim for CareHub pages.
// If notistack is installed, this returns its hook; otherwise a minimal fallback.
export async function getSnackbar() {
  try {
    const mod = await import('notistack');
    return mod.useSnackbar as typeof mod.useSnackbar;
  } catch {
    return function useSnackbarFallback() {
      return {
        enqueueSnackbar: (msg: string, _opts?: any) => {
          // fallback: console logging
          // eslint-disable-next-line no-console
          console.log('[snackbar]', msg, _opts || '');
        }
      };
    } as any;
  }
}

// Synchronous helper for modules that prefer direct call (not ideal but simple)
export function useSnackbarSync() {
  // attempt to require via dynamic import but keep sync contract by returning a fallback if import not ready
  // consumer can switch to getSnackbar() for async usage
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  getSnackbar();
  return {
    enqueueSnackbar: (msg: string, _opts?: any) => {
      // best-effort: console fallback
      // eslint-disable-next-line no-console
      console.log('[snackbar]', msg, _opts || '');
    }
  };
}

// Provide a named export `useSnackbar` for compatibility with existing pages.
export function useSnackbar() {
  return useSnackbarSync();
}
