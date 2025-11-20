import React, { useEffect, useMemo, useState } from "react";
import "./QuestionarioDemo.css";

/* ============================
   Config da API e SSO
   ============================ */
const BASE = import.meta.env.VITE_API_URL ?? "http://localhost:8080";
const USE_SSO =
  (import.meta.env.VITE_USE_PLATFORM_PROFILE ?? "false").toLowerCase() ===
  "true";

async function apiPost<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error((await res.text()) || `HTTP ${res.status}`);
  return res.json() as Promise<T>;
}

/* ============================
   Tipos
   ============================ */
type Step = "CADASTRO" | "QUESTIONARIO" | "PLANO";
type Sexo = "MASCULINO" | "FEMININO" | "OUTRO";

type Idoso = {
  id: number;
  nome: string;
  dataNascimento?: string | null;
  sexo?: Sexo | null;
  email?: string | null;
  telefone?: string | null;
};

type Resposta = { pergunta: string; resposta: string };

type PlanoDiaItem = {
  dia?: string;
  day?: string;
  diaSemana?: string;
  atividades: string[];
  _diaPt?: string; // preenchido no front
};

type PlanoExercicio = {
  id?: number | null;
  nivel: string;
  duracaoSemanas: number;
  diasPorSemana: number;
  minutosPorDia: number;
  itens: PlanoDiaItem[];
  _raw?: any;
};

type PlatformProfile = {
  email?: string;
  name?: string;
  birthdate?: string;
  gender?: string;
  phone?: string;
};

type Question = { slug: string; label: string; options: string[] };

/* ============================
   Utils (SSO / datas / dias)
   ============================ */
function parseJwt(token: string): any | null {
  try {
    const [, p] = token.split(".");
    if (!p) return null;
    return JSON.parse(atob(p.replace(/-/g, "+").replace(/_/g, "/")));
  } catch {
    return null;
  }
}

function getPlatformProfileFromStorage(): PlatformProfile | null {
  const raw = localStorage.getItem("elder_profile");
  if (raw) {
    try {
      return JSON.parse(raw);
    } catch {}
  }
  for (const k of ["id_token", "access_token", "token"]) {
    const t = localStorage.getItem(k);
    if (!t) continue;
    const c = parseJwt(t);
    if (c && (c.email || c.name)) {
      return {
        email: c.email,
        name: c.name ?? [c.given_name, c.family_name].filter(Boolean).join(" "),
        birthdate: c.birthdate ?? c.dob,
        gender: c.gender ?? c.sexo,
        phone: c.phone_number ?? c.phone,
      };
    }
  }
  return null;
}

function mapGenderToSexo(g?: string): Sexo | undefined {
  if (!g) return undefined;
  const s = g.toLowerCase();
  if (["male", "m", "masculino"].includes(s)) return "MASCULINO";
  if (["female", "f", "feminino"].includes(s)) return "FEMININO";
  return "OUTRO";
}

function toActivitiesArray(src: any): string[] {
  if (!src) return [];
  if (Array.isArray(src))
    return src
      .map((x) =>
        typeof x === "string"
          ? x.trim()
          : x?.nome ??
            x?.name ??
            x?.titulo ??
            x?.title ??
            x?.exercicio ??
            x?.descricao ??
            JSON.stringify(x)
      )
      .filter(Boolean);
  if (typeof src === "string")
    return src
      .split(/[;\n]/g)
      .map((s) => s.trim())
      .filter(Boolean);
  return [];
}

const WEEK_ORDER = [
  "SEGUNDA-FEIRA",
  "TERÇA-FEIRA",
  "QUARTA-FEIRA",
  "QUINTA-FEIRA",
  "SEXTA-FEIRA",
  "SÁBADO",
  "DOMINGO",
];

function mapWeekdayPtBr(raw?: string) {
  if (!raw) return "DIA";
  const s = raw.toLowerCase();
  if (s.includes("mon") || s.includes("segunda")) return "SEGUNDA-FEIRA";
  if (s.includes("tue") || s.includes("terca") || s.includes("terça"))
    return "TERÇA-FEIRA";
  if (s.includes("wed") || s.includes("quarta")) return "QUARTA-FEIRA";
  if (s.includes("thu") || s.includes("quinta")) return "QUINTA-FEIRA";
  if (s.includes("fri") || s.includes("sexta")) return "SEXTA-FEIRA";
  if (s.includes("sat") || s.includes("sab")) return "SÁBADO";
  if (s.includes("sun") || s.includes("dom")) return "DOMINGO";
  return raw.toUpperCase();
}

