import React from 'react';
import { Link } from 'react-router-dom';
import Editor from 'react-simple-code-editor';
import { useStore } from '@app/stores/evalConfig';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import UploadIcon from '@mui/icons-material/Upload';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Snackbar from '@mui/material/Snackbar';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import { styled } from '@mui/system';
import yaml from 'js-yaml';
// @ts-expect-error: No types available
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-yaml';
import './YamlEditor.css';
import 'prismjs/themes/prism.css';

interface YamlEditorProps {
  initialConfig?: any;
  readOnly?: boolean;
  initialYaml?: string;
}

// Schema comment that should always be at the top of the YAML file
const YAML_SCHEMA_COMMENT =
  '# yaml-language-server: $schema=https://promptfoo.dev/config-schema.json';

// Ensure the schema comment is at the top of YAML content
const ensureSchemaComment = (yamlContent: string): string => {
  if (!yamlContent.trim().startsWith(YAML_SCHEMA_COMMENT)) {
    return `${YAML_SCHEMA_COMMENT}\n${yamlContent}`;
  }
  return yamlContent;
};

// Format YAML with schema comment
const formatYamlWithSchema = (config: any): string => {
  const yamlContent = yaml.dump(config);
  return ensureSchemaComment(yamlContent);
};

const StyledLink = styled(Link)({
  fontWeight: 'medium',
  textDecoration: 'none',
});

