import React, { useMemo, useState } from 'react';
import {
  Apps as AppIcon,
  Extension as PluginIcon,
  FolderOpen as FolderOpenIcon,
  GpsFixed as TargetIcon,
  Psychology as StrategyIcon,
  RateReview as ReviewIcon,
  RestartAlt as RestartAltIcon,
  Save as SaveIcon,
  Close as CloseIcon,
  Menu as MenuIcon,
} from '@mui/icons-material';

interface SidebarProps {
  configName: string;
  configDate: string | null;
  hasUnsavedChanges: boolean;
  onSave: () => void;
  onOpenSave: () => void;
  onOpenLoad: () => void;
  onOpenReset: () => void;
  pluginsCount: number;
  strategiesCount: number;
  value: number;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

interface TabButtonProps {
  tab: { label: string; icon: React.ReactNode };
  index: number;
  isActive: boolean;
  isOpen: boolean;
  onChange: (event: React.SyntheticEvent, newValue: number) => void;
}

const TabButton = React.memo(({ tab, index, isActive, isOpen, onChange }: TabButtonProps) => (
  <button
    onClick={(e) => onChange(e, index)}
    className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-left 
      hover:bg-[#2B2B40] transition-all
      ${isActive ? 'bg-[#3A3A55] text-white' : 'text-gray-300'}
      ${!isOpen ? 'justify-center px-3' : ''}
    `}
    aria-current={isActive ? 'page' : undefined}
  >
    {tab.icon}
    {isOpen && tab.label}
  </button>
));

const Sidebar: React.FC<SidebarProps> = React.memo(({
  configName,
  configDate,
  hasUnsavedChanges,
  onSave,
  onOpenSave,
  onOpenLoad,
  onOpenReset,
  pluginsCount,
  strategiesCount,
  value,
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const redteamTabs = useMemo(() => [
    { label: 'Usage Details', icon: <AppIcon fontSize="small" /> },
    { label: 'Targets', icon: <TargetIcon fontSize="small" /> },
    {
      label: `Plugins${pluginsCount ? ` (${pluginsCount})` : ''}`,
      icon: <PluginIcon fontSize="small" />,
    },
    {
      label: `Strategies${strategiesCount ? ` (${strategiesCount})` : ''}`,
      icon: <StrategyIcon fontSize="small" />,
    },
    { label: 'Review', icon: <ReviewIcon fontSize="small" /> },
  ], [pluginsCount, strategiesCount]);

  return (
    <div
      className={`fixed top-24 right-6 z-50 shadow-xl rounded-2xl border border-white/10 
      bg-[#1c1c28]/60 backdrop-blur-lg flex flex-col overflow-hidden transition-all duration-500
      ${isOpen ? 'w-[300px]' : 'w-14 items-center'}`}
      aria-label="Sidebar"
    >
      {/* Header */}
      <div className="p-4 border-b border-white/10 relative flex items-center justify-between w-full">
        {isOpen ? (
          <h2 className="text-sm font-semibold text-white text-center w-full">
            {configName ? `Config: ${configName}` : 'New Configuration'}
          </h2>
        ) : null}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="absolute top-2 right-2 text-gray-300"
          aria-label={isOpen ? 'Close Sidebar' : 'Open Sidebar'}
        >
          {isOpen ? <CloseIcon fontSize="small" /> : <MenuIcon fontSize="small" />}
        </button>
      </div>

      {/* Unsaved warning or last saved */}
      {isOpen && hasUnsavedChanges ? (
        <div className="px-4 py-2 text-sm text-yellow-300 bg-yellow-900/30 flex items-center justify-between">
          <span className="flex items-center gap-1">
            <span className="text-lg">●</span> Unsaved changes
          </span>
          <button
            onClick={onSave}
            disabled={!configName}
            className="text-xs px-2 py-1 border border-yellow-300 text-yellow-300 rounded hover:bg-yellow-800"
          >
            Save
          </button>
        </div>
      ) : isOpen && configDate ? (
        <div className="px-4 py-2 text-[0.75rem] text-gray-400">
          Last saved: {new Date(configDate).toLocaleString()}
        </div>
      ) : null}

      {/* Tabs */}
      <div className="flex-1 overflow-y-auto divide-y divide-white/10 w-full">
        {redteamTabs.map((tab, index) => (
          <TabButton
            key={index}
            tab={tab}
            index={index}
            isActive={value === index}
            isOpen={isOpen}
            onChange={onChange}
          />
        ))}
      </div>

      {/* Footer */}
      {isOpen && (
        <>
          <hr className="border-white/10" />
          <div className="p-4 bg-white/5 backdrop-blur-md border-t border-white/10 flex flex-col gap-2">
            <button
              onClick={onOpenSave}
              className="flex items-center gap-2 text-sm text-gray-200 hover:bg-[#2B2B40] px-3 py-2 rounded"
            >
              <SaveIcon fontSize="small" />
              Save Config
            </button>
            <button
              onClick={onOpenLoad}
              className="flex items-center gap-2 text-sm text-gray-200 hover:bg-[#2B2B40] px-3 py-2 rounded"
            >
              <FolderOpenIcon fontSize="small" />
              Load Config
            </button>
            <button
              onClick={onOpenReset}
              className="flex items-center gap-2 text-sm text-gray-200 hover:bg-[#2B2B40] px-3 py-2 rounded"
            >
              <RestartAltIcon fontSize="small" />
              Reset Config
            </button>
          </div>
        </>
      )}
    </div>
  );
});

Sidebar.displayName = 'Sidebar';
export default Sidebar;
