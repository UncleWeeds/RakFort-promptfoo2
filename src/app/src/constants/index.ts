import * as MuiIcons from "@mui/icons-material";
import type { SvgIconComponent } from "@mui/icons-material";

export interface NavbarLinkItem {
  label: string;
  icon: SvgIconComponent;
  path: string;
}

export interface NavbarLinkGroup {
  title: string;
  links: NavbarLinkItem[];
}

// Centralize icon mapping for easy updates
const icons = {
  Article: MuiIcons.Article,
  People: MuiIcons.People,
  VpnKey: MuiIcons.VpnKey,
  Link: MuiIcons.Link,
  WarningAmber: MuiIcons.WarningAmber,
  DocumentScanner: MuiIcons.DocumentScanner,
  Terminal: MuiIcons.Terminal,
  ListAlt: MuiIcons.ListAlt,
  Settings: MuiIcons.Settings,
  Home: MuiIcons.Home,
  History: MuiIcons.History,
  Dataset: MuiIcons.Dataset,
  Prompts: MuiIcons.TextSnippet,
  Eval: MuiIcons.Assessment,
  Report: MuiIcons.Report,
  Login: MuiIcons.Login,
  Dashboard: MuiIcons.Dashboard,
};

export const navbarLinks: NavbarLinkGroup[] = [
  {
    title: "",
    links: [
      { label: "Home", icon: icons.Home, path: "/" },
      { label: "Dashboard", icon: icons.Dashboard, path: "/dashboard" },
      { label: "Datasets", icon: icons.Dataset, path: "/datasets" },
      { label: "Evals", icon: icons.Eval, path: "/evals" },
      { label: "Prompts", icon: icons.Prompts, path: "/prompts" },
      { label: "History", icon: icons.History, path: "/history" },
      { label: "Login", icon: icons.Login, path: "/login" },
    ],
  },
  {
    title: "Red Team",
    links: [
      { label: "Redteam Setup", icon: icons.Link, path: "/redteam/setup" },
      { label: "Report", icon: icons.Report, path: "/report" },
      { label: "Eval Creator", icon: icons.Eval, path: "/setup" },
    ],
  },
  {
    title: "Other",
    links: [
      { label: "Settings", icon: icons.Settings, path: "/settings" },
    ],
  },
];
