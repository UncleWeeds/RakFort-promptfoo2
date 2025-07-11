import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';

interface PromptDialogProps {
  open: boolean;
  prompt: string;
  index: number;
  onAdd: (prompt: string) => void;
  onCancel: () => void;
}

const PromptDialog: React.FC<PromptDialogProps> = ({ open, prompt, index, onAdd, onCancel }) => {
  const [editingPrompt, setEditingPrompt] = React.useState(prompt);
  const textFieldRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    setEditingPrompt(prompt);
  }, [prompt]);

  const handleAdd = (close: boolean) => {
    onAdd(editingPrompt);
    setEditingPrompt('');
    if (close) {
      onCancel();
    } else if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onCancel}
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
      <DialogTitle sx={{ color: 'white' }}>{`Edit Prompt ${index + 1}`}</DialogTitle>
      <DialogContent>
        <TextField
          value={editingPrompt}
          onChange={(e) => setEditingPrompt(e.target.value)}
          fullWidth
          margin="normal"
          multiline
          placeholder="The quick brown {{animal1}} jumps over the lazy {{animal2}}."
          helperText="Tip: use the {{varname}} syntax to add variables to your prompt."
          inputRef={textFieldRef}
          sx={{
            bgcolor: '#2B1449',
            color: 'white',
            borderRadius: 2,
            '& .MuiInputBase-input': {
              color: 'white',
            },
            '& .MuiInputLabel-root': {
              color: '#A259F7',
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#A259F7',
            },
          }}
          InputLabelProps={{ style: { color: '#A259F7' } }}
        />
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleAdd.bind(null, true)}
          variant="contained"
          sx={{
            backgroundColor: '#A259F7',
            color: 'white',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#8e44ec' },
          }}
          disabled={!editingPrompt.length}
        >
          Add
        </Button>
        <Button
          onClick={handleAdd.bind(null, false)}
          variant="contained"
          sx={{
            backgroundColor: '#A259F7',
            color: 'white',
            borderRadius: 2,
            fontWeight: 600,
            boxShadow: 'none',
            '&:hover': { backgroundColor: '#8e44ec' },
          }}
          disabled={!editingPrompt.length}
        >
          Add Another
        </Button>
        <Button onClick={onCancel} variant="outlined" sx={{ color: 'white', borderColor: '#A259F7', borderRadius: 2, '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' } }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default PromptDialog;
