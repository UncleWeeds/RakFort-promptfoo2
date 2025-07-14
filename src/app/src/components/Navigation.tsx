import React, { useState, useCallback, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import EngineeringIcon from '@mui/icons-material/Engineering';
import InfoIcon from '@mui/icons-material/Info';
import MenuIcon from '@mui/icons-material/Menu';
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Toolbar from '@mui/material/Toolbar';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/material/styles';

import { IS_RUNNING_LOCALLY } from '@app/constants';
import { useUIStore } from '../stores/uiStore';
import ApiSettingsModal from './ApiSettingsModal';
import InfoModal from './InfoModal';
import Logo from './Logo';

const NavButton = styled(Button)(({ theme }) => ({
  color: '#ffffff',
  '&:hover': {
    backgroundColor: '#2B1449',
  },
  '&.active': {
    backgroundColor: '#3c1b5e',
  },
}));

const StyledAppBar = styled(AppBar)({
  backgroundColor: '#271243',
  boxShadow: 'none',
});

const NavLink = React.memo(function NavLink({ href, label }: { href: string; label: string }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(href);

  return (
    <Link
      to={href}
      className={`px-3 py-1 rounded text-sm sm:text-base ${
        isActive
          ? 'font-bold text-white bg-[#3c1b5e]'
          : 'text-gray-300 hover:underline hover:text-white'
      }`}
      aria-current={isActive ? 'page' : undefined}
    >
      {label}
    </Link>
  );
});

const CreateDropdown = React.memo(function CreateDropdown() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const location = useLocation();

  const handleClick = useCallback((event: React.MouseEvent<HTMLElement>) => setAnchorEl(event.currentTarget), []);
  const handleClose = useCallback(() => setAnchorEl(null), []);

  const isActive = useMemo(
    () => ['/setup', '/redteam/setup'].some((route) => location.pathname.startsWith(route)),
    [location.pathname]
  );

  return (
    <div className="bg-[#22103B] rounded-3xl">
      <NavButton
        onClick={handleClick}
        endIcon={<ArrowDropDownIcon />}
        className={`text-white ${
          isActive ? 'bg-[#2B1449]' : ''
        } hover:bg-[#2B1449]`}
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <div className="text-white">Create</div>
      </NavButton>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          paper: {
            className: 'bg-[#2B1449] rounded-lg shadow-lg text-white',
            sx: {
              mt: 1,
              borderRadius: 2,
              bgcolor: '#2B1449',
              color: 'white',
              boxShadow: 3,
              '& .MuiMenuItem-root': {
                px: 2,
                py: 1,
                fontSize: '0.9rem',
                '&:hover': {
                  bgcolor: '#3c1b5e',
                },
              },
            },
          },
        }}
      >
        <MenuItem onClick={handleClose} component={Link} to="/setup">
          Eval
        </MenuItem>
        <MenuItem onClick={handleClose} component={Link} to="/redteam/setup">
          Redteam
        </MenuItem>
      </Menu>
    </div>
  );
});

export default function Navigation() {
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [showApiSettingsModal, setShowApiSettingsModal] = useState(false);
  const { isNavbarVisible, isDrawerCollapsed, toggleDrawer, toggleSidebar } = useUIStore();
  const location = useLocation();

  const handleModalToggle = useCallback(() => setShowInfoModal((prev) => !prev), []);
  const handleApiSettingsModalToggle = useCallback(() => setShowApiSettingsModal((prev) => !prev), []);

  const showSidebarButton = useMemo(
    () => location.pathname.startsWith('/redteam') || location.pathname.startsWith('/evals'),
    [location.pathname]
  );

  if (!isNavbarVisible) return null;

  return (
    <>
      <StyledAppBar position="static" className="shadow-md mb-4 h-12">
        <Toolbar className="px-4 py-1 flex justify-between items-center bg-[#271243]">
          {/* Left Section */}
          <div className="flex items-center gap-4">
            <IconButton
              onClick={toggleDrawer}
              className="text-white"
              title="Toggle Drawer"
              aria-label="Toggle Drawer"
            >
              <KeyboardDoubleArrowRightIcon className={isDrawerCollapsed ? '' : 'rotate-180'} />
            </IconButton>
            <Logo />
          </div>

          {/* Center Placeholder */}
          <div className="flex px-4 py-1 items-center justify-between">
            {/* future nav items */}
          </div>

          {/* Right Section */}
          <div className="flex items-center gap-4 ml-auto mr-2 text-white">
            <CreateDropdown />

            <IconButton
              onClick={handleModalToggle}
              className="hover:bg-[#3c1b5e]"
              aria-label="Show Info"
            >
              <InfoIcon className="text-white" />
            </IconButton>

            {IS_RUNNING_LOCALLY && (
              <Tooltip title="API and Sharing Settings">
                <IconButton
                  onClick={handleApiSettingsModalToggle}
                  className="hover:bg-[#3c1b5e]"
                  aria-label="API and Sharing Settings"
                >
                  <EngineeringIcon className="text-white" />
                </IconButton>
              </Tooltip>
            )}

            {showSidebarButton && (
              <IconButton
                onClick={toggleSidebar}
                className="text-white"
                title="Toggle Sidebar"
                aria-label="Toggle Sidebar"
              >
                <MenuIcon />
              </IconButton>
            )}
          </div>
        </Toolbar>
      </StyledAppBar>

      <InfoModal open={showInfoModal} onClose={handleModalToggle} />
      <ApiSettingsModal open={showApiSettingsModal} onClose={handleApiSettingsModalToggle} />
    </>
  );
}
