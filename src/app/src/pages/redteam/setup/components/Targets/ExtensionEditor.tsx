import React from 'react';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import HelpIcon from '@mui/icons-material/Help';
import {
  Box,
  TextField,
  IconButton,
  Tooltip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';
import Link from '@mui/material/Link';
import { isJavascriptFile } from '@promptfoo/util/file';

interface ValidationError {
  message: string;
}

interface ExtensionEditorProps {
  extensions: string[];
  onExtensionsChange: (extensions: string[]) => void;
  onValidationChange?: (hasErrors: boolean) => void;
}

const FILE_PROTOCOL_PREFIX = 'file://';

const validatePath = (value: string, isTyping: boolean): ValidationError | undefined => {
  if (!value) {
    return undefined;
  }
  if (!value.trim()) {
    return undefined;
  }

  const withoutPrefix = value.replace(FILE_PROTOCOL_PREFIX, '');
  const [filePath, functionName] = withoutPrefix.split(':');

  // During typing, only show format error if they've already typed a colon
  if (isTyping && !value.includes(':')) {
    return undefined;
  }

  if (!filePath || !functionName) {
    return { message: 'Format: /path/to/file.js:hookFunction' };
  }

  // During typing, don't show file type error until they've finished typing the file extension
  if (!isTyping && !isJavascriptFile(filePath) && !filePath.endsWith('.py')) {
    return { message: 'Must be a JavaScript/TypeScript or Python file' };
  }

  return undefined;
};

export default function ExtensionEditor({
  extensions,
  onExtensionsChange,
  onValidationChange,
}: ExtensionEditorProps) {
  const [isTyping, setIsTyping] = React.useState(false);
  const typingTimeoutRef = React.useRef<ReturnType<typeof setTimeout>>();

  const error = React.useMemo(() => validatePath(extensions[0], isTyping), [extensions, isTyping]);

  const handleChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setIsTyping(true);

      // Clear any existing timeout
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      // Set a new timeout to mark typing as finished
      typingTimeoutRef.current = setTimeout(() => {
        setIsTyping(false);
      }, 500);
      const validationResult = validatePath(newValue, true);
      onValidationChange?.(!!validationResult);

      onExtensionsChange([`${FILE_PROTOCOL_PREFIX}${newValue}`]);
    },
    [onExtensionsChange],
  );

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Accordion defaultExpanded={!!extensions.length} sx={{ backgroundColor: '#2B1449' }}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ backgroundColor: '#2B1449' }}>
        <Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography variant="h6" sx={{ color: '#fff' }}>Extension Hook</Typography>
            <Tooltip
              title={
                <Box>
                  <Typography variant="body2" paragraph sx={{ color: '#fff' }}>
                    Run custom code at these lifecycle points:
                  </Typography>
                  <Box component="ul" sx={{ m: 0, pl: '1.2em', color: '#fff' }}>
                    <li>beforeAll - Start of test suite</li>
                    <li>afterAll - End of test suite</li>
                    <li>beforeEach - Before each test</li>
                    <li>afterEach - After each test</li>
                  </Box>
                  <Box sx={{ mt: 1 }}>
                    <Link
                      href="https://www.promptfoo.dev/docs/configuration/reference/#extension-hooks"
                      target="_blank"
                      rel="noopener noreferrer"
                      sx={{ color: '#A259F7', textDecoration: 'underline' }}
                    >
                      View documentation
                    </Link>
                  </Box>
                </Box>
              }
            >
              <IconButton size="small">
                <HelpIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" sx={{ color: '#fff' }}>
            {extensions.length > 0
              ? extensions[0]
              : 'Add custom code to run at specific points in the evaluation lifecycle'}
          </Typography>
        </Box>
      </AccordionSummary>
      <AccordionDetails sx={{ backgroundColor: '#2B1449' }}>
        <Typography variant="body1" sx={{ mb: 2, color: '#fff' }}>
          See{' '}
          <Link
            href="https://www.promptfoo.dev/docs/configuration/reference/#extension-hooks"
            target="_blank"
            rel="noopener"
            sx={{ color: '#A259F7', textDecoration: 'underline' }}
          >
            docs
          </Link>{' '}
          for more details.
        </Typography>
        <Box>
          <TextField
            fullWidth
            size="small"
            placeholder="/path/to/hook.js:extensionHook"
            value={extensions[0]?.replace(FILE_PROTOCOL_PREFIX, '')}
            onChange={handleChange}
            error={!!error}
            helperText={error?.message}
            InputLabelProps={{ style: { color: '#fff' } }}
            inputProps={{ style: { color: '#fff' } }}
            slotProps={{ input: { sx: { backgroundColor: '#22103B' } } }}
            InputProps={{
              startAdornment: (
                <Typography
                  variant="body2"
                  sx={{ mr: 1, userSelect: 'none', color: '#fff' }}
                >
                  file://
                </Typography>
              ),
            }}
          />
        </Box>
      </AccordionDetails>
    </Accordion>
  );
}
