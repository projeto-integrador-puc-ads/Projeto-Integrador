import { Container, Paper, Typography } from "@mui/material";
import { ModuleGridSaude } from "../components/ModuleGridPaciente";

export default function SaudeMenuPage() {
  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h4" mb={3}>
          Consultas & Saúde
        </Typography>

        <ModuleGridSaude />
      </Paper>
    </Container>
  );
}