function weekdaySortIndex(pt: string) {
  const i = WEEK_ORDER.indexOf(pt);
  return i >= 0 ? i : 99;
}

function calcIdade(iso?: string | null) {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  const h = new Date();
  let i = h.getFullYear() - d.getFullYear();
  const m = h.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && h.getDate() < d.getDate())) i--;
  return i;
}

function nivelBadgeClass(n: string) {
  const s = (n ?? "").toLowerCase();
  if (s.includes("baixo")) return "nivel-baixo";
  if (s.includes("medio") || s.includes("médio")) return "nivel-medio";
  if (s.includes("alto")) return "nivel-alto";
  return "nivel-custom";
}

/* ============================
   Questionário (40)
   ============================ */
const QUESTIONS: Question[] = [
  // Condição física geral
  {
    slug: "cansaco_ativ_leves",
    label: "Você sente cansaço em atividades leves?",
    options: ["nunca", "as_vezes", "frequente"],
  },
  {
    slug: "adl_sem_ajuda",
    label: "Realiza atividades do dia a dia sem ajuda?",
    options: ["sim", "as_vezes", "nao"],
  },
  {
    slug: "atividade_freq_semana",
    label: "Frequência de atividade física por semana",
    options: ["nunca", "1x", "2x", "3x", "4x_ou_mais"],
  },
  {
    slug: "dores_articulares",
    label: "Dores musculares/articulares com frequência?",
    options: ["nao", "as_vezes", "frequente"],
  },
  {
    slug: "mobilidade_nivel",
    label: "Nível de mobilidade",
    options: ["baixo", "medio", "alto"],
  },

  // Cardio/resp
  {
    slug: "hipertensao",
    label: "Hipertensão?",
    options: ["nao", "sim_controlada", "sim_nao_controlada"],
  },
  {
    slug: "problema_cardiaco",
    label: "Já teve problema cardíaco?",
    options: ["nao", "sim"],
  },
  {
    slug: "falta_ar_esforco_leve",
    label: "Falta de ar em esforço leve?",
    options: ["nunca", "as_vezes", "frequente"],
  },
  {
    slug: "medicacao_coracao_pressao",
    label: "Usa medicação p/ coração/pressão?",
    options: ["nao", "sim"],
  },
  {
    slug: "recomendacao_limitar_esforco",
    label: "Algum médico recomendou limitar esforço?",
    options: ["nao", "sim"],
  },

  // Força/equilíbrio/postura
  {
    slug: "inseguranca_caminhar",
    label: "Sente insegurança ao caminhar?",
    options: ["nao", "as_vezes", "sim"],
  },
  {
    slug: "quedas_ultimo_ano",
    label: "Quedas no último ano",
    options: ["nenhuma", "1", "2oumais"],
  },
  {
    slug: "levantar_sem_apoio",
    label: "Consegue levantar sem apoio?",
    options: ["sim", "dificuldade", "nao_consegue"],
  },
  {
    slug: "equilibrio_unipodal",
    label: "Equilíbrio em um pé (segundos)",
    options: ["10oumais", "5a9", "menos5"],
  },
  {
    slug: "dores_membros_tronco",
    label: "Dores em membros/tronco?",
    options: ["nao", "as_vezes", "frequente"],
  },

  // Flex/coord
  {
    slug: "tocar_pes_sem_dobrar",
    label: "Toca os pés sem dobrar joelhos?",
    options: ["sim", "com_dificuldade", "nao"],
  },
  {
    slug: "rigidez_ao_acordar",
    label: "Rigidez ao acordar?",
    options: ["nao", "as_vezes", "frequente"],
  },
  {
    slug: "alonga_regularmente",
    label: "Faz alongamento regularmente?",
    options: ["sim", "as_vezes", "nao"],
  },
  {
    slug: "dificuldade_coordenacao",
    label: "Dificuldade de coordenação?",
    options: ["nao", "leve", "moderada", "grave"],
  },
  {
    slug: "quer_melhorar_flexibilidade",
    label: "Deseja melhorar flexibilidade?",
    options: ["sim", "nao"],
  },

  // Hábitos/estilo de vida
  { slug: "fuma", label: "Fuma?", options: ["nao", "sim_ocasional", "sim_diario"] },
  {
    slug: "alcool_frequencia",
    label: "Frequência de álcool",
    options: ["nao", "1a2_semana", "3oumais_semana", "diario"],
  },
  {
    slug: "alimentacao_avaliacao",
    label: "Como avalia sua alimentação?",
    options: ["boa", "regular", "ruim"],
  },
  { slug: "dorme_bem", label: "Dorme bem?", options: ["sim", "as_vezes", "nao"] },
  {
    slug: "ativ_ao_ar_livre",
    label: "Atividades ao ar livre",
    options: ["nunca", "1x_semana", "2a3_semana", "4oumais_semana"],
  },

  // Mental/social
  {
    slug: "solidao_desmotivacao",
    label: "Solidão/desmotivação",
    options: ["nunca", "as_vezes", "frequente"],
  },
  {
    slug: "participa_grupos_sociais",
    label: "Participa de grupos sociais",
    options: ["nunca", "mensal", "semanal"],
  },
  {
    slug: "estresse_ansiedade",
    label: "Estresse/ansiedade",
    options: ["nunca", "as_vezes", "frequente"],
  },
  { slug: "diag_depressao", label: "Diagnóstico de depressão", options: ["nao", "sim"] },
  {
    slug: "prazer_exercicio",
    label: "Sente prazer em se exercitar?",
    options: ["sim", "as_vezes", "nao"],
  },

  // Preferências
  {
    slug: "objetivo_principal",
    label: "Objetivo principal",
    options: ["mobilidade", "forca", "equilibrio", "relaxar", "emagrecer"],
  },
  {
    slug: "preferencia_social",
    label: "Preferência social",
    options: ["individual", "grupo", "indiferente"],
  },
  {
    slug: "intensidade_preferida",
    label: "Intensidade preferida",
    options: ["leve", "moderada"],
  },
  { slug: "gosta_musica", label: "Gosta de música durante o treino?", options: ["sim", "nao"] },
  { slug: "local_preferido", label: "Local preferido", options: ["casa", "academia", "parque"] },

  // Rotina
  { slug: "dias_por_semana", label: "Dias por semana", options: ["1", "2", "3", "4oumais"] },
  {
    slug: "tempo_por_dia",
    label: "Tempo por dia (min)",
    options: ["15", "20", "30", "45", "60"],
  },
  {
    slug: "horario_preferido",
    label: "Horário preferido",
    options: ["manha", "tarde", "noite"],
  },
  {
    slug: "equipamentos",
    label: "Equipamentos disponíveis",
    options: ["nenhum", "halteres", "elastico", "halteres_e_elastico", "outros"],
  },
  {
    slug: "acomp_medico_ou_fisio",
    label: "Acomp. médico/fisioterapeuta",
    options: ["nao", "sim"],
  },
];

