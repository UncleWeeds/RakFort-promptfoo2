import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Grid,
  LinearProgress,
  Divider,
  IconButton,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  ArrowBack,
  Download,
  Share,
  CheckCircle,
  Cancel,
  Warning,
  TrendingUp,
  TrendingDown,
  Refresh,
  Visibility,
} from '@mui/icons-material';
import { useTheme, alpha } from '@mui/material/styles';

interface TestResult {
  id: string;
  prompt: string;
  expected: string;
  actual: string;
  passed: boolean;
  score: number;
  provider: string;
  model: string;
  duration: number;
  timestamp: string;
}

interface EvalReport {
  id: string;
  title: string;
  description: string;
  createdAt: string;
  totalTests: number;
  passedTests: number;
  failedTests: number;
  overallScore: number;
  providers: string[];
  models: string[];
  results: TestResult[];
  metadata: {
    dataset: string;
    author: string;
    version: string;
  };
}

const EvalReportPage: React.FC = () => {
  const { evalId } = useParams<{ evalId: string }>();
  const navigate = useNavigate();
  const [report, setReport] = useState<EvalReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProvider, setSelectedProvider] = useState<string>('all');
  const theme = useTheme();

  useEffect(() => {
    if (evalId) {
      fetchEvalReport(evalId);
    }
  }, [evalId]);

  const fetchEvalReport = async (id: string) => {
    try {
      setLoading(true);
      // Mock data for now - replace with actual API call
      const mockReport: EvalReport = {
        id,
        title: `Evaluation Report - ${id}`,
        description: 'Comprehensive evaluation of AI model performance across multiple test cases',
        createdAt: new Date().toISOString(),
        totalTests: 25,
        passedTests: 18,
        failedTests: 7,
        overallScore: 72,
        providers: ['openai', 'anthropic', 'google'],
        models: ['gpt-4', 'claude-3', 'gemini-pro'],
        metadata: {
          dataset: 'General Knowledge Test',
          author: 'Test User',
          version: '1.0.0',
        },
        results: [
          {
            id: '1',
            prompt: 'What is the capital of France?',
            expected: 'Paris',
            actual: 'Paris',
            passed: true,
            score: 1.0,
            provider: 'openai',
            model: 'gpt-4',
            duration: 1200,
            timestamp: new Date().toISOString(),
          },
          {
            id: '2',
            prompt: 'Solve: 2x + 5 = 13',
            expected: 'x = 4',
            actual: 'x = 4',
            passed: true,
            score: 1.0,
            provider: 'anthropic',
            model: 'claude-3',
            duration: 800,
            timestamp: new Date().toISOString(),
          },
          {
            id: '3',
            prompt: 'What is the largest planet in our solar system?',
            expected: 'Jupiter',
            actual: 'Saturn',
            passed: false,
            score: 0.0,
            provider: 'google',
            model: 'gemini-pro',
            duration: 950,
            timestamp: new Date().toISOString(),
          },
        ],
      };
      
      setReport(mockReport);
    } catch (err) {
      setError('Failed to load evaluation report');
      console.error('Error fetching eval report:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log('Exporting report...');
  };

  const handleShare = () => {
    // Share functionality
    console.log('Sharing report...');
  };

  const getPassRate = () => {
    if (!report) return 0;
    return (report.passedTests / report.totalTests) * 100;
  };

  const getStatusColor = (passed: boolean) => {
    return passed ? 'success' : 'error';
  };

  const getStatusIcon = (passed: boolean) => {
    return passed ? <CheckCircle /> : <Cancel />;
  };

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2, color: 'white' }}>Loading evaluation report...</Typography>
      </Box>
    );
  }

  if (error || !report) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error || 'Failed to load evaluation report'}
        </Alert>
        <Button
          variant="outlined"
          startIcon={<Refresh />}
          onClick={() => fetchEvalReport(evalId!)}
          sx={{ color: 'white', borderColor: 'white' }}
        >
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3, maxWidth: 1400, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
        <IconButton
          onClick={() => navigate('/evals')}
          sx={{ color: 'white' }}
        >
          <ArrowBack />
        </IconButton>
        <Typography variant="h4" component="h1" sx={{ color: 'white', flex: 1 }}>
          {report.title}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<Share />}
          onClick={handleShare}
          sx={{ color: 'white', borderColor: 'white', mr: 1 }}
        >
          Share
        </Button>
        <Button
          variant="contained"
          startIcon={<Download />}
          onClick={handleExport}
          sx={{ bgcolor: theme.palette.primary.main }}
        >
          Export
        </Button>
      </Box>

      {/* Overview Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Total Tests
              </Typography>
              <Typography variant="h4" sx={{ color: 'white' }}>
                {report.totalTests}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Pass Rate
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.success.main }}>
                {getPassRate().toFixed(1)}%
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Overall Score
              </Typography>
              <Typography variant="h4" sx={{ color: theme.palette.primary.main }}>
                {report.overallScore}/100
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Providers Tested
              </Typography>
              <Typography variant="h4" sx={{ color: 'white' }}>
                {report.providers.length}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Metadata */}
      <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)', mb: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
            Evaluation Details
          </Typography>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <strong>Dataset:</strong> {report.metadata.dataset}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <strong>Author:</strong> {report.metadata.author}
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <strong>Version:</strong> {report.metadata.version}
              </Typography>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <strong>Created:</strong> {new Date(report.createdAt).toLocaleDateString()}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Provider Filter */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" sx={{ color: 'white', mb: 2 }}>
          Filter by Provider
        </Typography>
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
          <Chip
            label="All Providers"
            onClick={() => setSelectedProvider('all')}
            color={selectedProvider === 'all' ? 'primary' : 'default'}
            sx={{ color: selectedProvider === 'all' ? 'white' : 'rgba(255, 255, 255, 0.7)' }}
          />
          {report.providers.map((provider) => (
            <Chip
              key={provider}
              label={provider}
              onClick={() => setSelectedProvider(provider)}
              color={selectedProvider === provider ? 'primary' : 'default'}
              sx={{ color: selectedProvider === provider ? 'white' : 'rgba(255, 255, 255, 0.7)' }}
            />
          ))}
        </Box>
      </Box>

      {/* Results Table */}
      <Card sx={{ bgcolor: 'rgba(39, 16, 67, 0.8)', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <CardContent>
          <Typography variant="h6" gutterBottom sx={{ color: 'white', mb: 2 }}>
            Test Results
          </Typography>
          <TableContainer component={Paper} sx={{ bgcolor: 'transparent' }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Status</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Prompt</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Expected</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actual</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Provider</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Score</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Duration</TableCell>
                  <TableCell sx={{ color: 'white', fontWeight: 'bold' }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {report.results
                  .filter(result => selectedProvider === 'all' || result.provider === selectedProvider)
                  .map((result) => (
                  <TableRow key={result.id} sx={{ '&:hover': { bgcolor: 'rgba(255, 255, 255, 0.05)' } }}>
                    <TableCell>
                      <Chip
                        icon={getStatusIcon(result.passed)}
                        label={result.passed ? 'Passed' : 'Failed'}
                        color={getStatusColor(result.passed)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell sx={{ color: 'white', maxWidth: 200 }}>
                      <Typography variant="body2" noWrap>
                        {result.prompt}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'white', maxWidth: 150 }}>
                      <Typography variant="body2" noWrap>
                        {result.expected}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'white', maxWidth: 150 }}>
                      <Typography variant="body2" noWrap>
                        {result.actual}
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <Chip label={result.provider} size="small" sx={{ bgcolor: alpha(theme.palette.primary.main, 0.2), color: theme.palette.primary.main }} />
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <Typography variant="body2" sx={{ color: result.score > 0.5 ? theme.palette.success.main : '#EF4444' }}>
                        {(result.score * 100).toFixed(1)}%
                      </Typography>
                    </TableCell>
                    <TableCell sx={{ color: 'white' }}>
                      <Typography variant="body2">
                        {result.duration}ms
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Tooltip title="View Details">
                        <IconButton size="small" sx={{ color: 'white' }}>
                          <Visibility />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
};

export default EvalReportPage; 