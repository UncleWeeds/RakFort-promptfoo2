import React from 'react';
import {
  Paper,
  Typography,
  FormControl,
  FormControlLabel,
  Radio,
  RadioGroup,
  Alert,
} from '@mui/material';

interface SystemConfigurationProps {
  isStatefulValue: boolean;
  onStatefulChange: (val: boolean) => void;
  hasSessionParser: boolean;
}

export function SystemConfiguration({
  isStatefulValue,
  onStatefulChange,
  hasSessionParser,
}: SystemConfigurationProps) {
  return (
    <Paper elevation={1} sx={{ p: 3, mb: 3, backgroundColor: '#22103B', border: '1px solid #444', color: '#fff' }}>
      <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
        System Configuration
      </Typography>
      <FormControl component="fieldset">
        <Typography variant="body2" sx={{ color: '#fff', opacity: 0.8, mb: 2 }}>
          Is the target system Stateful? (Does it maintain conversation history?)
        </Typography>
        <RadioGroup
          value={String(isStatefulValue)}
          onChange={(e) => onStatefulChange(e.target.value === 'true')}
        >
          <FormControlLabel
            value="true"
            control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }} />}
            label={<span style={{ color: '#fff' }}>Yes - System is stateful, system maintains conversation history.</span>}
          />
          <FormControlLabel
            value="false"
            control={<Radio sx={{ color: '#fff', '&.Mui-checked': { color: '#A259F7' } }} />}
            label={<span style={{ color: '#fff' }}>No - System does not maintain conversation history</span>}
          />
        </RadioGroup>

        {!hasSessionParser && isStatefulValue && (
          <Alert severity="warning" sx={{ mt: 2, backgroundColor: '#2B1449', color: '#fff', border: '1px solid #FFD600' }}>
            Your system is stateful but you don't have session handling set up. Please return to
            your Target setup to configure it.
          </Alert>
        )}
      </FormControl>
    </Paper>
  );
}
