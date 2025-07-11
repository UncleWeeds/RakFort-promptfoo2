import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { ProviderOptions } from '@promptfoo/types';
import { isJavascriptFile } from '@promptfoo/util/file';

interface AddLocalProviderDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (provider: ProviderOptions) => void;
}

const AddLocalProviderDialog: React.FC<AddLocalProviderDialogProps> = ({
  open,
  onClose,
  onAdd,
}) => {
  const [path, setPath] = React.useState('');
  const [error, setError] = React.useState('');

  const handleSubmit = () => {
    const trimmedPath = path.trim();

    if (!trimmedPath) {
      setError('Path is required');
      return;
    }

    if (
      !isJavascriptFile(trimmedPath) &&
      !trimmedPath.endsWith('.py') &&
      !trimmedPath.endsWith('.go')
    ) {
      setError('Only javascript, python, and go files are supported');
      return;
    }

    const provider: ProviderOptions = {
      id: `file://${trimmedPath}`,
      config: {},
      label: trimmedPath.split('/').pop() || trimmedPath,
    };

    onAdd(provider);
    onClose();
    setPath('');
    setError('');
  };

  const handleClose = () => {
    setPath('');
    setError('');
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="md"
      fullWidth
      PaperProps={{ sx: { bgcolor: '#2B1449', color: 'white', borderRadius: 2 } }}
    >
      <DialogTitle sx={{ pb: 1, color: 'white' }}>Add Local Provider</DialogTitle>
      <DialogContent sx={{ pb: 2 }}>
        <Typography variant="body2" sx={{ mb: 3, color: 'white' }}>
          Enter the absolute path to your local provider implementation (.py or .js file). This file
          will be referenced in your promptfoo configuration.
        </Typography>
        <TextField
          fullWidth
          placeholder="/absolute/path/to/your/provider.py"
          value={path}
          onChange={(e) => {
            setPath(e.target.value);
            setError('');
          }}
          error={!!error}
          helperText={error || 'Example: /home/user/projects/my-provider.py'}
          size="medium"
          sx={{
            bgcolor: '#2B1449',
            color: 'white',
            borderRadius: 2,
            '& .MuiInputBase-input': { color: 'white' },
            '& .MuiInputLabel-root': { color: '#A259F7' },
            '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' },
            '& .MuiOutlinedInput-root': { height: '56px' },
          }}
          InputLabelProps={{ style: { color: '#A259F7' } }}
        />
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={handleClose} variant="outlined" sx={{ color: 'white', borderColor: '#A259F7', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' } }}>
          Cancel
        </Button>
        <Button onClick={handleSubmit} variant="contained" sx={{ px: 3, backgroundColor: '#A259F7', color: 'white', borderRadius: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#8e44ec' } }}>
          Add Provider
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddLocalProviderDialog;
