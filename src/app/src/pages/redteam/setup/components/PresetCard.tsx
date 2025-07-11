import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha } from '@mui/material/styles';

interface PresetCardProps {
  name: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
}

export default function PresetCard({ name, description, isSelected, onClick }: PresetCardProps) {
  return (
    <Paper
      elevation={2}
      onClick={onClick}
      sx={{
        p: 2.5,
        height: '100%',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        position: 'relative',
        overflow: 'hidden',
        transition: 'all 0.2s ease-in-out',
        border: isSelected ? '1px solid #A259F7' : '1px solid #444',
        backgroundColor: '#22103B',
        color: '#fff',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: '0 6px 20px rgba(0,0,0,0.09)',
          backgroundColor: '#2B1449',
          '& .MuiTypography-root': {
            color: '#A259F7',
          },
        },
      }}
    >
      <Typography
        variant="h6"
        sx={{
          fontWeight: 500,
          color: isSelected ? '#A259F7' : '#fff',
          transition: 'color 0.2s ease-in-out',
          mb: 1.5,
        }}
      >
        {name}
      </Typography>
      <Typography
        variant="body2"
        sx={{
          opacity: 0.8,
          lineHeight: 1.5,
          color: '#fff',
        }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
