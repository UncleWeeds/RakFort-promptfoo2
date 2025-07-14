import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box } from '@mui/material';
import EvalsDataGrid from './components/EvalsDataGrid';

export default function EvalsIndexPage() {
  const navigate = useNavigate();
  useEffect(() => {
    document.title = 'Evals | promptfoo';
  }, []);

  return (
    <Box
      sx={{
        bgcolor: '#22103B',
        color: 'white',
        width: '100%',
        height: '100%',
        zIndex: 1,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <EvalsDataGrid onEvalSelected={(evalId) => navigate(`/eval/${evalId}`)} showUtilityButtons />
    </Box>
  );
}
