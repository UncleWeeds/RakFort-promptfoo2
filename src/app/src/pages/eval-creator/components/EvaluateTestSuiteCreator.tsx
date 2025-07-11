import React, { useState, useEffect } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import type { ProviderOptions, TestCase, TestSuiteConfig } from '@app/pages/eval/components/types';
import { useStore } from '@app/stores/evalConfig';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ConfigureEnvButton from './ConfigureEnvButton';
import PromptsSection from './PromptsSection';
import ProviderSelector from './ProviderSelector';
import RunTestSuiteButton from './RunTestSuiteButton';
import TestCasesSection from './TestCasesSection';
import YamlEditor from './YamlEditor';
import './EvaluateTestSuiteCreator.css';

export type WebTestSuiteConfig = TestSuiteConfig & {
  providers: ProviderOptions[];
  prompts: string[];
  tests: TestCase[];
};

function ErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div role="alert">
      <p>Something went wrong:</p>
      <pre>{error.message}</pre>
      <button onClick={resetErrorBoundary}>Try again</button>
    </div>
  );
}

const EvaluateTestSuiteCreator: React.FC = () => {
  const [resetDialogOpen, setResetDialogOpen] = useState(false);

  const { setDescription, providers, setProviders, prompts, setPrompts, setTestCases } = useStore();

  useEffect(() => {
    useStore.persist.rehydrate();
  }, []);

  const extractVarsFromPrompts = (prompts: string[]): string[] => {
    const varRegex = /{{\s*(\w+)\s*}}/g;
    const varsSet = new Set<string>();

    prompts.forEach((prompt) => {
      let match;
      while ((match = varRegex.exec(prompt)) !== null) {
        varsSet.add(match[1]);
      }
    });

    return Array.from(varsSet);
  };

  const varsList = extractVarsFromPrompts(prompts);

  const handleReset = () => {
    setDescription('');
    setProviders([]);
    setPrompts([]);
    setTestCases([]);
    setResetDialogOpen(false);
  };

  return (
    <Box sx={{ minHeight: '100vh', height: '100%', width: '100%', p: 3, bgcolor: '#22103B' }}>
      <Paper
        elevation={0}
        sx={{
          minHeight: '100vh',
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          borderTop: 1,
          borderColor: 'rgba(162,89,247,0.2)',
          boxShadow: '0 1px 2px rgba(0,0,0,0.15)',
          bgcolor: '#2B1449',
          borderRadius: 2,
          p: 3,
        }}
      >
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Typography variant="h4" sx={{ color: 'white', fontWeight: 700 }}>
            Set up an evaluation
          </Typography>
          <Stack direction="row" spacing={2}>
            <RunTestSuiteButton />
            <ConfigureEnvButton />
            <Button
              variant="outlined"
              sx={{
                color: 'white',
                borderColor: '#A259F7',
                '&:hover': { backgroundColor: 'rgba(162,89,247,0.08)', borderColor: '#A259F7' },
                borderRadius: 2,
              }}
              onClick={() => setResetDialogOpen(true)}
            >
              Reset
            </Button>
          </Stack>
        </Stack>
        <Box mt={2} />
        <Box>
          <ErrorBoundary
            FallbackComponent={ErrorFallback}
            onReset={() => {
              setProviders([]);
            }}
          >
            <Stack direction="column" spacing={2} justifyContent="space-between">
              <Typography variant="h5" sx={{ color: 'white', fontWeight: 600 }}>
                Providers
              </Typography>
              <ProviderSelector providers={providers} onChange={setProviders} />
            </Stack>
          </ErrorBoundary>
        </Box>
        <Box mt={2} />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setPrompts([]);
          }}
        >
          <PromptsSection />
        </ErrorBoundary>
        <Box mt={2} />
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => {
            setTestCases([]);
          }}
        >
          <TestCasesSection varsList={varsList} />
        </ErrorBoundary>
        <Box mt={2} />
        <YamlEditor initialConfig={useStore.getState().getTestSuite()} />
        <Dialog
          open={resetDialogOpen}
          onClose={() => setResetDialogOpen(false)}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          PaperProps={{
            sx: {
              bgcolor: '#2B1449',
              color: 'white',
              borderRadius: 2,
            },
          }}
        >
          <DialogTitle id="alert-dialog-title" sx={{ color: 'white' }}>{'Confirm Reset'}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description" sx={{ color: 'white' }}>
              Are you sure you want to reset all the fields? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setResetDialogOpen(false)} sx={{ color: '#A259F7' }}>Cancel</Button>
            <Button onClick={handleReset} autoFocus sx={{ color: 'white', bgcolor: '#A259F7', '&:hover': { bgcolor: '#8e44ec' } }}>
              Reset
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Box>
  );
};

export default EvaluateTestSuiteCreator;