/* categorias (5 perguntas por tela) */
const CATEGORIES = [
  {
    id: "condicao",
    title: "Condição física geral",
    emoji: "🧩",
    items: [
      "cansaco_ativ_leves",
      "adl_sem_ajuda",
      "atividade_freq_semana",
      "dores_articulares",
      "mobilidade_nivel",
    ],
  },
  {
    id: "cardio",
    title: "Saúde cardiovascular e respiratória",
    emoji: "💓",
    items: [
      "hipertensao",
      "problema_cardiaco",
      "falta_ar_esforco_leve",
      "medicacao_coracao_pressao",
      "recomendacao_limitar_esforco",
    ],
  },
  {
    id: "forca",
    title: "Força, equilíbrio e postura",
    emoji: "🏃",
    items: [
      "inseguranca_caminhar",
      "quedas_ultimo_ano",
      "levantar_sem_apoio",
      "equilibrio_unipodal",
      "dores_membros_tronco",
    ],
  },
  {
    id: "flexcoord",
    title: "Flexibilidade e coordenação",
    emoji: "🧘",
    items: [
      "tocar_pes_sem_dobrar",
      "rigidez_ao_acordar",
      "alonga_regularmente",
      "dificuldade_coordenacao",
      "quer_melhorar_flexibilidade",
    ],
  },
  {
    id: "habitos",
    title: "Hábitos e estilo de vida",
    emoji: "🍎",
    items: [
      "fuma",
      "alcool_frequencia",
      "alimentacao_avaliacao",
      "dorme_bem",
      "ativ_ao_ar_livre",
    ],
  },
  {
    id: "mental",
    title: "Saúde mental e social",
    emoji: "🧠",
    items: [
      "solidao_desmotivacao",
      "participa_grupos_sociais",
      "estresse_ansiedade",
      "diag_depressao",
      "prazer_exercicio",
    ],
  },
  {
    id: "prefer",
    title: "Objetivos e preferências",
    emoji: "🧍",
    items: [
      "objetivo_principal",
      "preferencia_social",
      "intensidade_preferida",
      "gosta_musica",
      "local_preferido",
    ],
  },
  {
    id: "rotina",
    title: "Disponibilidade e rotina",
    emoji: "⏱",
    items: [
      "dias_por_semana",
      "tempo_por_dia",
      "horario_preferido",
      "equipamentos",
      "acomp_medico_ou_fisio",
    ],
  },
];

