// src/services/contatoService.ts
export const CONTATOS_KEY = 'medmod:contatos';
export const MAX_CONTACTS = 5;

export type Contato = {
  id: string;
  nome: string;
  telefone: string;
  relacao?: string;
};

const makeId = () =>
  typeof crypto !== 'undefined' && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : `c_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function loadContatos(): Contato[] {
  try {
    const raw = localStorage.getItem(CONTATOS_KEY);
    return raw ? (JSON.parse(raw) as Contato[]) : [];
  } catch {
    return [];
  }
}

export function saveContatos(list: Contato[]) {
  try {
    localStorage.setItem(CONTATOS_KEY, JSON.stringify(list));
  } catch {
    // ignore
  }
}

export function createContato(data: { nome: string; telefone: string; relacao?: string }): Contato | null {
  const list = loadContatos();
  if (list.length >= MAX_CONTACTS) return null;
  const novo: Contato = { id: makeId(), nome: data.nome, telefone: data.telefone, relacao: data.relacao ?? '' };
  list.push(novo);
  saveContatos(list);
  return novo;
}

export function updateContato(id: string, data: { nome: string; telefone: string; relacao?: string }): Contato | null {
  const list = loadContatos();
  const idx = list.findIndex((c) => c.id === id);
  if (idx < 0) return null;
  const updated: Contato = { ...list[idx], nome: data.nome, telefone: data.telefone, relacao: data.relacao ?? '' };
  list[idx] = updated;
  saveContatos(list);
  return updated;
}

export function deleteContato(id: string): boolean {
  const list = loadContatos();
  const newList = list.filter((c) => c.id !== id);
  if (newList.length === list.length) return false; // não encontrou
  saveContatos(newList);
  return true;
}
