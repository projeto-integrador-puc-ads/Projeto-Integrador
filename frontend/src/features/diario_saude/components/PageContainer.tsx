import { Container, Paper } from "@mui/material";

export default function PageContainer({ children }) {
  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
        {children}
      </Paper>
    </Container>
  );
}
