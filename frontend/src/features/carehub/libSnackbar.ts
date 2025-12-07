// Re-export useSnackbar from notistack for CareHub pages.
// This uses the real notistack hook which works with the SnackbarProvider in AppThemeProvider.
import { useSnackbar as useNotistackSnackbar } from 'notistack';

export { useNotistackSnackbar as useSnackbar };

// Legacy async function for backward compatibility (not needed but kept for reference)
export async function getSnackbar() {
  const mod = await import('notistack');
  return mod.useSnackbar;
}
