import React, { useMemo, useState } from "react";
import { Box, Button, FormControl, MenuItem, Select, IconButton, Typography, Stack } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ContatoDialog from "./ContatoDialog";
import { useContatos } from "../hooks/useContatos";
import type { ContatoPayload } from "../types/contato";

interface Props {
  value?: number | null;
  onChange: (id?: number) => void;
}

export default function ContatoSelector({ value, onChange }: Props) {
  const { contatos, loading, create, update, remove } = useContatos();
  const [openDialog, setOpenDialog] = useState(false);
  const [editing, setEditing] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);

  const selected = useMemo(() => contatos.find((c) => c.id === value), [contatos, value]);

  const handleOpenCreate = () => {
    setEditing(null);
    setOpenDialog(true);
  };

  const handleOpenEdit = () => {
    if (!selected) return;
    setEditing(selected.id);
    setOpenDialog(true);
  };

  const handleSave = async (payload: ContatoPayload) => {
    setSaving(true);
    try {
      if (editing != null) {
        await update(editing, payload);
        onChange(editing);
      } else {
        const created = await create(payload);
        onChange(created.id);
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!selected) return;
    if (!confirm("Deseja realmente excluir esse contato de emergência?")) return;
    await remove(selected.id);
    onChange(undefined);
  };

  return (
    <Box>
      <Stack direction="row" spacing={2} alignItems="center">
        <FormControl fullWidth size="small">
          <Select
            displayEmpty
            value={value ?? ""}
            onChange={(e) => {
              const v = e.target.value;
              if (v === "") onChange(undefined);
              else if (v === "new") handleOpenCreate();
              else onChange(Number(v));
            }}
          >
            <MenuItem value=""><em>Não vincular</em></MenuItem>
            {contatos.map((c) => (
              <MenuItem key={c.id} value={c.id}>{c.nome} — {c.telefone} ({c.relacao ?? "—"})</MenuItem>
            ))}
            <MenuItem value="new">➕ Cadastrar novo contato</MenuItem>
          </Select>
        </FormControl>

        {value ? (
          <>
            <IconButton onClick={handleOpenEdit}><EditIcon/></IconButton>
            <IconButton onClick={handleDelete}><DeleteIcon/></IconButton>
          </>
        ) : (
          <Button variant="outlined" onClick={handleOpenCreate}>Cadastrar</Button>
        )}
      </Stack>

      <ContatoDialog
        open={openDialog}
        initial={editing ? contatos.find((c) => c.id === editing) : undefined}
        onClose={() => setOpenDialog(false)}
        onSave={handleSave}
        saving={saving}
      />
    </Box>
  );
}
