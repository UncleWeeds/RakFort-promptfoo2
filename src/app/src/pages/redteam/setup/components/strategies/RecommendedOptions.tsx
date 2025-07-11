import React from 'react';
import {
  Paper,
  Box,
  Typography,
  Checkbox,
  FormControlLabel,
  Radio,
  RadioGroup,
} from '@mui/material';
import { STRATEGY_PRESETS, PRESET_IDS } from './types';

interface RecommendedOptionsProps {
  isMultiTurnEnabled: boolean;
  isStatefulValue: boolean;
  onMultiTurnChange: (checked: boolean) => void;
  onStatefulChange: (isStateful: boolean) => void;
}

export function RecommendedOptions({
  isMultiTurnEnabled,
  isStatefulValue,
  onMultiTurnChange,
  onStatefulChange,
}: RecommendedOptionsProps) {
  const mediumPreset = STRATEGY_PRESETS[PRESET_IDS.MEDIUM];
  if (!mediumPreset?.options?.multiTurn) {
    return null;
  }

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#22103B', border: '1px solid #444', color: '#fff' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        Recommended Options
      </Typography>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        <FormControlLabel
          control={
            <Checkbox
              checked={isMultiTurnEnabled}
              onChange={(e) => onMultiTurnChange(e.target.checked)}
              sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }}
            />
          }
          label={<span style={{ color: '#fff' }}>{mediumPreset.options.multiTurn.label}</span>}
        />

        {isMultiTurnEnabled && (
          <Box sx={{ pl: 4 }}>
            <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8 }} gutterBottom>
              Does your system maintain conversation state?
            </Typography>
            <RadioGroup
              value={String(isStatefulValue)}
              onChange={(e) => onStatefulChange(e.target.value === 'true')}
              row
            >
              <FormControlLabel
                value="true"
                control={<Radio size="small" sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }} />}
                label={<span style={{ color: '#fff' }}>Yes - my system is stateful and maintains conversation history</span>}
              />
              <FormControlLabel
                value="false"
                control={<Radio size="small" sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }} />}
                label={<span style={{ color: '#fff' }}>No - my system is not stateful, the full conversation history must be sent on every request</span>}
              />
            </RadioGroup>
          </Box>
        )}
      </Box>
    </Paper>
  );
}
