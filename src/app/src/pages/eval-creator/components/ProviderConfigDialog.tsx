import React, { useEffect, useState } from 'react';
import JsonTextField from '@app/components/JsonTextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

interface ProviderConfigDialogProps {
  open: boolean;
  providerId: string;
  config?: Record<string, any>;
  onClose: () => void;
  onSave: (providerId: string, config: Record<string, any>) => void;
}

const ProviderConfigDialog: React.FC<ProviderConfigDialogProps> = ({
  open,
  providerId,
  config = {},
  onClose,
  onSave,
}) => {
  const [localConfig, setLocalConfig] = useState<Record<string, any>>(config);
  const isAzureProvider = providerId.startsWith('azure:');

  // Helper function to check if a value has content
  const hasContent = (val: any): boolean => {
    return val !== undefined && val !== null && val !== '';
  };

  const isDeploymentIdValid = !isAzureProvider || hasContent(localConfig.deployment_id);

  // Reset local config when the dialog opens or providerId changes
  useEffect(() => {
    setLocalConfig(config);
  }, [open, providerId, config]);

  const handleSave = () => {
    onSave(providerId, localConfig);
  };

  // Create an ordered list of keys with deployment_id first for Azure providers
  const configKeys = React.useMemo(() => {
    const keys = Object.keys(localConfig);
    if (isAzureProvider) {
      return ['deployment_id', ...keys.filter((key) => key !== 'deployment_id')];
    }
    return keys;
  }, [localConfig, isAzureProvider]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
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
      <DialogTitle sx={{ color: 'white' }}>
        Provider Configuration
        <Typography
          variant="subtitle1"
          sx={{ mt: 1, fontSize: '0.9rem', fontFamily: 'monospace', color: '#A259F7' }}
        >
          {providerId}
        </Typography>
      </DialogTitle>
      <DialogContent>
        {isAzureProvider && (
          <Box mb={2}>
            <Alert severity={isDeploymentIdValid ? 'info' : 'warning'} sx={{ bgcolor: '#2B1449', color: 'white', border: '1px solid #A259F7' }}>
              {isDeploymentIdValid
                ? 'Azure OpenAI requires a deployment ID that matches your deployment name in the Azure portal.'
                : 'You must specify a deployment ID for Azure OpenAI models. This is the name you gave your model deployment in the Azure portal.'}
            </Alert>
          </Box>
        )}
        {configKeys.map((key) => {
          const value = localConfig[key];
          let handleChange;
          const isDeploymentId = isAzureProvider && key === 'deployment_id';
          const isRequired = isDeploymentId;
          const isValid = !isRequired || hasContent(value);

          if (
            typeof value === 'number' ||
            typeof value === 'boolean' ||
            typeof value === 'string'
          ) {
            if (typeof value === 'number') {
              handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalConfig({ ...localConfig, [key]: Number.parseFloat(e.target.value) });
            } else if (typeof value === 'boolean') {
              handleChange = (e: React.ChangeEvent<HTMLInputElement>) =>
                setLocalConfig({ ...localConfig, [key]: e.target.value === 'true' });
            } else {
              handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
                const trimmed = e.target.value.trim();
                if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
                  try {
                    setLocalConfig({ ...localConfig, [key]: JSON.parse(trimmed) });
                  } catch {
                    setLocalConfig({ ...localConfig, [key]: trimmed });
                  }
                } else if (trimmed === 'null') {
                  setLocalConfig({ ...localConfig, [key]: null });
                } else if (trimmed === 'undefined') {
                  setLocalConfig({ ...localConfig, [key]: undefined });
                } else {
                  setLocalConfig({ ...localConfig, [key]: trimmed });
                }
              };
            }
            return (
              <Box key={key} my={2}>
                <TextField
                  label={isRequired ? `${key} (Required)` : key}
                  value={value === undefined ? '' : value}
                  onChange={handleChange}
                  fullWidth
                  required={isRequired}
                  error={isRequired && !isValid}
                  helperText={
                    isRequired && !isValid ? 'This field is required for Azure OpenAI' : ''
                  }
                  InputLabelProps={{ shrink: true, style: { color: '#A259F7' } }}
                  type={typeof value === 'number' ? 'number' : 'text'}
                  variant={isRequired ? 'outlined' : undefined}
                  color={isRequired ? 'primary' : undefined}
                  focused={isRequired && !isValid}
                  sx={{
                    bgcolor: '#2B1449',
                    color: 'white',
                    borderRadius: 2,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#A259F7' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' },
                  }}
                />
              </Box>
            );
          } else {
            return (
              <Box key={key} my={2}>
                <JsonTextField
                  label={key}
                  defaultValue={JSON.stringify(value)}
                  onChange={(parsed) => {
                    setLocalConfig({ ...localConfig, [key]: parsed });
                  }}
                  fullWidth
                  multiline
                  minRows={2}
                  InputLabelProps={{ shrink: true, style: { color: '#A259F7' } }}
                  sx={{
                    bgcolor: '#2B1449',
                    color: 'white',
                    borderRadius: 2,
                    '& .MuiInputBase-input': { color: 'white' },
                    '& .MuiInputLabel-root': { color: '#A259F7' },
                    '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' },
                  }}
                />
              </Box>
            );
          }
        })}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="outlined" sx={{ color: 'white', borderColor: '#A259F7', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' } }}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={!isDeploymentIdValid} variant="contained" sx={{ backgroundColor: '#A259F7', color: 'white', borderRadius: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#8e44ec' } }}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ProviderConfigDialog;
