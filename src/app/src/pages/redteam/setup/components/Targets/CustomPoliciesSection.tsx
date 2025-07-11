import { useState, useEffect, useCallback, memo } from 'react';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import ExpandLessIcon from '@mui/icons-material/ExpandLess';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { useDebounce } from 'use-debounce';
import { useRedTeamConfig } from '../../hooks/useRedTeamConfig';

interface PolicyInstance {
  id: string;
  name: string;
  policy: string;
  isExpanded: boolean;
}

const PolicyInput = memo(
  ({
    id,
    value,
    onChange,
  }: {
    id: string;
    value: string;
    onChange: (id: string, value: string) => void;
  }) => {
    const [debouncedChange] = useDebounce(onChange, 300);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        debouncedChange(id, e.target.value);
      },
      [id, debouncedChange],
    );

    return (
      <TextField
        label="Policy Text"
        value={value}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        placeholder="Enter your policy guidelines here..."
      />
    );
  },
);

PolicyInput.displayName = 'PolicyInput';

export const CustomPoliciesSection = () => {
  const { config, updateConfig } = useRedTeamConfig();
  const [policies, setPolicies] = useState<PolicyInstance[]>(() => {
    // Initialize from existing config or create a default empty policy
    const existingPolicies = config.plugins
      .filter((p) => typeof p === 'object' && p.id === 'policy')
      .map((p, index) => ({
        id: `policy-${Date.now()}-${index}`,
        name: `Custom Policy ${index + 1}`,
        policy: (p as { config: { policy: string } }).config.policy,
        isExpanded: true,
      }));

    return existingPolicies.length
      ? existingPolicies
      : [
          {
            id: `policy-${Date.now()}`,
            name: 'Custom Policy 1',
            policy: '',
            isExpanded: true,
          },
        ];
  });

  const [debouncedPolicies] = useDebounce(policies, 500);

  useEffect(() => {
    if (
      debouncedPolicies.length === 0 &&
      !config.plugins.some((p) => typeof p === 'object' && p.id === 'policy')
    ) {
      return;
    }

    const policyPlugins = debouncedPolicies
      .filter((policy) => policy.policy.trim() !== '')
      .map((policy) => ({
        id: 'policy',
        config: {
          policy: policy.policy,
        },
      }));

    const otherPlugins = config.plugins.filter((p) =>
      typeof p === 'string' ? true : p.id !== 'policy',
    );

    const currentPolicies = JSON.stringify(
      config.plugins.filter((p) => typeof p === 'object' && p.id === 'policy'),
    );
    const newPolicies = JSON.stringify(policyPlugins);

    if (currentPolicies !== newPolicies) {
      updateConfig('plugins', [...otherPlugins, ...policyPlugins]);
    }
  }, [debouncedPolicies]);

  const handlePolicyChange = useCallback((policyId: string, newValue: string) => {
    setPolicies((prev) => prev.map((p) => (p.id === policyId ? { ...p, policy: newValue } : p)));
  }, []);

  const handleAddPolicy = () => {
    const newPolicy: PolicyInstance = {
      id: `policy-${Date.now()}`,
      name: `Custom Policy ${policies.length + 1}`,
      policy: '',
      isExpanded: true,
    };
    setPolicies([...policies, newPolicy]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 2 }}>
      <Typography variant="body2" sx={{ color: '#fff' }}>
        Custom policies define rules that the AI should follow. These are used to test if the AI
        adheres to your specific guidelines and constraints.
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        <Button
          startIcon={<AddIcon />}
          onClick={handleAddPolicy}
          variant="contained"
          sx={{ backgroundColor: '#A259F7', color: '#fff', borderRadius: 2, fontWeight: 600, '&:hover': { backgroundColor: '#8e3be8' } }}
        >
          Add Policy
        </Button>
      </Box>

      <Stack spacing={2}>
        {policies.map((policy) => (
          <Box
            key={policy.id}
            sx={{
              border: '1px solid #444',
              borderTopLeftRadius: '12px',
              borderTopRightRadius: '12px',
              borderBottomLeftRadius: 0,
              borderBottomRightRadius: 0,
              p: 2,
              backgroundColor: '#2B1449',
              boxShadow: '0 2px 8px 0 rgba(0,0,0,0.08)',
              mb: 2,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TextField
                label="Policy Name"
                value={policy.name}
                onChange={(e) => {
                  setPolicies((prev) => prev.map((p) => (p.id === policy.id ? { ...p, name: e.target.value } : p)));
                }}
                size="small"
                fullWidth
                InputLabelProps={{ style: { color: '#fff' } }}
                inputProps={{ style: { color: '#fff' } }}
                slotProps={{ input: { sx: { backgroundColor: '#22103B' } } }}
              />
              <IconButton
                onClick={() => {
                  setPolicies((prev) => prev.map((p) => (p.id === policy.id ? { ...p, isExpanded: !p.isExpanded } : p)));
                }}
                sx={{ color: '#fff' }}
              >
                {policy.isExpanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
              </IconButton>
              <IconButton
                onClick={() => setPolicies((prev) => prev.filter((p) => p.id !== policy.id))}
                sx={{ color: '#fff' }}
              >
                <DeleteIcon />
              </IconButton>
            </Box>

            <Collapse in={policy.isExpanded}>
              <Box sx={{ mt: 2 }}>
                <PolicyInput id={policy.id} value={policy.policy} onChange={handlePolicyChange} />
              </Box>
            </Collapse>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default memo(CustomPoliciesSection);
