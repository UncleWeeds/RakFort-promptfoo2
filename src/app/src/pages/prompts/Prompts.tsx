import React, { useEffect, useRef, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { alpha, useTheme } from '@mui/material/styles';
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarExport,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import type { ServerPromptWithMetadata } from '@promptfoo/types';
import PromptDialog from './PromptDialog';

// augment the props for the toolbar slot
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    showUtilityButtons: boolean;
  }
}

function CustomToolbar({ showUtilityButtons }: { showUtilityButtons: boolean }) {
  const theme = useTheme();
  return (
    <GridToolbarContainer sx={{ p: 1, borderBottom: `1px solid ${theme.palette.divider}` }}>
      {showUtilityButtons && (
        <Box sx={{ display: 'flex', gap: 1 }}>
          <GridToolbarColumnsButton />
          <GridToolbarFilterButton />
          <GridToolbarDensitySelector />
          <GridToolbarExport />
        </Box>
      )}
      <Box sx={{ flexGrow: 1 }} />
      <GridToolbarQuickFilter
        sx={{
          '& .MuiInputBase-root': {
            borderRadius: 2,
            backgroundColor: theme.palette.background.paper,
          },
        }}
      />
    </GridToolbarContainer>
  );
}

interface PromptsProps {
  data: ServerPromptWithMetadata[];
  isLoading: boolean;
  error: string | null;
  showDatasetColumn?: boolean;
}

export default function Prompts({
  data,
  isLoading,
  error,
  showDatasetColumn = true,
}: PromptsProps) {
  const [searchParams] = useSearchParams();
  const [dialogState, setDialogState] = useState<{ open: boolean; selectedIndex: number }>({
    open: false,
    selectedIndex: 0,
  });
  const hasShownPopup = useRef(false);

  const handleClickOpen = (index: number) => {
    setDialogState({ open: true, selectedIndex: index });
  };

  const handleClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  useEffect(() => {
    if (hasShownPopup.current) {
      return;
    }

    const promptId = searchParams.get('id');
    if (promptId) {
      const promptIndex = data.findIndex((prompt) => prompt.id.startsWith(promptId));
      if (promptIndex !== -1) {
        handleClickOpen(promptIndex);
        hasShownPopup.current = true;
      }
    }
  }, [data, searchParams]);

  const columns: GridColDef<ServerPromptWithMetadata>[] = useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        minWidth: 100,
        valueFormatter: (value: ServerPromptWithMetadata['id']) => value.toString().slice(0, 6),
      },
      {
        field: 'prompt',
        headerName: 'Prompt',
        flex: 2,
        minWidth: 300,
        valueGetter: (value: ServerPromptWithMetadata['prompt']) => value.raw,
      },
      {
        field: 'recentEvalDate',
        headerName: 'Most recent eval',
        flex: 1,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<ServerPromptWithMetadata>) => {
          if (!params.value) {
            return (
              <Typography variant="body2" color="text.secondary">
                Unknown
              </Typography>
            );
          }
          return (
            <Link to={`/eval?evalId=${params.row.recentEvalId}`} style={{ textDecoration: 'none' }}>
              <Typography
                variant="body2"
                color="primary"
                fontFamily="monospace"
                sx={{
                  '&:hover': { textDecoration: 'underline' },
                }}
              >
                {params.value}
              </Typography>
            </Link>
          );
        },
      },
      {
        field: 'count',
        headerName: '# Evals',
        flex: 1,
        minWidth: 80,
      },
    ],
    [],
  );

  const handleRowClick = (params: any) => {
    const index = data.findIndex((p) => p.id === params.id);
    if (index !== -1) {
      handleClickOpen(index);
    }
  };

  return (
    <Box
      sx={{
        height: '100%',
        width: '100%',
        bgcolor: (theme) =>
          theme.palette.mode === 'dark'
            ? 'rgba(43, 20, 73, 0.10)'
            : theme.palette.grey[50],
        p: 3,
      }}
    >
      <Paper
        elevation={2}
        sx={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          border: '2px solid',
          borderColor: (theme) => theme.palette.divider,
          boxShadow: (theme) => `0 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(43, 20, 73, 0.15)' : 'rgba(0,0,0,0.08)'}`,
          bgcolor: 'background.paper',
        }}
      >
        <DataGrid
          rows={data}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.id}
          onRowClick={handleRowClick}
          slots={{
            toolbar: CustomToolbar,
            loadingOverlay: () => (
              <Box
                sx={{
                  backgroundColor:'#271243',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  gap: 2,
                }}
              >
                <CircularProgress />
                <Typography variant="body2" color="text.secondary">
                  Loading prompts...
                </Typography>
              </Box>
            ),
            noRowsOverlay: () => (
              <Box
                sx={{
                  textAlign: 'center',
                  color: 'text.secondary',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  p: 3,
                }}
              >
                {error ? (
                  <>
                    <Box sx={{ fontSize: '2rem', mb: 2 }}>⚠️</Box>
                    <Typography variant="h6" gutterBottom color="error">
                      Error loading prompts
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {error}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box sx={{ fontSize: '2rem', mb: 2 }}>🔍</Box>
                    <Typography variant="h6" gutterBottom>
                      No prompts found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a prompt to start evaluating your AI responses
                    </Typography>
                  </>
                )}
              </Box>
            ),
          }}
          slotProps={{ toolbar: { showUtilityButtons: true } }}
          sx={{
            border: 'none',
            '& .MuiDataGrid-row': {
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              '&:hover': {
                backgroundColor: 'rgba(43, 20, 73, 0.18)',
              },
            },
            '& .MuiDataGrid-cell': {
              borderColor: 'divider',
              display: 'flex',
              alignItems: 'center',
            },
            '& .MuiDataGrid-columnHeaders': {
              backgroundColor: '#22103B',
              color: '#fff',
              borderColor: 'divider',
              fontWeight: 700,
              fontSize: '1rem',
              letterSpacing: 0.5,
            },
            '& .MuiDataGrid-footerContainer': {
              backgroundColor: 'background.paper',
              borderTop: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-toolbarContainer': {
              color: '#fff',
              backgroundColor: 'background.paper',
              borderBottom: '1px solid',
              borderColor: 'divider',
            },
            '& .MuiDataGrid-toolbarContainer .MuiButton-root': {
              color: '#fff !important',
            },
            '& .MuiDataGrid-toolbarContainer .MuiSvgIcon-root': {
              color: '#fff !important',
            },
            '& .MuiDataGrid-virtualScroller': {
              backgroundColor: 'background.paper',
            },
          }}
          initialState={{
            sorting: {
              sortModel: [{ field: 'recentEvalDate', sort: 'desc' }],
            },
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Paper>

      {data[dialogState.selectedIndex] && (
        <PromptDialog
          openDialog={dialogState.open}
          handleClose={handleClose}
          selectedPrompt={data[dialogState.selectedIndex]}
          showDatasetColumn={showDatasetColumn}
        />
      )}
    </Box>
  );
}
