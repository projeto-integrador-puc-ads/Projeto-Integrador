import { Button } from "@mui/material";
import React from "react";

type RoundedButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: "text" | "outlined" | "contained";
  color?: "inherit" | "primary" | "secondary" | "success" | "error" | "info" | "warning";
  fullWidth?: boolean;
  sx?: any;
};

const RoundedButton: React.FC<RoundedButtonProps> = ({
  children,
  onClick,
  variant = "contained",
  color = "primary",
  fullWidth = false,
  sx = {},
}) => {
  return (
    <Button
      variant={variant}
      color={color}
      onClick={onClick}
      fullWidth={fullWidth}
      sx={{ borderRadius: 8, py: 1.5, ...sx }}
    >
      {children}
    </Button>
  );
};

export default RoundedButton;
