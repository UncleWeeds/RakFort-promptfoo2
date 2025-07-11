import React, { forwardRef, useMemo } from "react";
import { navbarLinks } from "../constants/index";
import { NavLink } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

interface NavbarLinkItem {
  label: string;
  path: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
}

interface NavbarLinkGroup {
  title: string;
  links: NavbarLinkItem[];
}

interface DrawerProps {
  collapsed?: boolean;
}

interface DrawerNavLinkProps extends NavbarLinkItem {
  collapsed: boolean;
  linkBaseStyle: React.CSSProperties;
  collapsedLinkStyle: React.CSSProperties;
  expandedLinkStyle: React.CSSProperties;
  activeLinkStyle: React.CSSProperties;
  drawerLabelStyle: React.CSSProperties;
}

const DrawerNavLink = React.memo(({
  label,
  path,
  icon: Icon,
  collapsed,
  linkBaseStyle,
  collapsedLinkStyle,
  expandedLinkStyle,
  activeLinkStyle,
  drawerLabelStyle,
}: DrawerNavLinkProps) => (
  <NavLink
    key={label}
    to={path}
    style={({ isActive }) => ({
      ...linkBaseStyle,
      ...(collapsed ? collapsedLinkStyle : expandedLinkStyle),
      ...(isActive ? activeLinkStyle : {}),
    })}
  >
    <Icon size={22} />
    {!collapsed && <span style={drawerLabelStyle}>{label}</span>}
  </NavLink>
));

export const Drawer = forwardRef<HTMLElement, DrawerProps>(({ collapsed = false }, ref) => {
  const theme = useTheme();
  // Memoized styles
  const drawerStyle = useMemo<React.CSSProperties>(() => ({
    position: "fixed",
    zIndex: 100,
    height: "100%",
    display: "flex",
    flexDirection: "column",
    overflowX: "hidden",
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    transition: "width 300ms, background-color 150ms, border 150ms",
    paddingLeft: 0,
    paddingRight: 0,
    left: "0",
    width: collapsed ? 70 : 240,
  }), [collapsed, theme.palette.primary.main, theme.palette.primary.contrastText]);

  const drawerContentStyle = useMemo<React.CSSProperties>(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "1rem",
    overflowY: "auto",
    padding: "12px",
    width: "100%",
  }), []);

  const drawerSectionStyle = useMemo<React.CSSProperties>(() => ({
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    width: "100%",
  }), []);

  const drawerDividerStyle = useMemo<React.CSSProperties>(() => ({
    width: "100%",
    border: "1px solid #94a3b8",
    marginBottom: "0.5rem",
  }), []);

  const drawerTitleStyle = useMemo<React.CSSProperties>(() => ({
    fontSize: "0.75rem",
    textTransform: "uppercase",
    fontWeight: 600,
    color: theme.palette.text.secondary,
    paddingLeft: "8px",
  }), []);

  const linkBaseStyle = useMemo<React.CSSProperties>(() => ({
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px 12px",
    borderRadius: "6px",
    textDecoration: "none",
    transition: "background-color 0.2s",
    color: "white",
  }), []);

  const activeLinkStyle = useMemo<React.CSSProperties>(() => ({
    backgroundColor: theme.palette.secondary.light,
    color: theme.palette.primary.main,
  }), []);

  const collapsedLinkStyle = useMemo<React.CSSProperties>(() => ({
    justifyContent: "center",
    width: 45,
  }), []);

  const expandedLinkStyle = useMemo<React.CSSProperties>(() => ({
    width: "100%",
  }), []);

  const drawerLabelStyle = useMemo<React.CSSProperties>(() => ({
    whiteSpace: "nowrap",
    fontSize: "0.875rem",
    fontWeight: 500,
  }), []);

  return (
    <aside ref={ref} style={drawerStyle} aria-label="Sidebar">
      <div style={drawerContentStyle}>
        {(navbarLinks as NavbarLinkGroup[]).map((navbarLink, index) => (
          <nav key={navbarLink.title} style={drawerSectionStyle}>
            {index !== 0 && <hr style={drawerDividerStyle} />}
            {!collapsed && <p style={drawerTitleStyle}>{navbarLink.title}</p>}
            {navbarLink.links.map((link) => (
              <DrawerNavLink
                key={link.label}
                {...link}
                collapsed={collapsed}
                linkBaseStyle={linkBaseStyle}
                collapsedLinkStyle={collapsedLinkStyle}
                expandedLinkStyle={expandedLinkStyle}
                activeLinkStyle={activeLinkStyle}
                drawerLabelStyle={drawerLabelStyle}
              />
            ))}
          </nav>
        ))}
      </div>
    </aside>
  );
});

Drawer.displayName = "Drawer";
