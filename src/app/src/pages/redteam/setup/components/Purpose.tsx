import React, { useEffect, useState } from 'react';
import { useTelemetry } from '@app/hooks/useTelemetry';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import {
  Alert,
  Switch,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import { alpha, useTheme } from '@mui/material/styles';
import { EXAMPLE_CONFIG, useRedTeamConfig } from '../hooks/useRedTeamConfig';

interface PurposeProps {
  onNext: () => void;
}

export default function Purpose({ onNext }: PurposeProps) {
  const theme = useTheme();
  const { config, updateApplicationDefinition, setFullConfig } = useRedTeamConfig();
  const { recordEvent } = useTelemetry();
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [testMode, setTestMode] = useState<'application' | 'model'>('application');
  const [externalSystemEnabled, setExternalSystemEnabled] = useState(
    Boolean(config.applicationDefinition.connectedSystems?.trim()),
  );

  useEffect(() => {
    recordEvent('webui_page_view', { page: 'redteam_config_purpose' });
  }, [recordEvent]);

  // Check if any field has data
  const hasFormData =
    config.applicationDefinition.purpose ||
    Object.values(config.applicationDefinition).some((val) => val && val.trim?.() !== '');

  // Handle test mode toggle
  const handleTestModeChange = (_: any, newMode: 'application' | 'model') => {
    if (newMode !== null && newMode !== testMode) {
      if (newMode === 'model' && hasFormData) {
        const confirmClear = window.confirm(
          'Switching to model mode will clear the application details. Proceed?'
        );
        if (!confirmClear) return;
      }
      setTestMode(newMode);
      if (newMode === 'model') {
        Object.keys(config.applicationDefinition).forEach((key) => {
          updateApplicationDefinition(key as keyof typeof config.applicationDefinition, '');
        })
      }
      recordEvent('feature_used', { feature: 'redteam_test_mode_change', mode: newMode });
    }
  };

  // Handle load example
  const handleLoadExample = () => {
    if (hasFormData) {
      setConfirmDialogOpen(true);
    } else {
      recordEvent('feature_used', { feature: 'redteam_config_example' });
      setTestMode('application');
      setExternalSystemEnabled(true);
      setFullConfig(EXAMPLE_CONFIG);
    }
  };

  // Confirm load example
  const handleConfirmLoadExample = () => {
    recordEvent('feature_used', { feature: 'redteam_config_example' });
    setTestMode('application');
    setExternalSystemEnabled(true);
    setFullConfig(EXAMPLE_CONFIG);
    setConfirmDialogOpen(false);
  };

  // Validate required fields
  const isPurposePresent =
    config.applicationDefinition.purpose &&
    config.applicationDefinition.purpose.trim() !== '' &&
    config.applicationDefinition.redteamUser &&
    config.applicationDefinition.redteamUser.trim() !== '';

  return (
    <div className="bg-[#22103B] text-white px-4 md:px-12 py-10 space-y-10">
      {/* Header and Load Example */}
      <div className="mb-4 flex items-center justify-between">
      <h2 className="text-2xl font-bold text-gray-50">
        Usage Details
      </h2>

      <Button
        onClick={handleLoadExample}
        sx={{
          backgroundColor: theme.palette.secondary.main,
          color: 'white',
          borderRadius: '10px',
          paddingX:4 ,  
          paddingY: 2,
        }}
        className=" hover:!bg-purple-700/60 !border !border-purple-500/40 normal-case font-medium text-sm shadow-sm transition"
      >
        Load Example
      </Button>
    </div>

      {/* Test Mode Toggle (Tailwind) */}
      <TestModeToggle testMode={testMode} onChange={handleTestModeChange} />

      {/* Main Form Section */}
      {testMode === 'application' ? (
        <Stack spacing={6}>
          <Alert
            severity="info"
            sx={{
              '& .MuiAlert-icon': { color: 'info.main' },
              backgroundColor:alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${
                alpha(theme.palette.info.main, 0.2)
              }`,
              '& .MuiAlert-message': { color: 'text.primary' },
            }}
          >
            The more information you provide, the better the redteam attacks will be. You can leave fields blank if they're not relevant, and you'll be able to revise information later.
          </Alert>

          <Stack spacing={3}>
            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                Purpose
              </Typography>
              <Typography variant="body1">
                The primary objective of the AI in this application.
              </Typography>
              <TextField
                fullWidth
                value={config.applicationDefinition.purpose}
                onChange={(e) => updateApplicationDefinition('purpose', e.target.value)}
                placeholder="e.g. You are a travel agent specialized in budget trips to Europe."
                margin="normal"
                multiline
                rows={4}
                slotProps={{
                  input: {
                    sx:{backgroundColor: theme.palette.primary.main}
                  }
                }}
              />
            </Box>

            <Box>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'medium' }}>
                Describe the user the redteamer is impersonating
              </Typography>
              <TextField
                fullWidth
                slotProps={{
                  input: {
                    sx:{backgroundColor: theme.palette.primary.main}
                  }
                }}
                value={config.applicationDefinition.redteamUser}
                onChange={(e) => updateApplicationDefinition('redteamUser', e.target.value)}
                placeholder="e.g. A traveler looking for budget flights to Europe. An employee of the company."
              />
            </Box>

            <Box>
              <Typography variant="h5" sx={{ fontWeight: 'medium', mb: 1 }}>
                External System Access
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <Switch
                  sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: theme.palette.secondary.light,
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: theme.palette.secondary.light,
                  },
                }}
                  checked={externalSystemEnabled}
                  onChange={(e) => setExternalSystemEnabled(e.target.checked)}
                  inputProps={{ 'aria-label': 'toggle external system access' }}
                />
                <Typography>This application connects to external systems</Typography>
              </Box>

              {externalSystemEnabled && (
                <Stack spacing={2}>
                  <Typography variant="body1">
                    What external systems are connected to this application?
                  </Typography>
                  <TextField
                    fullWidth
                    value={config.applicationDefinition.connectedSystems}
                    onChange={(e) =>
                      updateApplicationDefinition('connectedSystems', e.target.value)
                    }
                    multiline
                    slotProps={{
                      input: {
                        sx:{backgroundColor: theme.palette.primary.main}
                      }
                    }}
                    rows={2}
                    placeholder="e.g. CRM, booking system, knowledge base."
                  />
                  <Typography variant="body1">
                    What data is available to the LLM from connected systems that the user has access to?
                  </Typography>
                  <TextField
                    fullWidth
                    slotProps={{
                      input: {
                        sx:{backgroundColor: theme.palette.primary.main}
                      }
                    }}
                    value={config.applicationDefinition.accessToData}
                    onChange={(e) => updateApplicationDefinition('accessToData', e.target.value)}
                    multiline
                    rows={2}
                    placeholder="e.g. Flight prices, profile, purchase history, HR info."
                  />
                  <Typography variant="body1">
                    What data is available to the LLM from connected systems that the user shouldn't have access to?
                  </Typography>
                  <TextField
                    fullWidth
                    slotProps={{
                      input: {
                        sx:{backgroundColor: theme.palette.primary.main}
                      }
                    }}
                    value={config.applicationDefinition.forbiddenData}
                    onChange={(e) => updateApplicationDefinition('forbiddenData', e.target.value)}
                    multiline
                    rows={2}
                    placeholder="e.g. Other users' data, sensitive company info."
                  />
                  <Typography variant="body1">
                    What actions can the user take on connected systems?
                  </Typography>
                  <TextField
                    fullWidth
                    slotProps={{
                      input: {
                        sx:{backgroundColor: theme.palette.primary.main}
                      }
                    }}
                    value={config.applicationDefinition.accessToActions}
                    onChange={(e) =>
                      updateApplicationDefinition('accessToActions', e.target.value)
                    }
                    multiline
                    rows={2}
                    placeholder="e.g. Update profile, book flights, view HR info."
                  />
                  <Typography variant="body1">
                    What actions shouldn't the user be able to take on connected systems?
                  </Typography>
                  <TextField
                    fullWidth
                    slotProps={{
                      input: {
                        sx:{backgroundColor: theme.palette.primary.main}
                      }
                    }}
                    value={config.applicationDefinition.forbiddenActions}
                    onChange={(e) =>
                      updateApplicationDefinition('forbiddenActions', e.target.value)
                    }
                    multiline
                    rows={2}
                    placeholder="e.g. Update other users' profiles, cancel other users' flights."
                  />
                </Stack>
              )}
            </Box>
          </Stack>
        </Stack>
      ) : (
        <Box>
          <Alert
            severity="info"
            sx={{
              '& .MuiAlert-icon': { color: 'info.main' },
              backgroundColor: theme.palette.mode === 'dark'
                ? alpha(theme.palette.info.main, 0.1)
                : alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${
                theme.palette.mode === 'dark'
                  ? alpha(theme.palette.info.main, 0.3)
                  : alpha(theme.palette.info.main, 0.2)
              }`,
              '& .MuiAlert-message': { color: 'text.primary' },
            }}
          >
            When testing a model directly, you don't need to provide application details. You can proceed to configure the model and test scenarios in the next steps.
          </Alert>
        </Box>
      )}

      {/* Next Button */}
      <div className="flex justify-end">
        <NextButton
          onNext={onNext}
          disabled={
            testMode === 'application' &&
            (!config.applicationDefinition.purpose?.trim() ||
            !config.applicationDefinition.redteamUser?.trim())
          }
        />
      </div>

      {/* Confirm Load Example Dialog */}
      <Dialog open={confirmDialogOpen} onClose={() => setConfirmDialogOpen(false)}>
        <DialogTitle>Load Example Configuration?</DialogTitle>
        <DialogContent>
          Load example configuration with demo chat endpoint and sample application details? Current settings will be replaced.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmLoadExample} variant="contained" color="primary">
            Load Example
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

// TestModeToggle using Tailwind only, but with all necessary props for integration
interface TestModeToggleProps {
  testMode: 'application' | 'model';
  onChange: (event: React.MouseEvent<HTMLButtonElement, MouseEvent> | null, value: 'application' | 'model') => void;
}

const TestModeToggle: React.FC<TestModeToggleProps> = ({ testMode, onChange }) => {
  const modes: {
    value: 'application' | 'model';
    title: string;
    description: string;
  }[] = [
    {
      value: 'application',
      title: "I'm testing an application",
      description: 'Test a complete AI application with its context',
    },
    {
      value: 'model',
      title: "I'm testing a model",
      description: 'Test a model directly without application context',
    },
  ];

  const baseClass =
    'flex-1 px-5 py-4 text-center transition-all duration-200 focus:outline-none';
  const selectedClass =
    ' bg-[#7904DF] text-white font-semibold shadow-inner';
  const unselectedClass =
    'bg-[#3d2070] text-gray-200 hover:bg-[#47258c]';

  return (
    <div className="max-w-3xl w-full mx-auto mb-6">
      <div className="flex border border-gray-700 rounded-lg overflow-hidden shadow-sm">
        {modes.map((mode, index) => {
          const selected = testMode === mode.value;
          return (
            <button
              key={mode.value}
              onClick={(event) => onChange(event, mode.value)}
              className={`${baseClass} ${
                selected ? selectedClass : unselectedClass
              } ${
                index !== modes.length - 1
                  ? 'border-r border-gray-700'
                  : ''
              }`}
              type="button"
              aria-pressed={selected}
            >
              <div className="text-sm font-medium">{mode.title}</div>
              <div className="text-xs text-gray-400 mt-1">
                {mode.description}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

interface NextButtonProps {
  onNext: () => void;
  disabled?: boolean;
}

function NextButton({ onNext, disabled }: NextButtonProps) {
  return (
    <div className="pt-4 flex justify-end">
      <Button
        variant="contained"
        onClick={onNext}
        disabled={disabled}
        endIcon={<ArrowRightIcon />}
        className={`
          normal-case font-semibold text-sm
          !px-6 !py-2 !rounded !shadow-md !transition
          !bg-[#7904DF] !text-white hover:!bg-[#A259F7] !border !border-purple-500/40
          ${disabled ? '!bg-gray-600 !cursor-not-allowed !text-gray-300' : ''}
        `}
      >
        Next
      </Button>
    </div>
  );
}
