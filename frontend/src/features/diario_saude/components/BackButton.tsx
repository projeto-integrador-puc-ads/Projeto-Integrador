import { Button } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useNavigate } from "react-router-dom";

export default function BackButton({ to = -1 }) {
  const navigate = useNavigate();
  return (
    <Button
      startIcon={<ArrowBackIcon />}
      onClick={() => navigate(to)}
      sx={{ mb: 2 }}
    >
      Voltar
    </Button>
  );
}
