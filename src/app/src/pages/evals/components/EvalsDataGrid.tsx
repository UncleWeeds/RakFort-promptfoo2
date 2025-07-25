import { useMemo, useEffect, useState, useRef, forwardRef } from 'react';
import { callApi } from '@app/utils/api';
import { Box, Typography, Paper, CircularProgress, useTheme, Link } from '@mui/material';
import {
  DataGrid,
  type GridColDef,
  GridToolbarContainer,
  GridToolbarColumnsButton,
  GridToolbarFilterButton,
  GridToolbarDensitySelector,
  GridToolbarQuickFilter,
  type GridRowSelectionModel,
  type GridRenderCellParams,
  GridToolbarExportContainer,
  GridCsvExportMenuItem,
  type GridToolbarQuickFilterProps,
} from '@mui/x-data-grid';
import invariant from '@promptfoo/util/invariant';

type Eval = {
  createdAt: number;
  datasetId: string;
  description: string | null;
  evalId: string;
  isRedteam: number;
  label: string;
  numTests: number;
  passRate: number;
};

// augment the props for the toolbar slot
declare module '@mui/x-data-grid' {
  interface ToolbarPropsOverrides {
    showUtilityButtons: boolean;
    focusQuickFilterOnMount: boolean;
  }
}

const GridToolbarExport = () => (
  <GridToolbarExportContainer>
    <GridCsvExportMenuItem />
  </GridToolbarExportContainer>
);

const QuickFilter = forwardRef<HTMLInputElement, GridToolbarQuickFilterProps>((props, ref) => {
  const theme = useTheme();
  return (
    <GridToolbarQuickFilter
      {...props}
      inputRef={ref}
      sx={{
        '& .MuiInputBase-root': {
          borderRadius: 2,
          backgroundColor: theme.palette.background.paper,
        },
      }}
    />
  );
});

QuickFilter.displayName = 'QuickFilter';

function CustomToolbar({
  showUtilityButtons,
  focusQuickFilterOnMount,
}: {
  showUtilityButtons: boolean;
  focusQuickFilterOnMount: boolean;
}) {
  const theme = useTheme();
  const quickFilterRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusQuickFilterOnMount && quickFilterRef.current) {
      quickFilterRef.current.focus();
    }
  }, [focusQuickFilterOnMount]);

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
      <QuickFilter ref={quickFilterRef} />
    </GridToolbarContainer>
  );
}

/**
 * Displays a list of evals.
 *
 * @param onEvalSelected - Callback to handle when an eval is selected (via clicking on its id cell).
 * @param focusedEvalId - An optional ID of the eval to focus when the grid loads.
 * @param filterByDatasetId - Whether to filter the evals by dataset ID. If true, will only show evals with the
 * same dataset ID as the focused eval.
 */
export default function EvalsDataGrid({
  onEvalSelected,
  focusedEvalId,
  showUtilityButtons = false,
  filterByDatasetId = false,
  focusQuickFilterOnMount = false,
}: {
  onEvalSelected: (evalId: string) => void;
  focusedEvalId?: string;
  showUtilityButtons?: boolean;
  filterByDatasetId?: boolean;
  focusQuickFilterOnMount?: boolean;
}) {
  if (filterByDatasetId) {
    invariant(focusedEvalId, 'focusedEvalId is required when filterByDatasetId is true');
  }

  const [evals, setEvals] = useState<Eval[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const [rowSelectionModel, setRowSelectionModel] = useState<GridRowSelectionModel>(
    focusedEvalId ? [focusedEvalId] : [],
  );

  /**
   * Fetch evals from the API.
   */
  useEffect(() => {
    const fetchEvals = async () => {
      try {
        const response = await callApi('/results', { cache: 'no-store' });
        if (!response.ok) {
          throw new Error('Failed to fetch evals');
        }
        const body = (await response.json()) as { data: Eval[] };
        setEvals(body.data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchEvals();
  }, []);

  /**
   * Construct dataset rows:
   * 1. Filter out the focused eval from the list.
   * 2. Filter by dataset ID if enabled.
   */
  const rows = useMemo(() => {
    let rows_ = evals;

    if (focusedEvalId && rows_.length > 0) {
      // Filter out the focused eval from the list; first find it for downstream filtering.
      const focusedEval = rows_.find(({ evalId }: Eval) => evalId === focusedEvalId);
      invariant(focusedEval, 'focusedEvalId is not a valid eval ID');

      rows_ = rows_.filter(({ evalId }: Eval) => evalId !== focusedEvalId);

      // Filter by dataset ID if enabled
      if (filterByDatasetId) {
        rows_ = rows_.filter(({ datasetId }: Eval) => datasetId === focusedEval.datasetId);
      }
    }

    return rows_;
  }, [evals, filterByDatasetId, focusedEvalId]);

  const handleCellClick = (params: any) => onEvalSelected(params.row.evalId);

  const columns: GridColDef<Eval>[] = useMemo(
    () =>
      [
        {
          field: 'evalId',
          headerName: 'ID',
          flex: 0.5,
          renderCell: (params: GridRenderCellParams<Eval>) => (
            <Link
            sx={{color:'#fff'}}
              href={`/eval/${params.row.evalId}`}
              onClick={(e) => {
                e.preventDefault();
                onEvalSelected(params.row.evalId);
                return false;
              }}
            >
              {params.row.evalId}
            </Link>
          ),
        },
        {
          field: 'createdAt',
          headerName: 'Created',
          flex: 1,
          valueFormatter: (value: Eval['createdAt']) => new Date(value).toLocaleString(),
        },
        {
          field: 'description',
          headerName: 'Description',
          flex: 1,
          valueGetter: (value: Eval['description'], row: Eval) => value ?? row.label,
        },
        {
          field: 'passRate',
          headerName: 'Pass Rate',
          flex: 0.5,
          type: 'number',
          renderCell: (params: GridRenderCellParams<Eval>) => (
            <>
              <Typography
                variant="body2"
                color={
                  params.value >= 90
                    ? 'success.main'
                    : params.value >= 60
                      ? 'warning.main'
                      : 'error.main'
                }
                sx={{
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'end',
                }}
              >
                {params.value.toFixed(2)}%
              </Typography>
            </>
          ),
        },
        {
          field: 'numTests',
          headerName: '# Tests',
          type: 'number',
          flex: 0.5,
        },
      ].filter(Boolean) as GridColDef<Eval>[],
    [],
  );

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
          rows={rows}
          columns={columns}
          loading={isLoading}
          getRowId={(row) => row.evalId}
          onRowClick={handleCellClick}
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
                  Loading evals...
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
                {(error as Error | null) ? (
                  <>
                    <Box sx={{ fontSize: '2rem', mb: 2 }}>⚠️</Box>
                    <Typography variant="h6" gutterBottom color="error">
                      Error loading evals
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {(error as Error).message}
                    </Typography>
                  </>
                ) : (
                  <>
                    <Box sx={{ fontSize: '2rem', mb: 2 }}>🔍</Box>
                    <Typography variant="h6" gutterBottom>
                      No evals found
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Create an eval to start evaluating your AI responses
                    </Typography>
                  </>
                )}
              </Box>
            ),
          }}
          slotProps={{ toolbar: { showUtilityButtons: true } }}
          sx={{
            border: 'none',
            height: '100%',
            width: '100%',
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
              sortModel: [{ field: 'createdAt', sort: 'desc' }],
            },
            pagination: {
              paginationModel: { pageSize: 25 },
            },
          }}
          pageSizeOptions={[10, 25, 50, 100]}
        />
      </Paper>
    </Box>
  );
}