/* ============================
   Normalização do plano (backend → front)
   ============================ */
function normalizePlanoResponse(raw: any): PlanoExercicio {
  const nivel = raw?.nivel ?? raw?.level ?? "personalizado";
  const duracaoSemanas = Number(raw?.duracaoSemanas ?? raw?.weeks ?? 4) || 4;
  const diasPorSemana = Number(raw?.diasPorSemana ?? raw?.daysPerWeek ?? 3) || 3;
  const minutosPorDia = Number(raw?.minutosPorDia ?? raw?.minutesPerDay ?? 30) || 30;

  const lista = Array.isArray(raw?.itens)
    ? raw.itens
    : Array.isArray(raw?.items)
    ? raw.items
    : Array.isArray(raw?.dias)
    ? raw.dias
    : [];

  const itens: PlanoDiaItem[] = lista.map((i: any) => ({
    dia: i?.dia ?? i?.diaSemana ?? i?.day ?? i?.weekday ?? "Dia",
    atividades: toActivitiesArray(
      i?.atividades ?? i?.exercicios ?? i?.exercises ?? i?.atividade
    ),
  }));

  return {
    id: raw?.id ?? null,
    nivel,
    duracaoSemanas,
    diasPorSemana,
    minutosPorDia,
    itens,
    _raw: raw,
  };
}

/* ============================
   Componente
   ============================ */
