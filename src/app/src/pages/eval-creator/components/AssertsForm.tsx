import React, { useState } from 'react';
import Delete from '@mui/icons-material/Delete';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import type { Assertion, AssertionType } from '@promptfoo/types';

interface AssertsFormProps {
  onAdd: (asserts: Assertion[]) => void;
  initialValues: Assertion[];
}

const assertTypes: AssertionType[] = [
  'equals',
  'contains',
  'icontains',
  'contains-all',
  'contains-any',
  'starts-with',
  'regex',
  'is-json',
  'contains-json',
  'is-xml',
  'contains-xml',
  'is-sql',
  'contains-sql',
  //'javascript',
  //'python',
  'similar',
  'llm-rubric',
  'model-graded-closedqa',
  'factuality',
  'webhook',
  'bleu',
  'rouge-n',
  'g-eval',
  'not-equals',
  'not-contains',
  'not-icontains',
  'not-contains-all',
  'not-contains-any',
  'not-starts-with',
  'not-regex',
  'not-is-json',
  'not-contains-json',
  //'not-javascript',
  //'not-python',
  'not-similar',
  'not-webhook',
  'not-rouge-n',
  'is-valid-function-call',
  'is-valid-openai-function-call',
  'is-valid-openai-tools-call',
  'latency',
  'perplexity',
  'perplexity-score',
  'cost',
  'answer-relevance',
  'context-faithfulness',
  'context-recall',
  'context-relevance',
  'select-best',
  'moderation',
];

const AssertsForm: React.FC<AssertsFormProps> = ({ onAdd, initialValues }) => {
  const [asserts, setAsserts] = useState<Assertion[]>(initialValues || []);

  const handleAdd = () => {
    const newAsserts = [...asserts, { type: 'equals' as AssertionType, value: '' }];
    setAsserts(newAsserts);
    onAdd(newAsserts);
  };

  const handleRemoveAssert = (indexToRemove: number) => {
    const newAsserts = asserts.filter((_, index) => index !== indexToRemove);
    setAsserts(newAsserts);
    onAdd(newAsserts);
  };

  return (
    <>
      <Typography variant="h6" sx={{ color: 'white', fontWeight: 600 }}>Asserts</Typography>
      <Box my={asserts.length > 0 ? 2 : 0}>
        <Stack direction="column" spacing={2}>
          {asserts.map((assert, index) => (
            <Stack key={index} direction="row" spacing={2} alignItems="center">
              <Autocomplete
                value={assert.type}
                options={assertTypes}
                sx={{ minWidth: 200, bgcolor: '#2B1449', color: 'white', borderRadius: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: '#A259F7' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' } }}
                onChange={(event, newValue) => {
                  const newType = newValue;
                  const newAsserts = asserts.map((a, i) =>
                    i === index ? { ...a, type: newType as AssertionType } : a,
                  );
                  setAsserts(newAsserts);
                  onAdd(newAsserts);
                }}
                renderInput={(params) => <TextField {...params} label="Type" sx={{ bgcolor: '#2B1449', color: 'white', borderRadius: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: '#A259F7' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' } }} InputLabelProps={{ style: { color: '#A259F7' } }} />}
              />
              <TextField
                label="Value"
                value={assert.value}
                fullWidth
                onChange={(e) => {
                  const newValue = e.target.value;
                  const newAsserts = asserts.map((a, i) =>
                    i === index ? { ...a, value: newValue } : a,
                  );
                  setAsserts(newAsserts);
                  onAdd(newAsserts);
                }}
                sx={{ bgcolor: '#2B1449', color: 'white', borderRadius: 2, '& .MuiInputBase-input': { color: 'white' }, '& .MuiInputLabel-root': { color: '#A259F7' }, '& .MuiOutlinedInput-notchedOutline': { borderColor: '#A259F7' } }}
                InputLabelProps={{ style: { color: '#A259F7' } }}
              />
              <IconButton onClick={() => handleRemoveAssert(index)} size="small" sx={{ color: '#A259F7' }}>
                <Delete />
              </IconButton>
            </Stack>
          ))}
        </Stack>
      </Box>
      <Button color="primary" onClick={handleAdd} variant="contained" sx={{ backgroundColor: '#A259F7', color: 'white', borderRadius: 2, fontWeight: 600, boxShadow: 'none', '&:hover': { backgroundColor: '#8e44ec' } }}>
        Add Assert
      </Button>
    </>
  );
};

export default AssertsForm;
