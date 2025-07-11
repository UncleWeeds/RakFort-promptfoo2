import React, { useState } from 'react';
import { useStore } from '@app/stores/evalConfig';
import SettingsIcon from '@mui/icons-material/Settings';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

const ConfigureEnvButton: React.FC = () => {
  const { env: defaultEnv, setEnv: saveEnv } = useStore();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [env, setEnv] = useState(defaultEnv);

  const handleOpen = () => {
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  const handleSave = () => {
    saveEnv(env);
    handleClose();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<SettingsIcon />}
        onClick={handleOpen}
        sx={{
          color: 'white',
          borderColor: '#A259F7',
          borderRadius: 2,
          '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' },
        }}
      >
        API keys
      </Button>
      <Dialog
        open={dialogOpen}
        onClose={handleClose}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            bgcolor: '#2B1449',
            color: 'white',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle sx={{ color: 'white' }}>Provider settings</DialogTitle>
        <DialogContent>
          {[['OpenAI', [
            ['OpenAI API key', 'OPENAI_API_KEY'],
            ['OpenAI API host', 'OPENAI_API_HOST'],
            ['OpenAI organization', 'OPENAI_ORGANIZATION'],
          ]],
            ['Azure', [['Azure API key', 'AZURE_API_KEY']]],
            ['Amazon Bedrock', [['Bedrock Region', 'AWS_BEDROCK_REGION']]],
            ['Anthropic', [['Anthropic API key', 'ANTHROPIC_API_KEY']]],
            ['Google Vertex AI', [
              ['Vertex API Key', 'VERTEX_API_KEY'],
              ['Vertex Project ID', 'VERTEX_PROJECT_ID'],
              ['Vertex Region', 'VERTEX_REGION'],
            ]],
            ['Replicate', [['Replicate API key', 'REPLICATE_API_KEY']]],
          ].map(([provider, fields], idx) => (
            <Accordion key={provider as string} defaultExpanded={idx === 0} sx={{ bgcolor: '#2B1449', color: 'white', borderRadius: 2, mb: 1, boxShadow: 'none', border: '1px solid #A259F7' }}>
              <AccordionSummary sx={{ color: '#A259F7', fontWeight: 600 }}>{provider}</AccordionSummary>
              {fields.map(([label, key]) => (
                <AccordionDetails key={key as string} sx={{ bgcolor: '#2B1449', color: 'white' }}>
                  <TextField
                    label={label as string}
                    fullWidth
                    margin="normal"
                    value={env[key as keyof typeof env] || ''}
                    onChange={(e) => setEnv({ ...env, [key]: e.target.value })}
                    sx={{
                      bgcolor: '#2B1449',
                      color: 'white',
                      borderRadius: 2,
                      '& .MuiInputBase-input': { color: 'white' },
                      '& .MuiInputLabel-root': { color: '#A259F7' },
                      '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' },
                    }}
                    InputLabelProps={{ style: { color: '#A259F7' } }}
                  />
                </AccordionDetails>
              ))}
            </Accordion>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined" sx={{ color: 'white', borderColor: '#A259F7', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' } }}>
            Cancel
          </Button>
          <Button onClick={handleSave} variant="contained" sx={{ backgroundColor: '#A259F7', color: 'white', borderRadius: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#8e44ec' } }}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ConfigureEnvButton;
