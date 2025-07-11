import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
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
import type { TestCase, TestCasesWithMetadata } from '@promptfoo/types';
import DatasetDialog from './DatasetDialog';

// augment the props for the toolbar slot
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    showUtilityButtons: boolean;
  }
}

function CustomToolbar({ showUtilityButtons }: { showUtilityButtons: boolean }) {
  const theme = useTheme();
  return (
    <GridToolbarContainer sx={{ p: 1,backgroundColor: theme.palette.primary.main, borderBottom: `1px solid ${theme.palette.divider}` }}>
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
            backgroundColor: theme.palette.primary.main,
          },
        }}
      />
    </GridToolbarContainer>
  );
}

interface DatasetsProps {
  data: (TestCasesWithMetadata & { recentEvalDate: string })[];
  isLoading: boolean;
  error: string | null;
}

type DatasetRow = TestCasesWithMetadata & { recentEvalDate: string };

const getVariables = (testCases: DatasetRow['testCases']) => {
  if (!Array.isArray(testCases) || typeof testCases[0] === 'string') {
    return '';
  }
  const allVarsKeys = (testCases as TestCase[]).flatMap((testCase) =>
    Object.keys(testCase.vars || {}),
  );
  const uniqueVarsKeys = Array.from(new Set(allVarsKeys));
  return uniqueVarsKeys.length > 0 ? uniqueVarsKeys.join(', ') : 'None';
};

export default function Datasets({ data, isLoading, error }: DatasetsProps) {
  const [searchParams] = useSearchParams();
  const [dialogState, setDialogState] = React.useState<{ open: boolean; selectedIndex: number }>({
    open: false,
    selectedIndex: 0,
  });
  const hasShownPopup = React.useRef(false);

  const handleClickOpen = (index: number) => {
    setDialogState({ open: true, selectedIndex: index });
  };

  const handleClose = () => {
    setDialogState((prev) => ({ ...prev, open: false }));
  };

  React.useEffect(() => {
    if (hasShownPopup.current) {
      return;
    }

    const testCaseId = searchParams.get('id');
    if (testCaseId) {
      const index = data.findIndex((testCase) => testCase.id.startsWith(testCaseId));
      if (index !== -1) {
        handleClickOpen(index);
        hasShownPopup.current = true;
      }
    }
  }, [data, searchParams]);

  const columns: GridColDef<DatasetRow>[] = React.useMemo(
    () => [
      {
        field: 'id',
        headerName: 'ID',
        flex: 1,
        minWidth: 100,
        valueFormatter: (value: string) => value?.slice(0, 6) || '',
      },
      {
        field: 'testCases',
        headerName: 'Test Cases',
        flex: 1,
        minWidth: 120,
        valueGetter: (value: DatasetRow['testCases'], row: DatasetRow) => value.length,
        renderCell: (params: GridRenderCellParams<DatasetRow>) => `${params.value} test cases`,
      },
      {
        field: 'variables',
        headerName: 'Variables',
        flex: 2,
        minWidth: 200,
        valueGetter: (value: undefined, row: DatasetRow) => getVariables(row.testCases),
      },
      {
        field: 'count',
        headerName: 'Total Evals',
        flex: 1,
        minWidth: 100,
      },
      {
        field: 'prompts',
        headerName: 'Total Prompts',
        flex: 1,
        minWidth: 120,
        valueGetter: (value: DatasetRow['prompts'], row: DatasetRow) => row.prompts?.length || 0,
      },
      {
        field: 'recentEvalDate',
        headerName: 'Latest Eval Date',
        description: 'The date of the most recent eval for this set of test cases',
        flex: 1.5,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<DatasetRow>) => {
          if (!params.value) {
            return (
              <Typography variant="body2" color="text.secondary">
                Unknown
              </Typography>
            );
          }
          return params.value;
        },
      },
      {
        field: 'recentEvalId',
        headerName: 'Latest Eval ID',
        description: 'The ID of the most recent eval for this set of test cases',
        flex: 1.5,
        minWidth: 150,
        renderCell: (params: GridRenderCellParams<DatasetRow>) => {
          if (!params.value) {
            return (
              <Typography variant="body2" color="text.secondary">
                Unknown
              </Typography>
            );
          }
          return (
            <Link to={`/eval?evalId=${params.value}`} style={{ textDecoration: 'none' }}>
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
    ],
    [],
  );

  const handleRowClick = (params: any) => {
    const index = data.findIndex((d) => d.id === params.id);
    if (index !== -1) {
      handleClickOpen(index);
    }
  };

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert
          severity="error"
          sx={{
            '& .MuiAlert-message': {
              width: '100%',
            },
          }}
        >
          {error}
        </Alert>
      </Box>
    );
  }

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
                  Loading datasets...
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
                      Error loading datasets
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {error}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box sx={{ fontSize: '2rem', mb: 2 }}>🔍</Box>
                    <Typography variant="h6" gutterBottom>
                      No datasets found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create a dataset to start evaluating your AI responses
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
        <DatasetDialog
          openDialog={dialogState.open}
          handleClose={handleClose}
          testCase={data[dialogState.selectedIndex]}
        />
      )}
    </Box>
  );
}
