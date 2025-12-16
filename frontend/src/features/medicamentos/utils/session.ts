export function getUsuarioId(): number | null {
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return null;

    const user = JSON.parse(raw);
    return user?.userId ?? null;
  } catch {
    return null;
  }
}
