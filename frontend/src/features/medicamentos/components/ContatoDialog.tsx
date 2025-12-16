import React, { useEffect, useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, Stack, TextField } from "@mui/material";
import type { Contato, ContatoPayload } from "../types/contato";

interface Props {
  open: boolean;
  initial?: Partial<Contato>;
  onClose: () => void;
  onSave: (payload: ContatoPayload) => Promise<void> | void;
  saving?: boolean;
}

export default function ContatoDialog({ open, initial, onClose, onSave, saving }: Props) {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [relacao, setRelacao] = useState("");

  useEffect(() => {
    setNome(initial?.nome ?? "");
    setTelefone(initial?.telefone ?? "");
    setRelacao(initial?.relacao ?? "");
  }, [initial, open]);

  const canSave = nome.trim() !== "" && telefone.trim() !== "";

  const handleSave = async () => {
    if (!canSave) return;
    await onSave({ nome: nome.trim(), telefone: telefone.trim(), relacao: relacao.trim() || undefined });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontSize: 18 }}>{initial?.id ? "Editar contato de emergência" : "Cadastrar contato de emergência"}</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          <TextField label="Nome" value={nome} onChange={(e) => setNome(e.target.value)} fullWidth size="small" />
          <TextField label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} fullWidth size="small" />
          <TextField label="Relação (ex.: Filho)" value={relacao} onChange={(e) => setRelacao(e.target.value)} fullWidth size="small" />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} variant="outlined">Cancelar</Button>
        <Button onClick={handleSave} variant="contained" disabled={!canSave || !!saving}>Salvar</Button>
      </DialogActions>
    </Dialog>
  );
}
