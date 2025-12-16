// src/services/medicamentoService.ts
export const MED_KEY = 'medmod:medicamentos';
export const HIST_KEY = 'medmod:medicamentos_history';

export type Medicamento = {
  id?: string;
  nome: string;
  tipo?: 'comprimido' | 'liquido';
  quantidadeTotal?: number; // total comprimidos ou ml restante
  unidadePorDose?: number; // unidades por dose (comprimido)
  mlPorDose?: number; // ml por dose (liquido)
  vezesAoDia?: number;
  horarios?: string[]; // ex: ["08:00","14:00"]
  tarja?: string;
  contatoEmergenciaId?: string;
};

export type HistoricoEntry = {
  id: string;
  medicamentoId?: string;
  nome: string;
  tipo?: 'comprimido' | 'liquido';
  amountTaken: number; // quantidade removida (ex: 1 comprimido ou 5 ml)
  takenAt: string; // ISO date string
  horarioIndex?: number; // index do horário (0..n-1) — opcional para compatibilidade
  note?: string;
};

const makeId = () =>
  typeof crypto !== 'undefined' && (crypto as any).randomUUID
    ? (crypto as any).randomUUID()
    : `h_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;

export function loadMedicamentos(): Medicamento[] {
  try {
    const raw = localStorage.getItem(MED_KEY);
    return raw ? (JSON.parse(raw) as Medicamento[]) : [];
  } catch {
    return [];
  }
}

export function saveMedicamentos(meds: Medicamento[]) {
  try {
    localStorage.setItem(MED_KEY, JSON.stringify(meds));
  } catch {
    // ignore
  }
}

export function loadHistorico(): HistoricoEntry[] {
  try {
    const raw = localStorage.getItem(HIST_KEY);
    return raw ? (JSON.parse(raw) as HistoricoEntry[]) : [];
  } catch {
    return [];
  }
}

export function saveHistorico(hist: HistoricoEntry[]) {
  try {
    localStorage.setItem(HIST_KEY, JSON.stringify(hist));
  } catch {
    // ignore
  }
}

/**
 * Registra que um medicamento foi tomado:
 * - horarioIndex (opcional) identifica qual horário foi marcado
 * - calcula amountTaken a partir do medicamento (unidadePorDose ou mlPorDose)
 * - decrementa quantidadeTotal (não ficando negativo)
 * - salva medicamentos e histórico no localStorage
 * - retorna o novo medicamento e o entry criado
 */
export function registrarTomada(medId: string, horarioIndex?: number): { updatedMed?: Medicamento; entry?: HistoricoEntry } | null {
  const meds = loadMedicamentos();
  const idx = meds.findIndex((m) => m.id === medId);
  if (idx < 0) return null;
  const med = { ...meds[idx] };
  const tipo = med.tipo ?? 'comprimido';

  let amountTaken = 0;
  if (tipo === 'comprimido') {
    amountTaken = Number(med.unidadePorDose ?? 1) || 1;
  } else {
    amountTaken = Number(med.mlPorDose ?? 0) || 0;
  }

  const prevQty = Number(med.quantidadeTotal ?? 0);
  let newQty = prevQty - amountTaken;
  if (newQty < 0) newQty = 0;
  med.quantidadeTotal = newQty;

  meds[idx] = med;
  saveMedicamentos(meds);

  const entry: HistoricoEntry = {
    id: makeId(),
    medicamentoId: med.id,
    nome: med.nome,
    tipo: tipo as any,
    amountTaken,
    takenAt: new Date().toISOString(),
    horarioIndex: typeof horarioIndex === 'number' ? horarioIndex : undefined,
  };

  const hist = loadHistorico();
  hist.unshift(entry); // mais recente primeiro
  saveHistorico(hist);

  return { updatedMed: med, entry };
}
