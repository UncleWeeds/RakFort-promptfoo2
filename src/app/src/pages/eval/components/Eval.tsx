import * as React from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { IS_RUNNING_LOCALLY } from '@app/constants';
import { ShiftKeyProvider } from '@app/contexts/ShiftKeyContext';
import useApiConfig from '@app/stores/apiConfig';
import { callApi } from '@app/utils/api';
import CircularProgress from '@mui/material/CircularProgress';
import type { SharedResults, ResultLightweightWithLabel, ResultsFile } from '@promptfoo/types';
import { io as SocketIOClient } from 'socket.io-client';
import EmptyState from './EmptyState';
import ResultsView from './ResultsView';
import { useResultsViewSettingsStore, useStore } from './store';
import './Eval.css';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';

interface EvalOptions {
  fetchId?: string;
  preloadedData?: SharedResults;
  recentEvals?: ResultLightweightWithLabel[];
  defaultEvalId?: string;
}

export default function Eval({
  fetchId,
  preloadedData,
  recentEvals: recentEvalsProp,
  defaultEvalId: defaultEvalIdProp,
}: EvalOptions) {
  const navigate = useNavigate();
  const { apiBaseUrl } = useApiConfig();

  const {
    table,
    setTable,
    setTableFromResultsFile,
    config,
    setConfig,
    evalId,
    setEvalId,
    setAuthor,
  } = useStore();

  const { setInComparisonMode } = useResultsViewSettingsStore();

  const [loaded, setLoaded] = React.useState(false);
  const [failed, setFailed] = React.useState(false);
  const [recentEvals, setRecentEvals] = React.useState<ResultLightweightWithLabel[]>(
    recentEvalsProp || [],
  );

  const fetchRecentFileEvals = async () => {
    const resp = await callApi(`/results`, { cache: 'no-store' });
    if (!resp.ok) {
      setFailed(true);
      return;
    }
    const body = (await resp.json()) as { data: ResultLightweightWithLabel[] };
    setRecentEvals(body.data);
    return body.data;
  };

  const fetchEvalById = React.useCallback(
    async (id: string) => {
      const resp = await callApi(`/results/${id}`, { cache: 'no-store' });
      if (!resp.ok) {
        setFailed(true);
        return;
      }
      const body = (await resp.json()) as { data: ResultsFile };

      setTableFromResultsFile(body.data);
      setConfig(body.data.config);
      setAuthor(body.data.author);
      setEvalId(id);
    },
    [setTable, setConfig, setEvalId, setAuthor],
  );

  const handleRecentEvalSelection = async (id: string) => {
    navigate(`/eval/?evalId=${encodeURIComponent(id)}`);
  };

  const [defaultEvalId, setDefaultEvalId] = React.useState<string>(
    defaultEvalIdProp || recentEvals[0]?.evalId,
  );

  const [searchParams] = useSearchParams();
  const searchEvalId = searchParams.get('evalId');

  React.useEffect(() => {
    const evalId = searchEvalId || fetchId;
    if (evalId) {
      console.log('Eval init: Fetching eval by id', { searchEvalId, fetchId });
      const run = async () => {
        await fetchEvalById(evalId);
        setLoaded(true);
        setDefaultEvalId(evalId);
        // Load other recent eval runs
        fetchRecentFileEvals();
      };
      run();
    } else if (preloadedData) {
      console.log('Eval init: Using preloaded data');
      setTableFromResultsFile(preloadedData.data);
      setConfig(preloadedData.data.config);
      setAuthor(preloadedData.data.author || null);
      setLoaded(true);
    } else if (IS_RUNNING_LOCALLY) {
      console.log('Eval init: Using local server websocket');

      const socket = SocketIOClient(apiBaseUrl || '');

      socket.on('init', (data) => {
        console.log('Initialized socket connection', data);
        setLoaded(true);
        setTableFromResultsFile(data);
        setConfig(data?.config);
        setAuthor(data?.author || null);
        fetchRecentFileEvals().then((newRecentEvals) => {
          if (newRecentEvals && newRecentEvals.length > 0) {
            setDefaultEvalId(newRecentEvals[0]?.evalId);
            setEvalId(newRecentEvals[0]?.evalId);
            console.log('setting default eval id', newRecentEvals[0]?.evalId);
          }
        });
      });

      socket.on('update', (data) => {
        console.log('Received data update', data);
        setTableFromResultsFile(data);
        setConfig(data.config);
        setAuthor(data.author || null);
        fetchRecentFileEvals().then((newRecentEvals) => {
          if (newRecentEvals && newRecentEvals.length > 0) {
            const newId = newRecentEvals[0]?.evalId;
            if (newId) {
              setDefaultEvalId(newId);
              setEvalId(newId);
            }
          }
        });
      });

      return () => {
        socket.disconnect();
      };
    } else {
      console.log('Eval init: Fetching eval via recent');
      // Fetch from server
      const run = async () => {
        const evals = await fetchRecentFileEvals();
        if (evals && evals.length > 0) {
          const defaultEvalId = evals[0].evalId;
          const resp = await callApi(`/results/${defaultEvalId}`);
          const body = await resp.json();
          setTableFromResultsFile(body.data);
          setConfig(body.data.config);
          setAuthor(body.data.author || null);
          setLoaded(true);
          setDefaultEvalId(defaultEvalId);
          setEvalId(defaultEvalId);
        } else {
          return (
            <div className="notice">
              No evals yet. Share some evals to this server and they will appear here.
            </div>
          );
        }
      };
      run();
    }
    setInComparisonMode(false);
  }, [
    apiBaseUrl,
    fetchId,
    setTable,
    setConfig,
    setAuthor,
    setEvalId,
    fetchEvalById,
    preloadedData,
    setDefaultEvalId,
    searchEvalId,
    setInComparisonMode,
  ]);

  React.useEffect(() => {
    document.title = `${config?.description || evalId || 'Eval'} | promptfoo`;
  }, [config, evalId]);

  if (failed) {
    return (
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Paper elevation={2} sx={{ width: '100%', maxWidth: 600, p: 4, bgcolor: 'background.paper', color: 'text.primary', border: '2px solid', borderColor: (theme) => theme.palette.divider, boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(43, 20, 73, 0.15)' : 'rgba(0,0,0,0.08)'}` }}>
          <Typography variant="h5" color="error" align="center">404 Eval not found</Typography>
        </Paper>
      </Box>
    );
  }

  if (loaded && !table) {
    return <EmptyState />;
  }

  if (!loaded || !table) {
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
        <Paper elevation={2} sx={{ width: '100%', maxWidth: 600, p: 4, bgcolor: 'background.paper', color: 'text.primary', border: '2px solid', borderColor: (theme) => theme.palette.divider, boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(43, 20, 73, 0.15)' : 'rgba(0,0,0,0.08)'}` }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <CircularProgress size={22} sx={{ color: '#A259F7' }} />
            <Typography>Waiting for eval data</Typography>
          </Box>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ width: '100%', bgcolor: 'background.paper', color: 'text.primary' }}>
      <Paper elevation={2} sx={{ width: '100%', p: 3, bgcolor: 'background.paper', color: 'text.primary', border: '2px solid', borderColor: (theme) => theme.palette.divider, boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(43, 20, 73, 0.15)' : 'rgba(0,0,0,0.08)'}` }}>
        <ShiftKeyProvider>
          <ResultsView
            defaultEvalId={defaultEvalId}
            recentEvals={recentEvals}
            onRecentEvalSelected={handleRecentEvalSelection}
          />
        </ShiftKeyProvider>
      </Paper>
    </Box>
  );
}