export default function QuestionarioDemo() {
  const [step, setStep] = useState<Step>("CADASTRO");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [idosoId, setIdosoId] = useState<number | null>(null);
  const [plano, setPlano] = useState<PlanoExercicio | null>(null);

  // wizard
  const [catIndex, setCatIndex] = useState(0);

  // cadastro
  const [nome, setNome] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [sexo, setSexo] = useState<Sexo>("OUTRO");
  const [email, setEmail] = useState("");
  const [telefone, setTelefone] = useState("");

  // respostas
  const initial = useMemo(() => {
    const o: Record<string, string> = {};
    QUESTIONS.forEach((q) => (o[q.slug] = q.options[0]));
    return o;
  }, []);
  const [answers, setAnswers] = useState<Record<string, string>>(initial);
  const updateAnswer = (slug: string, v: string) =>
    setAnswers((a) => ({ ...a, [slug]: v }));

  // dicionário de perguntas por slug (TIPADO!)
  const bySlug = useMemo(() => {
    const m: Record<string, Question> = {};
    QUESTIONS.forEach((q) => (m[q.slug] = q));
    return m;
  }, []);

  /* ======== SSO (opcional) ======== */
  useEffect(() => {
    if (!USE_SSO) return;
    (async () => {
      const p = getPlatformProfileFromStorage();
      if (!p?.email) {
        setStep("CADASTRO");
        return;
      }
      try {
        setLoading(true);
        setError(null);

        setNome(p.name ?? "");
        setEmail(p.email ?? "");
        if (p.birthdate) setDataNascimento(p.birthdate);
        const sx = mapGenderToSexo(p.gender);
        if (sx) setSexo(sx);
        if (p.phone) setTelefone(p.phone);

        const ensured = await apiPost<Idoso>("/api/eldercare/idosos/ensure", {
          nome: p.name ?? "Usuário",
          email: p.email!,
          dataNascimento: p.birthdate ?? null,
          sexo: sx ?? "OUTRO",
          telefone: p.phone ?? null,
        });
        setIdosoId(ensured.id);
        setCatIndex(0);
        setStep("QUESTIONARIO");
      } catch (e: any) {
        console.error(e);
        setError(
          "Não foi possível usar o login da plataforma. Preencha o cadastro."
        );
        setStep("CADASTRO");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  /* ======== Ações ======== */
  async function handleCadastroSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const created = await apiPost<Idoso>("/api/eldercare/idosos", {
        nome,
        dataNascimento,
        sexo,
        email: email || null,
        telefone: telefone || null,
      });
      setIdosoId(created.id);
      setCatIndex(0);
      setStep("QUESTIONARIO");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Falha ao salvar cadastro.");
    } finally {
      setLoading(false);
    }
  }

  async function handleGerarPlano() {
    if (!idosoId) {
      setError("Idoso não cadastrado.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const respostas: Resposta[] = Object.entries(answers).map(
        ([pergunta, resposta]) => ({ pergunta, resposta })
      );
      const raw = await apiPost<any>("/api/eldercare/questionario/gerar", {
        idosoId,
        respostas,
      });
      setPlano(normalizePlanoResponse(raw));
      setStep("PLANO");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Erro ao gerar plano.");
    } finally {
      setLoading(false);
    }
  }

  const totalCats = CATEGORIES.length;
  const isFirst = catIndex === 0;
  const isLast = catIndex === totalCats - 1;
  const current = CATEGORIES[catIndex];
  const progressPct = Math.round(((catIndex) / (totalCats - 1)) * 100);

  const planoOrdenado = useMemo(() => {
    if (!plano) return null;
    const itens = (plano.itens ?? [])
      .map((d: PlanoDiaItem) => ({
        ...d,
        _diaPt: mapWeekdayPtBr(d.dia ?? d.day ?? d.diaSemana),
      }))
      .sort(
        (a: PlanoDiaItem, b: PlanoDiaItem) =>
          weekdaySortIndex(a._diaPt || "DIA") -
          weekdaySortIndex(b._diaPt || "DIA")
      );
    return { ...plano, itens };
  }, [plano]);

  const idade = calcIdade(dataNascimento);

  function handlePrint() {
    window.print();
  }
  function handleDownloadJson() {
    if (!plano) return;
    const data = plano._raw ?? plano;
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `plano-exercicios-${(nome || "idoso")
      .toLowerCase()
      .replace(/\s+/g, "-")}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  /* ============================
     Render
     ============================ */
  return (
    <div className="qc">
      <h2>Eldercare — Geração de Plano</h2>
      <p className="qc-breadcrumb">
        Fluxo: <b>Cadastro</b> → <b>Questionário (40)</b> → <b>Plano</b>
      </p>

      {USE_SSO && (
        <div className="qc-banner info">
          Modo SSO ativo: tentaremos usar seu login da plataforma automaticamente.
        </div>
      )}
      {error && <div className="qc-banner warn">{error}</div>}

      {/* CADASTRO */}
      {step === "CADASTRO" && (
        <form
          onSubmit={handleCadastroSubmit}
          className="qc-card"
          style={{ display: "grid", gap: 12 }}
        >
          <h3 style={{ marginTop: 0 }}>Cadastro rápido do idoso</h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 200px 200px",
              gap: 12,
            }}
          >
            <div className="qc-field">
              <div className="qc-label">Nome</div>
              <input
                required
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Ex.: Maria Souza"
              />
            </div>
            <div className="qc-field">
              <div className="qc-label">Data de nascimento</div>
              <input
                required
                type="date"
                value={dataNascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
              />
            </div>
            <div className="qc-field">
              <div className="qc-label">Sexo</div>
              <select
                value={sexo}
                onChange={(e) => setSexo(e.target.value as Sexo)}
              >
                <option value="MASCULINO">Masculino</option>
                <option value="FEMININO">Feminino</option>
                <option value="OUTRO">Outro</option>
              </select>
            </div>
          </div>

          <div
            style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}
          >
            <div className="qc-field">
              <div className="qc-label">E-mail</div>
              <input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@dominio.com"
              />
            </div>
            <div className="qc-field">
              <div className="qc-label">Telefone (opcional)</div>
              <input
                value={telefone}
                onChange={(e) => setTelefone(e.target.value)}
                placeholder="(62) 99999-0000"
              />
            </div>
          </div>

          <div className="qc-actions">
            <button className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Continuar para o Questionário"}
            </button>
          </div>
        </form>
      )}

      {/* QUESTIONÁRIO */}
      {step === "QUESTIONARIO" && (
        <div className="qc-card">
          <div className="wizard-head">
            <div className="qc-chip" aria-hidden>
              {current.emoji}
            </div>
            <h3 className="wizard-title">{current.title}</h3>
            <div className="wizard-step">
              {catIndex + 1} / {totalCats}
            </div>
          </div>
          <div className="wizard-progress">
            <div
              className="wizard-progress__bar"
              style={{ width: `${progressPct}%` }}
            />
          </div>

          <div className="qc-questions">
            {current.items.map((slug: string) => {
              const q = bySlug[slug];
              if (!q) return null;
              return (
                <div key={slug} className="qc-field">
                  <div className="qc-label">{q.label}</div>
                  <select
                    value={answers[q.slug]}
                    onChange={(e) => updateAnswer(q.slug, e.target.value)}
                  >
                    {q.options.map((opt: string) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>

          <div className="qc-actions">
            <button
              className="btn btn-ghost"
              onClick={() => {
                if (catIndex === 0) setStep("CADASTRO");
                else setCatIndex((i) => i - 1);
              }}
              disabled={loading}
            >
              {isFirst ? "Voltar ao cadastro" : "Voltar"}
            </button>

            {!isLast ? (
              <button
                className="btn btn-primary"
                onClick={() => setCatIndex((i) => i + 1)}
                disabled={loading}
              >
                Continuar
              </button>
            ) : (
              <button
                className="btn btn-primary"
                onClick={handleGerarPlano}
                disabled={loading}
              >
                {loading ? "Gerando..." : "Gerar Plano"}
              </button>
            )}
          </div>
        </div>
      )}

      {/* PLANO */}
      {step === "PLANO" && planoOrdenado && (
        <div className="qc-card">
          <div className="plan-head">
            <div>
              <h3 style={{ margin: 0 }}>Plano Gerado</h3>
              <div className="plan-sub">
                Resumo personalizado com base nas respostas do questionário.
              </div>
            </div>
            <div
              className={`level-badge ${nivelBadgeClass(
                planoOrdenado.nivel
              )}`}
            >
              {planoOrdenado.nivel}
            </div>
          </div>

          <div
            className="info-grid"
            style={{ gridTemplateColumns: "repeat(3, 1fr)" }}
          >
            <div className="info">
              <small>Nome</small>
              <b>{nome || "-"}</b>
            </div>
            <div className="info">
              <small>Idade</small>
              <b>{idade ?? "-"}{idade !== null ? " anos" : ""}</b>
            </div>
            <div className="info">
              <small>Sexo</small>
              <b>{sexo}</b>
            </div>
          </div>

          <div className="info-grid" style={{ marginTop: 12 }}>
            <div className="info">
              <small>Semanas</small>
              <b>{planoOrdenado.duracaoSemanas}</b>
            </div>
            <div className="info">
              <small>Dias/semana</small>
              <b>{planoOrdenado.diasPorSemana}</b>
            </div>
            <div className="info">
              <small>Min/dia</small>
              <b>{planoOrdenado.minutosPorDia}</b>
            </div>
            <div className="info">
              <small>Tempo semanal</small>
              <b>
                {planoOrdenado.diasPorSemana * planoOrdenado.minutosPorDia} min
              </b>
            </div>
          </div>

          <div style={{ marginTop: 16, display: "grid", gap: 12 }}>
            {planoOrdenado.itens.map((d: PlanoDiaItem, idx: number) => (
              <div key={idx} className="day-card">
                <div className="day-head">
                  <span className="day-dot">📘</span>
                  <b>{d._diaPt}</b>
                </div>
                {Array.isArray(d.atividades) && d.atividades.length > 0 ? (
                  <ul className="day-list">
                    {d.atividades.map((a: string, i: number) => (
                      <li key={i}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <div className="day-empty">Sem atividades para este dia.</div>
                )}
              </div>
            ))}
          </div>

          <div className="tips">
            <div className="tip-title">Observações gerais</div>
            <ul>
              <li>
                Inicie cada sessão com 5–10 minutos de aquecimento leve e
                finalize com alongamento.
              </li>
              <li>Mantenha hidratação e faça pausas quando necessário.</li>
              <li>
                Se sentir dor, tontura ou falta de ar anormal, interrompa e
                procure orientação profissional.
              </li>
            </ul>
          </div>

          <div className="qc-actions">
            <button
              className="btn btn-ghost"
              onClick={() => {
                setPlano(null);
                setStep("QUESTIONARIO");
              }}
            >
              Refazer respostas
            </button>
            <button
              className="btn btn-ghost"
              onClick={() => {
                setPlano(null);
                setIdosoId(null);
                setStep("CADASTRO");
              }}
            >
              Novo cadastro
            </button>

            <div className="actions-right">
              <button className="btn btn-ghost" onClick={handleDownloadJson}>
                Baixar JSON
              </button>
              <button className="btn btn-primary" onClick={handlePrint}>
                Imprimir / PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
