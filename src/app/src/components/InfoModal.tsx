import React from 'react';
import BugReportIcon from '@mui/icons-material/BugReport';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ForumIcon from '@mui/icons-material/Forum';
import GitHubIcon from '@mui/icons-material/GitHub';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import WorkIcon from '@mui/icons-material/Work';
import SecurityIcon from '@mui/icons-material/Security';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';

const links: { icon: React.ReactNode; text: string; href: string; description?: string }[] = [
  {
    icon: <MenuBookIcon fontSize="small" />,
    text: 'Documentation',
    href: 'https://www.promptfoo.dev/docs/intro',
    description: 'Learn how to use Rakfort-promptfoo effectively',
  },
  {
    icon: <GitHubIcon fontSize="small" />,
    text: 'GitHub Repository',
    href: 'https://github.com/promptfoo/promptfoo',
    description: 'View source code and contribute',
  },
  {
    icon: <BugReportIcon fontSize="small" />,
    text: 'File an Issue',
    href: 'https://github.com/promptfoo/promptfoo/issues',
    description: 'Report bugs or request features',
  },
  {
    icon: <ForumIcon fontSize="small" />,
    text: 'Join Our Discord Community',
    href: 'https://discord.gg/promptfoo',
    description: 'Connect with other users and developers',
  },
  {
    icon: <CalendarTodayIcon fontSize="small" />,
    text: 'Book a Meeting',
    href: 'https://cal.com/team/promptfoo/intro2',
    description: 'Schedule a consultation or demo',
  },
  {
    icon: <WorkIcon fontSize="small" />,
    text: 'Careers',
    href: 'https://www.promptfoo.dev/careers/',
    description: 'Join our team and help build the future',
  },
];

export default function InfoModal<T extends { open: boolean; onClose: () => void }>({
  open,
  onClose,
}: T) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      aria-labelledby="about-rakfort-promptfoo-dialog-title"
      PaperProps={{
        sx: {
          bgcolor: '#2B1449',
          color: 'white',
          borderRadius: 3,
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
        },
      }}
    >
      <DialogTitle id="about-rakfort-promptfoo-dialog-title">
        <Stack spacing={2}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              width: 48,
              height: 48,
              borderRadius: 2,
              bgcolor: '#A259F7',
              color: 'white',
            }}>
              <AutoAwesomeIcon fontSize="large" />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: 'white' }}>
                Rakfort-promptfoo
              </Typography>
              <Link
                href="https://github.com/promptfoo/promptfoo/releases"
                underline="none"
                sx={{ color: '#A259F7' }}
                target="_blank"
              >
                <Typography variant="subtitle2" sx={{ color: '#A259F7' }}>
                  Version {import.meta.env.VITE_PROMPTFOO_VERSION}
                </Typography>
              </Link>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
            <Chip 
              icon={<SecurityIcon />} 
              label="Red Team" 
              size="small" 
              sx={{ bgcolor: '#A259F7', color: 'white' }}
            />
            <Chip 
              icon={<AutoAwesomeIcon />} 
              label="AI Evaluation" 
              size="small" 
              sx={{ bgcolor: '#A259F7', color: 'white' }}
            />
            <Chip 
              label="MIT Licensed" 
              size="small" 
              sx={{ bgcolor: '#3A2060', color: 'white' }}
            />
          </Box>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" sx={{ color: 'white', mb: 3, lineHeight: 1.6 }}>
          Rakfort-promptfoo is a powerful MIT-licensed open-source platform for evaluating and red-teaming Large Language Models (LLMs). 
          We provide comprehensive tools for tracking model performance, generating datasets, and implementing automated grading systems 
          to ensure your AI applications are robust, secure, and reliable.
        </Typography>
        <Divider sx={{ my: 2, borderColor: '#A259F7' }} />
        <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
          Resources & Community
        </Typography>
        <Stack spacing={2}>
          {links.map((item, index) => (
            <Box
              key={index}
              sx={{
                p: 2,
                borderRadius: 2,
                bgcolor: '#22103B',
                border: '1px solid transparent',
                transition: 'all 0.2s ease',
                '&:hover': {
                  borderColor: '#A259F7',
                  bgcolor: '#3A2060',
                  transform: 'translateY(-1px)',
                },
              }}
            >
              <Stack direction="row" spacing={2} alignItems="flex-start">
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  width: 32,
                  height: 32,
                  borderRadius: 1,
                  bgcolor: '#A259F7',
                  color: 'white',
                  flexShrink: 0,
                }}>
                  {item.icon}
                </Box>
                <Box sx={{ flex: 1 }}>
                  <Link
                    underline="none"
                    target="_blank"
                    href={item.href}
                    sx={{ color: 'white', textDecoration: 'none' }}
                  >
                    <Typography variant="subtitle1" sx={{ fontWeight: 600, color: 'white' }}>
                      {item.text}
                    </Typography>
                  </Link>
                  {item.description && (
                    <Typography variant="body2" sx={{ color: '#A259F7', mt: 0.5 }}>
                      {item.description}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
          ))}
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: 3, pt: 1 }}>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            bgcolor: '#A259F7',
            color: 'white',
            borderRadius: 2,
            px: 3,
            py: 1,
            fontWeight: 600,
            '&:hover': {
              bgcolor: '#8e44ec',
            },
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
}
