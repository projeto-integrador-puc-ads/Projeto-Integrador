import { TextField } from "@mui/material";

export default function RoundedTextField(props) {
  return (
    <TextField
      {...props}
      fullWidth
      InputProps={{
        sx: { borderRadius: 30, minHeight: 55 },
      }}
    />
  );
}
