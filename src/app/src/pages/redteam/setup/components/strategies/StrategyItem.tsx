import React from 'react';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import { Paper, Box, Typography, Chip, Checkbox, IconButton } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { DEFAULT_STRATEGIES, AGENTIC_STRATEGIES } from '@promptfoo/redteam/constants';
import type { StrategyCardData } from './types';

const CONFIGURABLE_STRATEGIES = [
  'multilingual',
  'best-of-n',
  'goat',
  'crescendo',
  'pandamonium',
  'jailbreak',
  'jailbreak:tree',
  'tool-discovery:multi-turn',
  'gcg',
  'citation',
] as const;

interface StrategyItemProps {
  strategy: StrategyCardData;
  isSelected: boolean;
  onToggle: (id: string) => void;
  onConfigClick: (id: string) => void;
}

export function StrategyItem({ strategy, isSelected, onToggle, onConfigClick }: StrategyItemProps) {
  return (
    <Paper
      elevation={2}
      onClick={() => onToggle(strategy.id)}
      sx={{
        height: '100%',
        display: 'flex',
        cursor: 'pointer',
        userSelect: 'none',
        border: isSelected ? '1.5px solid #A259F7' : '1px solid #444',
        backgroundColor: isSelected ? '#2B1449' : '#22103B',
        color: '#fff',
        transition: 'all 0.2s ease-in-out',
        '&:hover': {
          backgroundColor: isSelected ? '#2B1449' : '#2B1449',
        },
      }}
    >
      {/* Checkbox container */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          pl: 1,
        }}
      >
        <Checkbox
          checked={isSelected}
          onChange={(e) => {
            e.stopPropagation();
            onToggle(strategy.id);
          }}
          onClick={(e) => e.stopPropagation()}
          sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }}
        />
      </Box>

      {/* Content container */}
      <Box sx={{ flex: 1, p: 2, minWidth: 0, position: 'relative' }}>
        {/* Settings button - positioned absolutely in the top-right corner */}
        {isSelected && CONFIGURABLE_STRATEGIES.includes(strategy.id as any) && (
          <IconButton
            size="small"
            onClick={(e) => {
              e.stopPropagation();
              onConfigClick(strategy.id);
            }}
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              opacity: 0.6,
              color: '#fff',
              '&:hover': {
                opacity: 1,
                backgroundColor: '#A259F7',
              },
            }}
          >
            <SettingsOutlinedIcon fontSize="small" />
          </IconButton>
        )}

        {/* Title and badges section */}
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 1 }}>
          <Typography variant="subtitle1" component="div" sx={{ color: '#fff' }}>
            {strategy.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
            {DEFAULT_STRATEGIES.includes(strategy.id as any) && (
              <Chip label="Recommended" size="small" sx={{ backgroundColor: '#A259F7', color: '#fff', fontWeight: 600 }} />
            )}
            {AGENTIC_STRATEGIES.includes(strategy.id as any) && (
              <Chip
                label="Agent"
                size="small"
                sx={{
                  backgroundColor: '#FFD60022',
                  color: '#FFD600',
                  borderColor: '#FFD600',
                  border: 1,
                  fontWeight: 600,
                }}
              />
            )}
            {strategy.id === 'pandamonium' && (
              <Chip
                label="Experimental"
                size="small"
                sx={{
                  backgroundColor: '#FF174422',
                  color: '#FF1744',
                  borderColor: '#FF1744',
                  border: 1,
                  fontWeight: 600,
                }}
              />
            )}
          </Box>
        </Box>

        {/* Description section */}
        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }}>
          {strategy.description}
        </Typography>
      </Box>
    </Paper>
  );
}
