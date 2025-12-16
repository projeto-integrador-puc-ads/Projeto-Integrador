import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  FormControl,
  MenuItem,
  Select,
  Autocomplete,
} from "@mui/material";

import { useNavigate, useParams } from "react-router-dom";

import { medicamentoApi } from "../api/medicamentoApi";   // ✔ correto
import { anvisaApi } from "../api/anvisaApi";
import { getUsuarioId } from "../utils/session";

export default function EditarMedicamentoPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>(null);
  const [listaAnvisa, setListaAnvisa] = useState<any[]>([]);

  // Carrega lista ANVISA
  useEffect(() => {
    anvisaApi.listar()
      .then(setListaAnvisa)
      .catch(() => alert("Erro ao carregar lista ANVISA"));
  }, []);

  // Carrega medicamento
  useEffect(() => {
    medicamentoApi.buscarPorId(Number(id))   // ✔ singular
      .then((data) => {
        const horarios = data.horarios?.map((h: any) => h.horario) ?? [""];

        setForm({
          id: data.id,
          nome: data.medicamentoAnvisa?.nomeProduto ?? "",
          anvisaId: data.medicamentoAnvisa?.id,
          tipo: data.tipoDosagem === "ml" ? "liquido" : "comprimido",
          unidadePorDose: data.tipoDosagem === "mg" ? data.doseDiaria : 0,
          mlPorDose: data.tipoDosagem === "ml" ? data.doseDiaria : 0,
          quantidadeTotal: data.quantidadeCartela ?? data.totalFrasco ?? 0,
          vezesAoDia: horarios.length,
          horarios,
          tarja: data.tarja?.toLowerCase() ?? "sem_tarja",
          contatosEmergenciaIds: data.contatosEmergencia?.map((c: any) => c.id) ?? []
        });

        setLoading(false);
      })
      .catch(() => {
        alert("Erro ao carregar medicamento.");
        navigate("/medicamentos/lista");
      });
  }, [id]);

  // =============================
  //  MONTAR PAYLOAD IGUAL AO CADASTRO
  // =============================

  function montarPayload(usuarioId: number) {
    const horarios = (form.horarios || [])
      .map((h: string) => h.trim())
      .filter((h: string) => h)
      .map((h: string) => ({ horario: h }));

    return {
      usuarioId,
      doseDiaria: form.tipo === "liquido" ? form.mlPorDose : form.unidadePorDose,
      tipoDosagem: form.tipo === "liquido" ? "ml" : "mg",
      tarja: form.tarja.toUpperCase(),
      horarios,
      contatosEmergenciaIds: form.contatosEmergenciaIds ?? [],
      ...(form.tipo === "liquido"
        ? { totalFrasco: form.quantidadeTotal }
        : { quantidadeCartela: form.quantidadeTotal })
    };
  }

  async function atualizar() {
    try {
      const usuarioId = getUsuarioId();
      if (!usuarioId) {
        alert("Usuário não identificado.");
        return;
      }

      const payload = montarPayload(usuarioId);

      await medicamentoApi.atualizar(form.id, payload);  // ✔ correto

      alert("Medicamento atualizado com sucesso!");
      navigate("/medicamentos/lista");

    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar medicamento.");
    }
  }

  // =============================
  //  RENDERIZAÇÃO
  // =============================

  if (loading || !form) {
    return (
      <Typography sx={{ textAlign: "center", py: 5, fontSize: 20 }}>
        Carregando...
      </Typography>
    );
  }

  const medicamentoSelecionado =
    listaAnvisa.find((m) => m.id === form.anvisaId) ?? null;

  return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 4, px: 2 }}>
      <Card sx={{ width: "100%", maxWidth: 750, borderRadius: 2, boxShadow: 4 }}>
        <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
          <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 2 }}>
            Editar Medicamento
          </Typography>

          <Stack spacing={3}>

            {/* ANVISA */}
            <Autocomplete
              options={listaAnvisa}
              value={medicamentoSelecionado}
              getOptionLabel={(opt: any) => opt.nomeProduto}
              onChange={(_, selected) => {
                if (selected) {
                  setForm((prev: any) => ({
                    ...prev,
                    nome: selected.nomeProduto,
                    anvisaId: selected.id
                  }));
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Medicamento (ANVISA)" fullWidth />
              )}
            />

            {/* TARJA */}
            <FormControl fullWidth>
              <Select
                value={form.tarja}
                onChange={(e) =>
                  setForm((prev: any) => ({ ...prev, tarja: e.target.value }))
                }
              >
                <MenuItem value="sem_tarja">Comum</MenuItem>
                <MenuItem value="amarela">Amarela</MenuItem>
                <MenuItem value="vermelha">Vermelha</MenuItem>
                <MenuItem value="preta">Preta</MenuItem>
              </Select>
            </FormControl>

            <Divider />

            <Typography sx={{ fontSize: 18, fontWeight: 600 }}>
              Horários
            </Typography>

            {form.horarios.map((h: string, idx: number) => (
              <TextField
                key={idx}
                type="time"
                value={h}
                onChange={(e) => {
                  const arr = [...form.horarios];
                  arr[idx] = e.target.value;
                  setForm((prev: any) => ({ ...prev, horarios: arr }));
                }}
                fullWidth
              />
            ))}

            <Divider />

            {/* BOTÕES */}
            <Stack direction="row" justifyContent="space-between">
              <Button variant="outlined" onClick={() => navigate("/medicamentos/lista")}>
                Cancelar
              </Button>

              <Button variant="contained" onClick={atualizar}>
                Salvar alterações
              </Button>
            </Stack>
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
