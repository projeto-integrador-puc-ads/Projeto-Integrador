import React, { useEffect, useRef, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  Button,
  Typography,
  Stack,
} from "@mui/material";

interface HorarioDTO {
  id: number;
  horario: string; 
  proximaExecucao?: string | null;
  tomadoHoje: boolean;
}

interface MedicamentoDTO {
  id: number;
  nome: string;
  tarja: string;
  contatarEmergencia: boolean;  // ✔ BACKEND envia
  horarios: HorarioDTO[];
}

interface Props {
  medicamentos?: MedicamentoDTO[];
}

export default function MedicationNotifier({ medicamentos = [] }: Props) {
  const [alerta, setAlerta] = useState<{
    id: number;
    tipo: "NORMAL" | "ATRASO";
    nome: string;
    horario: string;
  } | null>(null);

  const notificadas = useRef<Set<string>>(new Set());

  // -----------------------------
  // GERA HORÁRIO COMPLETO PARA HOJE
  // -----------------------------
  const gerarExecucaoHoje = (horario: string) => {
    const [h, m] = horario.split(":").map(Number);
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), now.getDate(), h, m, 0);
  };

  // -----------------------------
  // LOCAL STORAGE (1 vez por horário)
  // -----------------------------
  const marcarLido = (key: string) => {
    localStorage.setItem(key, "true");
  };

  const jaLido = (key: string) => {
    return localStorage.getItem(key) === "true";
  };

  // -----------------------------
  // LOOP PRINCIPAL
  // -----------------------------
  useEffect(() => {
    const verificar = () => {
      if (!medicamentos || medicamentos.length === 0) return;

      const agora = Date.now();

      medicamentos.forEach((med) => {
        med.horarios.forEach((h) => {
          const exec = gerarExecucaoHoje(h.horario);

          // IGNORA se já tomou
          if (h.tomadoHoje) return;

          // -----------------------------
          // ✔ POP-UP NORMAL (5 MINUTOS ANTES)
          // -----------------------------
          const diffNormal = Math.round((exec.getTime() - agora) / 60000);
          const keyNormal = `normal_${h.id}`;

          if (diffNormal <= 5 && diffNormal >= 0 && !jaLido(keyNormal)) {
            if (!notificadas.current.has(keyNormal)) {
              notificadas.current.add(keyNormal);
              setAlerta({
                id: h.id,
                tipo: "NORMAL",
                nome: med.nome,
                horario: h.horario,
              });
            }
          }

          // -----------------------------
          // ✔ POP-UP DE ATRASO (≥ 1 min)
          // só aparece se med.contatarEmergencia = true
          // -----------------------------
          if (med.contatarEmergencia) {
            const diffAtraso = Math.round((agora - exec.getTime()) / 60000);
            const keyAtraso = `atraso_${h.id}`;

            if (diffAtraso >= 1 && !jaLido(keyAtraso)) {
              if (!notificadas.current.has(keyAtraso)) {
                notificadas.current.add(keyAtraso);
                setAlerta({
                  id: h.id,
                  tipo: "ATRASO",
                  nome: med.nome,
                  horario: h.horario,
                });
              }
            }
          }
        });
      });
    };

    verificar(); // Executa ao carregar
    const interval = setInterval(verificar, 5000);

    return () => clearInterval(interval);
  }, [medicamentos]);

  // -----------------------------
  // FECHAR POPUP
  // -----------------------------
  const fechar = () => {
    if (alerta) {
      const key =
        alerta.tipo === "ATRASO"
          ? `atraso_${alerta.id}`
          : `normal_${alerta.id}`;
      marcarLido(key);
    }
    setAlerta(null);
  };

  // -----------------------------
  // RENDERIZAÇÃO
  // -----------------------------
  return (
    <Dialog open={!!alerta} onClose={fechar}>
      <DialogTitle sx={{ fontWeight: 700, fontSize: 20 }}>
        {alerta?.tipo === "ATRASO"
          ? "⚠️ Atenção — Você Está Atrasado!"
          : "⚠️ Atenção — Medicamento Próximo"}
      </DialogTitle>

      <DialogContent>
        {alerta && (
          <Stack spacing={2}>
            {alerta.tipo === "NORMAL" && (
              <>
                <Typography sx={{ fontSize: 18 }}>
                  Está quase na hora de tomar:
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
                  💊 {alerta.nome}
                </Typography>
                <Typography sx={{ fontSize: 16 }}>
                  Horário previsto: <strong>{alerta.horario}</strong>
                </Typography>
              </>
            )}

            {alerta.tipo === "ATRASO" && (
              <>
                <Typography sx={{ fontSize: 18, color: "red" }}>
                  Você está atrasado para tomar:
                </Typography>
                <Typography sx={{ fontWeight: "bold", fontSize: 20 }}>
                  💊 {alerta.nome}
                </Typography>
                <Typography sx={{ fontSize: 16 }}>
                  Horário previsto: <strong>{alerta.horario}</strong>
                </Typography>

                <Typography sx={{ fontSize: 16, mt: 2, color: "darkred" }}>
                  ⚠ Se continuar atrasado, o contato de emergência poderá ser acionado!
                </Typography>
              </>
            )}
          </Stack>
        )}
      </DialogContent>

      <Stack direction="row" justifyContent="flex-end" sx={{ p: 2 }}>
        <Button variant="contained" onClick={fechar}>
          Entendido
        </Button>
      </Stack>
    </Dialog>
  );
}
