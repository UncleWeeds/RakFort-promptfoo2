// components/ActionButton.tsx
import React from "react";
import { Button, SxProps, Theme } from "@mui/material";

interface ActionButtonProps {
  children: React.ReactNode;
  icon: React.ReactNode;
  color: string;
  sx?: SxProps<Theme>;
  onClick?: () => void;
}

const ActionButton: React.FC<ActionButtonProps> = ({ children, icon, color, sx, onClick }) => {
  return (
    <Button
      variant="contained"
      startIcon={icon}
      onClick={onClick}
      sx={{
        bgcolor: color,
        color: "white",
        border:0.1,
        borderColor:'white',
        borderRadius: "16px",
        px: 3,
        py: 1.5,
        textTransform: "none",
        boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
        "&:hover": {
          bgcolor: color === "#3B82F6" ? "#2563EB" : "#4B5563",
        },
        ...sx,
      }}
    >
      {children}
    </Button>
  );
};

export default ActionButton;
