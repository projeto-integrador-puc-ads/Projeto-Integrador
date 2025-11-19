import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Autocomplete,
  TextField
} from "@mui/material";
import { useState } from "react";

export default function SelectDialog({
  open,
  onClose,
  list,
  label,
  onConfirm
}) {
  const [selected, setSelected] = useState(null);

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>Selecione {label}</DialogTitle>

      <DialogContent>
        <Autocomplete
          options={list}
          getOptionLabel={(o) => o.nome}
          onChange={(e, value) => setSelected(value)}
          renderInput={(params) => (
            <TextField {...params} label={label} fullWidth />
          )}
        />
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button variant="contained" onClick={() => onConfirm(selected)}>
          Adicionar
        </Button>
      </DialogActions>
    </Dialog>
  );
}