const YamlEditorComponent: React.FC<YamlEditorProps> = ({
  initialConfig,
  readOnly = false,
  initialYaml,
}) => {
  const darkMode = useTheme().palette.mode === 'dark';
  const [code, setCode] = React.useState('');
  // Always start in read-only mode on initial load, but respect the readOnly prop
  const [isReadOnly, setIsReadOnly] = React.useState(true);
  const [parseError, setParseError] = React.useState<string | null>(null);

  const [notification, setNotification] = React.useState<{
    show: boolean;
    message: string;
  }>({ show: false, message: '' });

  const { getTestSuite } = useStore();

  const parseAndUpdateStore = (yamlContent: string) => {
    try {
      // Remove the schema comment for parsing if it exists
      const contentForParsing = yamlContent.replace(YAML_SCHEMA_COMMENT, '').trim();
      const parsedConfig = yaml.load(contentForParsing) as Record<string, any>;

      if (parsedConfig && typeof parsedConfig === 'object') {
        useStore.setState((state) => {
          const newState = {
            ...state,
          };

          if (parsedConfig.description !== undefined) {
            newState.description = parsedConfig.description;
          }

          if (parsedConfig.providers !== undefined) {
            newState.providers = parsedConfig.providers;
          }

          if (parsedConfig.prompts !== undefined) {
            newState.prompts = parsedConfig.prompts;
          }

          if (parsedConfig.tests !== undefined) {
            newState.testCases = parsedConfig.tests;
          }

          if (parsedConfig.defaultTest !== undefined) {
            newState.defaultTest = parsedConfig.defaultTest;
          }

          if (parsedConfig.evaluateOptions !== undefined) {
            newState.evaluateOptions = parsedConfig.evaluateOptions;
          }

          if (parsedConfig.scenarios !== undefined) {
            newState.scenarios = parsedConfig.scenarios;
          }

          if (parsedConfig.extensions !== undefined) {
            newState.extensions = parsedConfig.extensions;
          }

          if (parsedConfig.env !== undefined) {
            newState.env = parsedConfig.env;
          }

          return newState;
        });

        setParseError(null);
        setNotification({ show: true, message: 'Configuration saved successfully' });
        return true;
      } else {
        const errorMsg = 'Invalid YAML configuration';
        setParseError(errorMsg);
        setNotification({ show: true, message: errorMsg });
        return false;
      }
    } catch (err) {
      const errorMsg = `Failed to parse YAML: ${err instanceof Error ? err.message : String(err)}`;
      console.error(errorMsg, err);
      setParseError(errorMsg);
      setNotification({ show: true, message: errorMsg });
      return false;
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        // Ensure the schema comment is at the top
        const contentWithSchema = ensureSchemaComment(content);
        setCode(contentWithSchema);
        if (isReadOnly) {
          setIsReadOnly(false);
        }
        parseAndUpdateStore(contentWithSchema);
      };
      reader.onerror = () => {
        const errorMsg = 'Failed to read the uploaded file';
        setParseError(errorMsg);
        setNotification({ show: true, message: errorMsg });
        setIsReadOnly(false);
      };
      try {
        reader.readAsText(file);
      } catch (err) {
        const errorMsg = `Error loading file: ${err instanceof Error ? err.message : String(err)}`;
        setParseError(errorMsg);
        setNotification({ show: true, message: errorMsg });
        setIsReadOnly(false);
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setNotification({ show: true, message: 'YAML copied to clipboard' });
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  React.useEffect(() => {
    if (initialYaml) {
      setCode(ensureSchemaComment(initialYaml));
    } else if (initialConfig) {
      setCode(formatYamlWithSchema(initialConfig));
    } else {
      const currentConfig = getTestSuite();
      setCode(formatYamlWithSchema(currentConfig));
    }
    // Deliberately omitting getTestSuite from dependencies to avoid potential re-render loops
  }, [initialYaml, initialConfig]);

  return (
    <Box>
      <Box
        sx={{
          mb: 3,
          p: 2,
          bgcolor: '#2B1449',
          borderRadius: 2,
          borderLeft: '4px solid',
          borderColor: '#A259F7',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="subtitle1" fontWeight="bold" color="#A259F7" gutterBottom>
            YAML Configuration
          </Typography>
          <Typography variant="body2" sx={{ color: 'white' }}>
            This configuration defines your evaluation parameters and can be exported for use with
            the promptfoo CLI.
          </Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            <StyledLink target="_blank" to="https://promptfoo.dev/docs/configuration/guide" style={{ color: '#A259F7' }}>
              View documentation →
            </StyledLink>
          </Typography>
        </Box>
        {!readOnly && (
          <Button
            variant={isReadOnly ? 'outlined' : 'contained'}
            sx={{
              color: 'white',
              borderColor: '#A259F7',
              bgcolor: isReadOnly ? 'transparent' : '#A259F7',
              '&:hover': { bgcolor: '#8e44ec', borderColor: '#A259F7' },
              borderRadius: 2,
              ml: 2,
              whiteSpace: 'nowrap',
            }}
            size="small"
            startIcon={isReadOnly ? <EditIcon /> : <SaveIcon />}
            onClick={() => {
              if (isReadOnly) {
                setIsReadOnly(false);
              } else {
                const parseSuccess = parseAndUpdateStore(code);
                if (parseSuccess) {
                  setIsReadOnly(true);
                }
              }
            }}
          >
            {isReadOnly ? 'Edit YAML' : 'Save Changes'}
          </Button>
        )}
      </Box>
      {!readOnly && !isReadOnly && (
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box display="flex" gap={2}>
            <Button variant="text" sx={{ color: '#A259F7' }} startIcon={<UploadIcon />} component="label">
              Upload YAML
              <input type="file" hidden accept=".yaml,.yml" onChange={handleFileUpload} />
            </Button>
            <Button
              variant="text"
              sx={{ color: '#A259F7' }}
              startIcon={<ContentCopyIcon />}
              onClick={handleCopy}
            >
              Copy YAML
            </Button>
          </Box>
        </Box>
      )}
      <Box
        sx={{
          mt: 1,
          bgcolor: '#2B1449',
          borderRadius: 2,
          border: '1px solid #A259F7',
          color: 'white',
          fontFamily: 'monospace',
          fontSize: 14,
          p: 2,
        }}
      >
        <Editor
          value={code}
          onValueChange={setCode}
          highlight={(code: string) => highlight(code, languages.yaml, 'yaml')}
          padding={10}
          style={{
            background: '#2B1449',
            color: 'white',
            fontFamily: 'monospace',
            fontSize: 14,
            minHeight: 200,
            borderRadius: 8,
            outline: 'none',
          }}
          readOnly={readOnly || isReadOnly}
        />
        {parseError && (
          <Typography variant="body2" sx={{ color: '#ff7675', mt: 1 }}>
            {parseError}
          </Typography>
        )}
      </Box>
      <Snackbar
        open={notification.show}
        autoHideDuration={3000}
        onClose={() => setNotification({ show: false, message: '' })}
        message={notification.message}
        ContentProps={{ sx: { bgcolor: '#2B1449', color: 'white', borderRadius: 2 } }}
      />
    </Box>
  );
};

export default YamlEditorComponent;
