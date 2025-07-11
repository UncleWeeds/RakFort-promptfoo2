import React, { useState, useRef, useEffect } from 'react';
import { useStore } from '@app/stores/evalConfig';
import Copy from '@mui/icons-material/ContentCopy';
import Delete from '@mui/icons-material/Delete';
import Edit from '@mui/icons-material/Edit';
import Publish from '@mui/icons-material/Publish';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import PromptDialog from './PromptDialog';
import './PromptsSection.css';

const PromptsSection: React.FC = () => {
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);
  const [editingPromptIndex, setEditingPromptIndex] = useState<number | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promptToDelete, setPromptToDelete] = useState<number | null>(null);

  const { prompts, setPrompts } = useStore();
  const newPromptInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingPromptIndex !== null && editingPromptIndex > 0 && newPromptInputRef.current) {
      newPromptInputRef.current.focus();
    }
  }, [editingPromptIndex]);

  const handleEditPrompt = (index: number) => {
    setEditingPromptIndex(index);
    setPromptDialogOpen(true);
  };

  const handleAddPromptFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result?.toString();
        if (text) {
          setPrompts([...prompts, text]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleDuplicatePrompt = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const duplicatedPrompt = prompts[index];
    setPrompts([...prompts, duplicatedPrompt]);
  };

  const handleChangePrompt = (index: number, newPrompt: string) => {
    setPrompts(prompts.map((p, i) => (i === index ? newPrompt : p)));
  };

  const handleRemovePrompt = (event: React.MouseEvent, indexToRemove: number) => {
    event.stopPropagation();
    setPromptToDelete(indexToRemove);
    setDeleteDialogOpen(true);
  };

  const confirmDeletePrompt = () => {
    if (promptToDelete !== null) {
      setPrompts(prompts.filter((_, index) => index !== promptToDelete));
      setPromptToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const cancelDeletePrompt = () => {
    setPromptToDelete(null);
    setDeleteDialogOpen(false);
  };

  return (
    <div>
      <Stack direction="row" spacing={2} mb={2} justifyContent="space-between">
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>Prompts</Typography>
        <div>
          <label htmlFor={`file-input-add-prompt`}>
            <Tooltip title="Upload prompt from file">
              <span>
                <IconButton component="span" sx={{ color: '#A259F7' }}>
                  <Publish />
                </IconButton>
                <input
                  id={`file-input-add-prompt`}
                  type="file"
                  accept=".txt,.md"
                  onChange={handleAddPromptFromFile}
                  style={{ display: 'none' }}
                />
              </span>
            </Tooltip>
          </label>
          {prompts.length === 0 && (
            <Button
              variant="outlined"
              onClick={() => {
                const examplePrompt =
                  'Write a short, fun story about a {{animal}} going on an adventure in {{location}}. Make it entertaining and suitable for children.';
                setPrompts([...prompts, examplePrompt]);
              }}
              sx={{
                mr: 1,
                color: 'white',
                borderColor: '#A259F7',
                borderRadius: 2,
                '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' },
              }}
            >
              Add Example
            </Button>
          )}
          <Button
            variant="contained"
            onClick={() => {
              setPromptDialogOpen(true);
            }}
            sx={{
              backgroundColor: '#A259F7',
              color: 'white',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8e44ec' },
            }}
          >
            Add Prompt
          </Button>
        </div>
      </Stack>
      <TableContainer sx={{ bgcolor: '#2B1449', borderRadius: 2 }}>
        <Table>
          <TableBody>
            {prompts.length === 0 ? (
              <TableRow sx={{ bgcolor: '#2B1449' }}>
                <TableCell colSpan={2} align="center" sx={{ color: 'white' }}>
                  No prompts added yet.
                </TableCell>
              </TableRow>
            ) : (
              prompts.map((prompt, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: '#2B1449',
                    '&:hover': {
                      backgroundColor: '#3A2060',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => handleEditPrompt(index)}
                >
                  <TableCell sx={{ color: 'white' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {`Prompt #${index + 1}: `}
                      {(prompt.length > 250 ? prompt.slice(0, 250) + ' ...' : prompt)
                        .split(/({{\w+}})/g)
                        .map((part: string, i: number) =>
                          /{{\s*(\w+)\s*}}/g.test(part) ? (
                            <span key={i} className="prompt-var-highlight" style={{ color: '#A259F7' }}>
                              {part}
                            </span>
                          ) : (
                            part
                          ),
                        )}
                    </Typography>
                  </TableCell>
                  <TableCell align="right" sx={{ minWidth: 150, color: 'white' }}>
                    <IconButton onClick={() => handleEditPrompt(index)} size="small" sx={{ color: '#A259F7' }}>
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleDuplicatePrompt(event, index)}
                      size="small"
                      sx={{ color: '#A259F7' }}
                    >
                      <Copy />
                    </IconButton>
                    <IconButton onClick={(event) => handleRemovePrompt(event, index)} size="small" sx={{ color: '#A259F7' }}>
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <PromptDialog
        open={promptDialogOpen}
        prompt={editingPromptIndex === null ? '' : prompts[editingPromptIndex]}
        index={editingPromptIndex === null ? 0 : editingPromptIndex}
        onAdd={(newPrompt) => {
          if (editingPromptIndex === null) {
            setPrompts([...prompts, newPrompt]);
          } else {
            handleChangePrompt(editingPromptIndex, newPrompt);
          }
          setEditingPromptIndex(null);
        }}
        onCancel={() => {
          setEditingPromptIndex(null);
          setPromptDialogOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeletePrompt}
        aria-labelledby="delete-prompt-dialog-title"
        PaperProps={{
          sx: {
            bgcolor: '#2B1449',
            color: 'white',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle id="delete-prompt-dialog-title" sx={{ color: 'white' }}>Delete Prompt</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            Are you sure you want to delete this prompt? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeletePrompt} sx={{ color: '#A259F7' }}>
            Cancel
          </Button>
          <Button onClick={confirmDeletePrompt} color="error" autoFocus sx={{ color: 'white', bgcolor: '#A259F7', '&:hover': { bgcolor: '#8e44ec' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default PromptsSection;
