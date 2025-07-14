import { useEffect, useCallback } from 'react';
import { Outlet } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useUIStore } from '@app/stores/uiStore';
import { Drawer } from './Drawer';
import Navigation from './Navigation.tsx';

const createAppTheme = () =>
  createTheme({
    typography: {
      fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      button: {
        textTransform: 'none',
        fontWeight: 500,
      },
    },
    shape: {
      borderRadius: 12,
    },
    palette: {
      mode: 'dark',
      primary: {
        main: '#2B1449',
        light: '#fff',
        dark: '#22103B',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#7904DF',
        light: '#a78bfa',
        dark: '#47258c',
        contrastText: '#ffffff',
      },
      background: {
        default: '#22103B',
        paper: '#22103B',
      },
      text: {
        primary: '#ffffff',
        secondary: '#a0a0a0',
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            textTransform: 'none',
            fontWeight: 500,
            padding: '8px 16px',
            transition: 'all 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-1px)',
            },
          },
          contained: {
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 8px -2px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.06)',
            },
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            borderRadius: '16px',
            border: '1px solid #2c2c2c',
            transition: 'all 0.2s ease-in-out',
            boxShadow: 'none',
            '&:hover': {
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            },
          },
        },
      },
      MuiTableContainer: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            boxShadow: 'none',
            borderRadius: '12px',
            border: '1px solid #2c2c2c',
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            backgroundColor: 'inherit',
            color: '#ffffff',
            fontWeight: 600,
            fontSize: '0.875rem',
          },
          stickyHeader: {
            backgroundColor: '#1e1e1e',
          },
          root: {
            borderBottom: '1px solid #2c2c2c',
          },
        },
      },
      MuiInputBase: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            borderRadius: '8px',
            transition: 'all 0.2s ease-in-out',
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-notchedOutline': {
              transition: 'all 0.2s ease-in-out',
            },
          },
        },
      },
      MuiFormLabel: {
        styleOverrides: {
          root: {
            transition: 'color 0.2s ease-in-out',
            '&.Mui-focused': {
              color: '#3b82f6',
            },
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            backgroundColor: '#1e1e1e',
            boxShadow: 'none',
            borderBottom: '1px solid #2c2c2c',
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            backgroundColor: '#1e1e1e',
            boxShadow: 'none',
            border: '1px solid #2c2c2c',
            '&[class*="elevation"]': {
              boxShadow: 'none',
            },
          },
          elevation1: {
            boxShadow: 'none',
          },
          elevation2: {
            boxShadow: 'none',
          },
          elevation3: {
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
          },
          elevation4: {
            boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)',
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          },
        },
      },
      MuiSwitch: {
        styleOverrides: {
          root: {
            padding: 8,
          },
          track: {
            borderRadius: 22 / 2,
            backgroundColor: '#404040',
          },
          thumb: {
            backgroundColor: '#ffffff',
          },
        },
      },
    },
  });
export default function PageShell() {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  // Remove: const darkMode = useUIStore((state) => state.darkMode);

  // Extract all UI state needed for layout
  const isDrawerCollapsed = useUIStore((state) => state.isDrawerCollapsed);
  const isSidebarOpen = useUIStore((state) => state.isSidebarOpen);

  // If you want to show the right sidebar only on certain routes, define showRightSidebar here:
  // Example: show only on /redteam or /evals routes
  const showRightSidebar = window.location.pathname.startsWith('/redteam') ||
    window.location.pathname.startsWith('/evals');

  const theme = createAppTheme();

  useEffect(() => {
    // Remove: if (darkMode === null) return;
    // Remove: if (darkMode) {
    // Remove:   document.documentElement.setAttribute('data-theme', 'dark');
    // Remove: } else {
    // Remove:   document.documentElement.removeAttribute('data-theme');
    // Remove: }
  }, []);

  // Remove: if (darkMode === null) {
  // Remove:   return null;
  // Remove: }

  return (
    <ThemeProvider theme={theme}>
      <div className="h-screen flex flex-col bg-[#22103B] overflow-hidden">
        {/* Navbar */}
        <header className="fixed top-0 left-0 right-0 z-50">
          <Navigation />
        </header>

        {/* Body */}
        <div className="flex flex-1 pt-[64px] overflow-hidden">
          {/* Sidebar */}
          <aside
            className={`transition-all duration-300 ${
              isDrawerCollapsed ? 'w-16' : 'w-64'
            }`}
          >
            <Drawer collapsed={isDrawerCollapsed} />
          </aside>

          {/* Main Content */}
          <main className="flex-1 overflow-hidden">
            <div className="h-full overflow-y-auto px-4 py-2">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </ThemeProvider>

  );
}