import { Typography } from "@mui/material";

export default function PageTitle({ children }) {
  return (
    <Typography variant="h5" fontWeight="bold" mb={3}>
      {children}
    </Typography>
  );
}
