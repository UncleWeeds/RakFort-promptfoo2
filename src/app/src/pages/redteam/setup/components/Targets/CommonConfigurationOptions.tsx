import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { ProviderOptions } from '@promptfoo/types';
import ExtensionEditor from './ExtensionEditor';
import 'prismjs/themes/prism.css';

interface CommonConfigurationOptionsProps {
  selectedTarget: ProviderOptions;
  updateCustomTarget: (field: string, value: any) => void;
  onValidationChange?: (hasErrors: boolean) => void;
  extensions?: string[];
  onExtensionsChange?: (extensions: string[]) => void;
}

const CommonConfigurationOptions: React.FC<CommonConfigurationOptionsProps> = ({
  selectedTarget,
  updateCustomTarget,
  onValidationChange,
  extensions = [],
  onExtensionsChange,
}) => {
  const handleExtensionsChange = React.useCallback(
    (newExtensions: string[]) => {
      onExtensionsChange?.(newExtensions);
    },
    [onExtensionsChange],
  );

  return (
    <Box>
      <Accordion defaultExpanded={!!selectedTarget.delay} sx={{ backgroundColor: '#2B1449' }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#2B1449' }}>
          <Box>
            <Typography variant="h6" sx={{ color: '#fff' }}>Delay</Typography>
            <Typography variant="body2" sx={{ color: '#fff' }}>
              Configure the delay between requests
            </Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails sx={{ backgroundColor: '#2B1449' }}>
          <Typography variant="body1" sx={{ mb: 2, color: '#fff' }}>
            Add a delay (ms) between requests to simulate a real user. See{' '}
            <a href="https://www.promptfoo.dev/docs/providers/http/#delay" target="_blank" style={{ color: '#A259F7', textDecoration: 'underline' }}>
              docs
            </a>{' '}
            for more details.
          </Typography>
          <Box>
            <TextField
              value={selectedTarget.delay ?? ''}
              onChange={(e) => updateCustomTarget('delay', Number(e.target.value))}
              InputLabelProps={{ style: { color: '#fff' } }}
              inputProps={{ style: { color: '#fff' } }}
              slotProps={{ input: { sx: { backgroundColor: '#22103B' } } }}
            />
            <br />
            <Typography variant="caption" sx={{ color: '#fff' }}>Delay in milliseconds (default: 0)</Typography>
          </Box>
        </AccordionDetails>
      </Accordion>

      <ExtensionEditor
        extensions={extensions}
        onExtensionsChange={handleExtensionsChange}
        onValidationChange={onValidationChange}
      />
    </Box>
  );
};

export default CommonConfigurationOptions;
