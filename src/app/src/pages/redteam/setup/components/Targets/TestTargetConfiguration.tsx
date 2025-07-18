import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import InfoIcon from '@mui/icons-material/Info';
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import type { ProviderOptions } from '../../types';
import ProviderResponse from './ProviderResponse';

interface TestTargetConfigurationProps {
  testingTarget: boolean;
  handleTestTarget: () => void;
  selectedTarget: ProviderOptions;
  testResult: any;
}

const TestTargetConfiguration: React.FC<TestTargetConfigurationProps> = ({
  testingTarget,
  handleTestTarget,
  selectedTarget,
  testResult,
}) => {
  const theme = useTheme();

  return (
    <Box mt={4}>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Typography variant="h6" sx={{ flexGrow: 1, color: '#fff' }}>
          Test Target Configuration
        </Typography>
        <Button
          variant="contained"
          onClick={handleTestTarget}
          disabled={testingTarget || (!selectedTarget.config.url && !selectedTarget.config.request)}
          startIcon={testingTarget ? <CircularProgress size={20} /> : null}
          sx={{ backgroundColor: '#A259F7', color: '#fff', '&:hover': { backgroundColor: '#2B1449' } }}
        >
          {testingTarget ? 'Testing...' : 'Test Target'}
        </Button>
      </Stack>

      {!selectedTarget.config.url && !selectedTarget.config.request && (
        <Alert severity="info" sx={{ backgroundColor: '#2B1449', color: '#fff', borderColor: 'grey.500', border: 1 }}>
          Please configure the HTTP endpoint above and click "Test Target" to proceed.
        </Alert>
      )}

      {testResult && (
        <Box mt={2}>
          {!testResult.unalignedProviderResult && testResult.success != null && (
            <>
              <Alert
                severity={
                  testResult.success &&
                  (!testResult.redteamProviderResult ||
                    (testResult.redteamProviderResult.output.length > 5 &&
                      !testResult.redteamProviderResult.output.includes('{')))
                    ? 'success'
                    : 'error'
                }
                sx={{ backgroundColor: '#2B1449', color: '#fff', borderColor: 'grey.500', border: 1 }}
              >
                {testResult.message}
              </Alert>

              {testResult.suggestions && (
                <Box mt={2}>
                  <Typography variant="subtitle1" gutterBottom sx={{ color: '#fff' }}>
                    Suggestions:
                  </Typography>
                  <Paper
                    elevation={1}
                    sx={{
                      p: 2,
                      bgcolor: '#22103B',
                      color: '#fff',
                      borderColor: 'grey.500',
                      border: 1,
                    }}
                  >
                    <List>
                      {testResult.suggestions.map((suggestion: string, index: number) => (
                        <ListItem key={index}>
                          <ListItemIcon>
                            <InfoIcon color="primary" />
                          </ListItemIcon>
                          <ListItemText primary={suggestion} sx={{ color: '#fff' }} />
                        </ListItem>
                      ))}
                    </List>
                  </Paper>
                </Box>
              )}
            </>
          )}
          <Accordion sx={{ mt: 2, backgroundColor: '#2B1449', borderColor: 'grey.500', border: 1 }} expanded>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="provider-response-content"
              id="provider-response-header"
              sx={{ backgroundColor: '#2B1449' }}
            >
              <Typography sx={{ color: '#fff' }}>Provider Response Details</Typography>
            </AccordionSummary>
            <AccordionDetails sx={{ backgroundColor: '#2B1449' }}>
              {/* If It's a unaligned test show the harmful outputs */}
              {testResult.unalignedProviderResult && (
                <>
                  <Box>
                    {testResult.unalignedProviderResult.outputs.length > 0 ? (
                      <Alert severity="info" sx={{ backgroundColor: '#2B1449', color: '#fff', borderColor: 'grey.500', border: 1, mb: 2 }}>
                        The provider appears to be working properly. Review the harmful outputs
                        below. If you have at least one result, it is working as intended. This
                        should have a harmful intent.
                      </Alert>
                    ) : (
                      <Alert severity="error" sx={{ backgroundColor: '#2B1449', color: '#fff', borderColor: 'grey.500', border: 1 }}>
                        We weren't able to get any harmful outputs from the provider. Please review
                        the raw request and response below.
                      </Alert>
                    )}

                    <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                      Harmful Outputs:
                    </Typography>
                    <Paper
                      elevation={0}
                      sx={{
                        p: 2,
                        bgcolor: '#22103B',
                        color: '#fff',
                        borderColor: 'grey.500',
                        border: 1,
                        maxHeight: '200px',
                        overflow: 'auto',
                        mb: 2,
                      }}
                    >
                      <pre style={{ color: '#fff', background: 'none', margin: 0 }}> - {testResult.unalignedProviderResult.outputs.join('\n - ')}</pre>
                    </Paper>
                  </Box>
                  <Typography variant="h6" sx={{ mt: 10, color: '#fff' }} gutterBottom>
                    When testing harmful outputs, we also do a raw request to the provider to help
                    troubleshooting. If there are any issues, you can review the raw request and
                    response below:
                  </Typography>
                </>
              )}
              {/* If It's a redteam test show a header since we have two prompts */}
              {testResult.redteamProviderResult && (
                <Typography variant="h6" gutterBottom sx={{ color: '#fff' }}>
                  Simple String Prompt "hello world"
                </Typography>
              )}
              {/* If It's a redteam test show the second test */}
              <ProviderResponse providerResponse={testResult.providerResponse} />
              {testResult.redteamProviderResult && (
                <>
                  <Typography variant="h6" sx={{ mt: 4, color: '#fff' }} gutterBottom>
                    OpenAI Formatted Prompt
                  </Typography>
                  <ProviderResponse providerResponse={testResult.redteamProviderResult} />
                </>
              )}
            </AccordionDetails>
          </Accordion>
        </Box>
      )}
    </Box>
  );
};

export default TestTargetConfiguration;
