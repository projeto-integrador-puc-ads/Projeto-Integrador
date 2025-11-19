import { ListItem, ListItemText, Box } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

export default function ListItemCard({ title, onDelete }) {
  return (
    <ListItem
      sx={{
        bgcolor: "#f5f5f5",
        borderRadius: 2,
        mb: 1,
        px: 2,
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      <ListItemText primary={title} />
      <Box sx={{ width: "100%", textAlign: "right", mt: 1 }}>
        <DeleteIcon
          onClick={onDelete}
          style={{ color: "#d32f2f", cursor: "pointer" }}
          fontSize="medium"
        />
      </Box>
    </ListItem>
  );
}
