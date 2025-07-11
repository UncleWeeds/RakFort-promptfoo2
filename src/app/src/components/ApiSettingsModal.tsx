import { useState, useEffect } from 'react';
import { useApiHealth, type ApiHealthStatus } from '@app/hooks/useApiHealth';
import useApiConfig from '@app/stores/apiConfig';
import CircleIcon from '@mui/icons-material/Circle';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import ApiIcon from '@mui/icons-material/Api';
import LinkIcon from '@mui/icons-material/Link';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const StatusIndicator = ({ status }: { status: ApiHealthStatus }) => {
  const statusConfig: Record<ApiHealthStatus, { color: string; text: string; bgColor: string }> = {
    connected: { 
      color: '#4CAF50', 
      text: 'Connected to Rakfort-promptfoo API',
      bgColor: 'rgba(76, 175, 80, 0.1)'
    },
    blocked: { 
      color: '#F44336', 
      text: 'Cannot connect to Rakfort-promptfoo API',
      bgColor: 'rgba(244, 67, 54, 0.1)'
    },
    loading: { 
      color: '#2196F3', 
      text: 'Checking connection...',
      bgColor: 'rgba(33, 150, 243, 0.1)'
    },
    unknown: { 
      color: '#9E9E9E', 
      text: 'Checking connection status...',
      bgColor: 'rgba(158, 158, 158, 0.1)'
    },
    disabled: { 
      color: '#757575', 
      text: 'Remote generation is disabled',
      bgColor: 'rgba(117, 117, 117, 0.1)'
    },
  };

  const config = statusConfig[status];

  return (
    <Box sx={{ 
      display: 'flex', 
      alignItems: 'center', 
      gap: 2,
      p: 2,
      borderRadius: 2,
      bgcolor: config.bgColor,
      border: `1px solid ${config.color}`,
    }}>
      <CircleIcon sx={{ color: config.color, fontSize: '16px' }} />
      <Typography variant="body2" sx={{ color: 'white', fontWeight: 500 }}>
        {config.text}
      </Typography>
    </Box>
  );
};

export default function ApiSettingsModal<T extends { open: boolean; onClose: () => void }>({
  open,
  onClose,
}: T) {
  const { apiBaseUrl, setApiBaseUrl, enablePersistApiBaseUrl } = useApiConfig();
  const [tempApiBaseUrl, setTempApiBaseUrl] = useState(apiBaseUrl || '');
  const { status, message, checkHealth, isChecking } = useApiHealth();
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (open) {
      checkHealth();
    }
  }, [open, checkHealth]);

  useEffect(() => {
    setTempApiBaseUrl(apiBaseUrl || '');
  }, [apiBaseUrl]);

  const handleApiBaseUrlChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTempApiBaseUrl(event.target.value);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      setApiBaseUrl(tempApiBaseUrl);
      enablePersistApiBaseUrl();
      await checkHealth();
      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  const isFormDisabled = status === 'loading' || isChecking || isSaving;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="api-settings-dialog-title"
      PaperProps={{
        sx: {
          bgcolor: '#2B1449',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle id="api-settings-dialog-title">
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: '#A259F7',
              color: 'white',
            }}>
              <SettingsIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                API & Sharing Settings
              </Typography>
              <Typography variant="subtitle2" sx={{ color: '#A259F7' }}>
                Configure your Rakfort-promptfoo connection
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<ApiIcon />} 
              label="API Configuration" 
              size="small" 
              sx={{ bgcolor: '#A259F7', color: 'white' }}
            />
            <Chip 
              icon={<LinkIcon />} 
              label="Connection Status" 
              size="small" 
              sx={{ bgcolor: '#A259F7', color: 'white' }}
            />
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Connection Status
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Box
                sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}
              >
                <StatusIndicator status={status} />
                <Tooltip title="Check connection">
                  <span>
                    <IconButton 
                      onClick={checkHealth} 
                      size="small" 
                      disabled={isChecking}
                      sx={{
                        color: '#A259F7',
                        '&:hover': { bgcolor: 'rgba(162, 89, 247, 0.1)' },
                      }}
                    >
                      {isChecking ? <CircularProgress size={20} sx={{ color: '#A259F7' }} /> : <RefreshIcon />}
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
              {message && status !== 'unknown' && status !== 'loading' && (
                <Alert 
                  severity={status === 'connected' ? 'success' : 'error'} 
                  sx={{ 
                    mt: 1,
                    bgcolor: status === 'connected' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                    border: `1px solid ${status === 'connected' ? '#4CAF50' : '#F44336'}`,
                    '& .MuiAlert-message': { color: 'white' },
                  }}
                >
                  {message}
                </Alert>
              )}
            </Box>
          </Box>

          <Divider sx={{ borderColor: '#A259F7' }} />

          <Box>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              API Configuration
            </Typography>
            <TextField
              label="API Base URL"
              helperText="The Rakfort-promptfoo API the webview will connect to"
              value={tempApiBaseUrl}
              onChange={handleApiBaseUrlChange}
              fullWidth
              margin="normal"
              disabled={isFormDisabled}
              sx={{
                '& .MuiInputBase-root': {
                  bgcolor: '#22103B',
                  color: 'white',
                  borderRadius: 2,
                },
                '& .MuiInputLabel-root': {
                  color: '#A259F7',
                },
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#A259F7',
                },
                '& .MuiFormHelperText-root': {
                  color: '#A259F7',
                },
                '& .MuiInputBase-input': {
                  color: 'white',
                },
              }}
            />
          </Box>
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose} 
          disabled={isFormDisabled}
          sx={{
            color: '#A259F7',
            borderColor: '#A259F7',
            '&:hover': {
              borderColor: '#8e44ec',
              bgcolor: 'rgba(162, 89, 247, 0.1)',
            },
          }}
        >
          Cancel
        </Button>
        <Button
          onClick={handleSave}
          disabled={isFormDisabled}
          variant="contained"
          startIcon={isSaving && <CircularProgress size={20} sx={{ color: 'white' }} />}
          sx={{
            bgcolor: '#A259F7',
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#8e44ec',
            },
            '&:disabled': {
              bgcolor: '#3A2060',
              color: '#757575',
            },
          }}
        >
          {isSaving ? 'Saving...' : 'Save Settings'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
