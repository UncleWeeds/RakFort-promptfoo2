import React from 'react';
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
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { testCaseFromCsvRow } from '@promptfoo/csv';
import type { CsvRow, TestCase } from '@promptfoo/types';
import TestCaseDialog from './TestCaseDialog';

interface TestCasesSectionProps {
  varsList: string[];
}

const TestCasesSection: React.FC<TestCasesSectionProps> = ({ varsList }) => {
  const { testCases, setTestCases } = useStore();
  const [editingTestCaseIndex, setEditingTestCaseIndex] = React.useState<number | null>(null);
  const [testCaseDialogOpen, setTestCaseDialogOpen] = React.useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [testCaseToDelete, setTestCaseToDelete] = React.useState<number | null>(null);

  const handleAddTestCase = (testCase: TestCase, shouldClose: boolean) => {
    if (editingTestCaseIndex === null) {
      setTestCases([...testCases, testCase]);
    } else {
      const updatedTestCases = testCases.map((tc, index) =>
        index === editingTestCaseIndex ? testCase : tc,
      );
      setTestCases(updatedTestCases);
      setEditingTestCaseIndex(null);
    }

    if (shouldClose) {
      setTestCaseDialogOpen(false);
    }
  };

  const handleAddTestCaseFromFile = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.stopPropagation();
    event.preventDefault();

    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const text = e.target?.result?.toString();
        if (text) {
          const { parse: parseCsv } = await import('csv-parse/sync');
          const rows: CsvRow[] = parseCsv(text, { columns: true });
          const newTestCases: TestCase[] = rows.map((row) => testCaseFromCsvRow(row) as TestCase);
          setTestCases([...testCases, ...newTestCases]);
        }
      };
      reader.readAsText(file);
    }
  };

  const handleRemoveTestCase = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    setTestCaseToDelete(index);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteTestCase = () => {
    if (testCaseToDelete !== null) {
      setTestCases(testCases.filter((_, i) => i !== testCaseToDelete));
      setTestCaseToDelete(null);
    }
    setDeleteDialogOpen(false);
  };

  const cancelDeleteTestCase = () => {
    setTestCaseToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleDuplicateTestCase = (event: React.MouseEvent, index: number) => {
    event.stopPropagation();
    const duplicatedTestCase = JSON.parse(JSON.stringify(testCases[index]));
    setTestCases([...testCases, duplicatedTestCase]);
  };

  return (
    <>
      <Stack direction="row" spacing={2} mb={2} justifyContent="space-between">
        <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>Test Cases</Typography>
        <div>
          <label htmlFor={`file-input-add-test-case`}>
            <Tooltip title="Upload test cases from csv">
              <span>
                <IconButton component="span" sx={{ color: '#A259F7' }}>
                  <Publish />
                </IconButton>
                <input
                  id={`file-input-add-test-case`}
                  type="file"
                  accept=".csv"
                  onChange={handleAddTestCaseFromFile}
                  style={{ display: 'none' }}
                />
              </span>
            </Tooltip>
          </label>
          {testCases.length === 0 && (
            <Button
              variant="outlined"
              onClick={() => {
                const exampleTestCase: TestCase = {
                  description: 'Fun animal adventure story',
                  vars: {
                    animal: 'penguin',
                    location: 'tropical island',
                  },
                  assert: [
                    {
                      type: 'contains-any',
                      value: ['penguin', 'adventure', 'tropical', 'island'],
                    },
                    {
                      type: 'llm-rubric',
                      value:
                        'Is this a fun, child-friendly story featuring a penguin on a tropical island adventure?\n\nCriteria:\n1. Does it mention a penguin as the main character?\n2. Does the story take place on a tropical island?\n3. Is it entertaining and appropriate for children?\n4. Does it have a sense of adventure?',
                    },
                  ],
                };
                setTestCases([...testCases, exampleTestCase]);
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
            onClick={() => setTestCaseDialogOpen(true)}
            sx={{
              backgroundColor: '#A259F7',
              color: 'white',
              borderRadius: 2,
              fontWeight: 600,
              boxShadow: 'none',
              '&:hover': { backgroundColor: '#8e44ec' },
            }}
          >
            Add Test Case
          </Button>
        </div>
      </Stack>
      <TableContainer sx={{ bgcolor: '#2B1449', borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: '#2B1449' }}>
              <TableCell sx={{ color: 'white' }}>Description</TableCell>
              <TableCell sx={{ color: 'white' }}>Assertions</TableCell>
              <TableCell sx={{ color: 'white' }}>Variables</TableCell>
              <TableCell align="right" sx={{ color: 'white' }}></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {testCases.length === 0 ? (
              <TableRow sx={{ bgcolor: '#2B1449' }}>
                <TableCell colSpan={4} align="center" sx={{ color: 'white' }}>
                  No test cases added yet.
                </TableCell>
              </TableRow>
            ) : (
              testCases.map((testCase, index) => (
                <TableRow
                  key={index}
                  sx={{
                    bgcolor: '#2B1449',
                    '&:hover': {
                      backgroundColor: '#3A2060',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => {
                    setEditingTestCaseIndex(index);
                    setTestCaseDialogOpen(true);
                  }}
                >
                  <TableCell sx={{ color: 'white' }}>
                    <Typography variant="body2" sx={{ color: 'white' }}>
                      {testCase.description || `Test Case #${index + 1}`}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: 'white' }}>{testCase.assert?.length || 0} assertions</TableCell>
                  <TableCell sx={{ color: 'white' }}>
                    {Object.entries(testCase.vars || {})
                      .map(([k, v]) => k + '=' + v)
                      .join(', ')}
                  </TableCell>
                  <TableCell align="right" sx={{ minWidth: 150, color: 'white' }}>
                    <IconButton
                      onClick={() => {
                        setEditingTestCaseIndex(index);
                        setTestCaseDialogOpen(true);
                      }}
                      size="small"
                      sx={{ color: '#A259F7' }}
                    >
                      <Edit />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleDuplicateTestCase(event, index)}
                      size="small"
                      sx={{ color: '#A259F7' }}
                    >
                      <Copy />
                    </IconButton>
                    <IconButton
                      onClick={(event) => handleRemoveTestCase(event, index)}
                      size="small"
                      sx={{ color: '#A259F7' }}
                    >
                      <Delete />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
      <TestCaseDialog
        open={testCaseDialogOpen}
        onAdd={handleAddTestCase}
        varsList={varsList}
        initialValues={editingTestCaseIndex === null ? undefined : testCases[editingTestCaseIndex]}
        onCancel={() => {
          setEditingTestCaseIndex(null);
          setTestCaseDialogOpen(false);
        }}
      />

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteDialogOpen}
        onClose={cancelDeleteTestCase}
        aria-labelledby="delete-test-case-dialog-title"
        PaperProps={{
          sx: {
            bgcolor: '#2B1449',
            color: 'white',
            borderRadius: 2,
          },
        }}
      >
        <DialogTitle id="delete-test-case-dialog-title" sx={{ color: 'white' }}>Delete Test Case</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ color: 'white' }}>
            Are you sure you want to delete this test case? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDeleteTestCase} sx={{ color: '#A259F7' }}>
            Cancel
          </Button>
          <Button onClick={confirmDeleteTestCase} color="error" autoFocus sx={{ color: 'white', bgcolor: '#A259F7', '&:hover': { bgcolor: '#8e44ec' } }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default TestCasesSection;
