import React, { useEffect, useState, useRef } from "react";
import {
  Chart,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController,
} from "chart.js";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import SettingsIcon from "@mui/icons-material/Settings";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import SecurityIcon from "@mui/icons-material/Security";
import BugReportIcon from "@mui/icons-material/BugReport";
import { Button } from "@mui/material";
import { Eye, Play, MoreHorizontal, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from '@mui/material/styles';

import ActionButton from "./actionButton";
import StatCard from "./statcard";
import { cn } from "@app/utils/cn";

// Register Chart.js components
Chart.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  DoughnutController
);

// Types
interface EvalSummary {
  evalId: string;
  createdAt: number;
  description: string;
  numTests: number;
  datasetId: string;
  isRedteam: boolean;
  passRate: number;
  label: string;
}

interface DashboardOverview {
  totalEvals: number;
  totalRedTeamRuns: number;
  totalTests: number;
  overallPassRate: string;
  regularEvals: EvalSummary[];
  redTeamEvals: EvalSummary[];
  passRateTrend: Array<{
    date: number;
    passRate: number;
    evalId: string;
  }>;
}

// Badge component
const badgeVariants = {
  base: "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  variant: {
    default: "border-transparent bg-primary text-primary-foreground hover:bg-primary/80",
    secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
    destructive: "border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80",
    outline: "text-foreground border",
  },
};

function Badge({ 
  className = "", 
  variant = "default", 
  ...props 
}: React.HTMLAttributes<HTMLDivElement> & { 
  variant?: keyof typeof badgeVariants.variant; 
}) {
  const variantClass = badgeVariants.variant[variant] || badgeVariants.variant.default;
  return <div className={cn(badgeVariants.base, variantClass, className)} {...props} />;
}

// Chart components
function PassRateTrendChart({ data }: { data: DashboardOverview['passRateTrend'] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Small delay to ensure canvas is ready
    const timeoutId = setTimeout(() => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      try {
        chartInstance.current = new Chart(ctx, {
          type: 'line',
          data: {
            labels: data.map(d => new Date(d.date).toLocaleDateString()),
            datasets: [{
              label: 'Pass Rate (%)',
              data: data.map(d => d.passRate),
              borderColor: theme.palette.primary.main,
              backgroundColor: 'rgba(59, 130, 246, 0.1)',
              borderWidth: 2,
              fill: true,
              tension: 0.4,
              pointBackgroundColor: theme.palette.primary.main,
              pointBorderColor: theme.palette.common.white,
              pointBorderWidth: 2,
              pointRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: theme.palette.common.white,
                bodyColor: theme.palette.common.white,
                borderColor: theme.palette.grey[700],
                borderWidth: 1,
              }
            },
            scales: {
              x: {
                grid: {
                  color: 'rgba(55, 65, 81, 0.3)',
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  maxRotation: 45,
                  minRotation: 0,
                }
              },
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(55, 65, 81, 0.3)',
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, theme.palette]);

  return (
    <div className="w-full h-[300px] relative overflow-hidden">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}

function RedTeamVulnerabilityChart({ data }: { data: EvalSummary[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Small delay to ensure canvas is ready
    const timeoutId = setTimeout(() => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Group by pass rate ranges
      const highRisk = data.filter(e => e.passRate < 50).length;
      const mediumRisk = data.filter(e => e.passRate >= 50 && e.passRate < 80).length;
      const lowRisk = data.filter(e => e.passRate >= 80).length;

      try {
        chartInstance.current = new Chart(ctx, {
          type: 'doughnut',
          data: {
            labels: ['High Risk (<50%)', 'Medium Risk (50-80%)', 'Low Risk (>80%)'],
            datasets: [{
              data: [highRisk, mediumRisk, lowRisk],
              backgroundColor: [
                '#EF4444',
                '#F59E0B',
                '#10B981'
              ],
              borderWidth: 0,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'bottom',
                labels: {
                  color: theme.palette.text.secondary,
                  padding: 20,
                  usePointStyle: true,
                  font: {
                    size: 12
                  }
                }
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: theme.palette.common.white,
                bodyColor: theme.palette.common.white,
                borderColor: theme.palette.grey[700],
                borderWidth: 1,
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, theme.palette]);

  return (
    <div className="w-full h-[300px] relative overflow-hidden">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}

function ProviderComparisonChart({ data }: { data: EvalSummary[] }) {
  const chartRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (!chartRef.current || data.length === 0) return;

    // Clean up existing chart
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null;
    }

    // Small delay to ensure canvas is ready
    const timeoutId = setTimeout(() => {
      if (!chartRef.current) return;
      
      const ctx = chartRef.current.getContext('2d');
      if (!ctx) return;

      // Extract provider info from eval descriptions or IDs
      const providers = ['GPT-4', 'Claude-3', 'Llama-2', 'Other'];
      const providerData = providers.map(provider => {
        const relevantEvals = data.filter(e => 
          e.description?.toLowerCase().includes(provider.toLowerCase()) ||
          e.evalId.toLowerCase().includes(provider.toLowerCase())
        );
        return relevantEvals.length > 0 
          ? relevantEvals.reduce((sum, e) => sum + e.passRate, 0) / relevantEvals.length
          : 0;
      });

      try {
        chartInstance.current = new Chart(ctx, {
          type: 'bar',
          data: {
            labels: providers,
            datasets: [{
              label: 'Average Pass Rate (%)',
              data: providerData,
              backgroundColor: [
                theme.palette.primary.main,
                theme.palette.primary.dark,
                '#F59E0B',
                '#6B7280'
              ],
              borderWidth: 0,
              borderRadius: 4,
            }]
          },
          options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                titleColor: theme.palette.common.white,
                bodyColor: theme.palette.common.white,
                borderColor: theme.palette.grey[700],
                borderWidth: 1,
              }
            },
            scales: {
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  maxRotation: 45,
                  minRotation: 0,
                }
              },
              y: {
                beginAtZero: true,
                max: 100,
                grid: {
                  color: 'rgba(55, 65, 81, 0.3)',
                },
                ticks: {
                  color: theme.palette.text.secondary,
                  callback: function(value) {
                    return value + '%';
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error creating chart:', error);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null;
      }
    };
  }, [data, theme.palette]);

  return (
    <div className="w-full h-[300px] relative overflow-hidden">
      <canvas ref={chartRef} className="w-full h-full" />
    </div>
  );
}

// Main Dashboard Component
const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const theme = useTheme();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/eval/dashboard/overview');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      
      const data = await response.json();
      setOverview(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Dashboard data fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center gap-2 text-slate-400">
          <RefreshCw className="h-5 w-5 animate-spin" />
          Loading dashboard...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="text-red-400 mb-2">Failed to load dashboard</div>
          <Button 
            onClick={fetchDashboardData}
            variant="outlined" 
            className="text-white border-slate-700 hover:bg-slate-700"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!overview) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-slate-400">No data available</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-gray-100">Rakfort Dashboard</h1>
          <p className="text-lg text-gray-300 max-w-2xl">
            Comprehensive evaluation and security assessment overview for your AI models and systems
          </p>
          <p className="text-sm text-gray-400">
            Monitor performance metrics, track security vulnerabilities, and analyze trends across your evaluation runs
          </p>
        </div>
        <div className="flex flex-row gap-3 items-center">
          <ActionButton 
            icon={<FileDownloadIcon />} 
            color={theme.palette.grey[700]}
            onClick={() => navigate('/evals')}
          >
            View All Evals
          </ActionButton>
          <ActionButton 
            icon={<SettingsIcon />} 
            color={theme.palette.grey[700]}
            onClick={() => navigate('/setup')}
          >
            Create Eval
          </ActionButton>
          <ActionButton 
            icon={<PlayArrowIcon />} 
            color={theme.palette.grey[700]}
            onClick={() => navigate('/redteam/setup')}
          >
            Security Assessment
          </ActionButton>
        </div>
      </div>

      {/* Overview Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-blue-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white">Performance Overview</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Key metrics showing the overall health and performance of your evaluation pipeline
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Evaluations"
          value={overview.totalEvals.toLocaleString()}
          change=""
          isPositiveTrend={true}
          icon={<CheckCircleOutlineIcon className="text-green-500" />}
        />
        <StatCard
          title="Security Assessments"
          value={overview.totalRedTeamRuns.toLocaleString()}
          change=""
          isPositiveTrend={true}
          icon={<SecurityIcon className="text-blue-500" />}
        />
        <StatCard
          title="Overall Pass Rate"
          value={`${overview.overallPassRate}%`}
          change=""
          isPositiveTrend={true}
          icon={<TrendingUpIcon className="text-green-500" />}
        />
        <StatCard
          title="Total Test Cases"
          value={overview.totalTests.toLocaleString()}
          change=""
          isPositiveTrend={true}
          icon={<AccessTimeIcon className="text-blue-400" />}
        />
      </div>

      {/* Analytics Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-purple-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white">Analytics & Trends</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Visual insights into performance trends and security risk assessments
        </p>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[400px]">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">Pass Rate Trend</h3>
            <p className="text-sm text-gray-400">
              Track how your model performance has evolved over time across recent evaluations
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <PassRateTrendChart data={overview.passRateTrend} />
          </div>
        </div>
        
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[400px]">
          <div className="mb-4">
            <h3 className="text-xl font-bold text-white mb-2">Security Risk Assessment</h3>
            <p className="text-sm text-gray-400">
              Distribution of security vulnerabilities found in red team assessments
            </p>
          </div>
          <div className="flex-1 min-h-0">
            <RedTeamVulnerabilityChart data={overview.redTeamEvals} />
          </div>
        </div>
      </div>

      {/* Provider Performance Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-green-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white">Provider Performance</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Compare performance across different AI providers and models in your evaluations
        </p>
      </div>

      {/* Provider Comparison */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl min-h-[400px]">
        <div className="mb-4">
          <h3 className="text-xl font-bold text-white mb-2">Provider Performance Comparison</h3>
          <p className="text-sm text-gray-400">
            Side-by-side comparison of different AI providers based on pass rates and test performance
          </p>
        </div>
        <div className="flex-1 min-h-0">
          <ProviderComparisonChart data={overview.regularEvals} />
        </div>
      </div>

      {/* Recent Activity Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-orange-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white">Recent Activity</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Latest evaluation runs and security assessments with detailed performance metrics
        </p>
      </div>

      {/* Recent Activity Tables */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Evals */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Recent Evaluations</h3>
              <p className="text-sm text-gray-400">
                Latest model performance assessments and test results
              </p>
            </div>
            <Button 
              variant="outlined" 
              className="!text-white !border-slate-700 hover:!bg-slate-700"
              onClick={() => navigate('/evals')}
            >
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-2 text-left font-medium">Evaluation</th>
                  <th className="py-3 px-2 text-left font-medium">Tests</th>
                  <th className="py-3 px-2 text-left font-medium">Pass Rate</th>
                  <th className="py-3 px-2 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                                 {overview.regularEvals.map((evalItem) => (
                   <tr 
                     key={evalItem.evalId} 
                     className="border-b border-slate-800/50 hover:bg-slate-800/30 text-slate-300 cursor-pointer transition-colors"
                     onClick={() => navigate(`/eval/${evalItem.evalId}`)}
                   >
                     <td className="py-3 px-2">
                       <div className="font-medium text-white truncate max-w-xs">
                         {evalItem.label || evalItem.evalId}
                       </div>
                     </td>
                     <td className="py-3 px-2">{evalItem.numTests}</td>
                     <td className="py-3 px-2">
                       <span className={`font-medium ${
                         evalItem.passRate >= 80 ? 'text-green-400' : 
                         evalItem.passRate >= 60 ? 'text-yellow-400' : 'text-red-400'
                       }`}>
                         {evalItem.passRate.toFixed(1)}%
                       </span>
                     </td>
                     <td className="py-3 px-2 text-slate-400">
                       {new Date(evalItem.createdAt).toLocaleDateString()}
                     </td>
                   </tr>
                 ))}
                {overview.regularEvals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      No evaluations found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Red Team Runs */}
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Security Assessments</h3>
              <p className="text-sm text-gray-400">
                Recent red team penetration tests and vulnerability assessments
              </p>
            </div>
            <Button 
              variant="outlined" 
              className="!text-white !border-slate-700 hover:!bg-slate-700"
              onClick={() => navigate('/redteam/setup')}
            >
              View All
            </Button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800 text-slate-400">
                  <th className="py-3 px-2 text-left font-medium">Assessment</th>
                  <th className="py-3 px-2 text-left font-medium">Tests</th>
                  <th className="py-3 px-2 text-left font-medium">Risk Level</th>
                  <th className="py-3 px-2 text-left font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                                 {overview.redTeamEvals.map((evalItem) => (
                   <tr 
                     key={evalItem.evalId} 
                     className="border-b border-slate-800/50 hover:bg-slate-800/30 text-slate-300 cursor-pointer transition-colors"
                     onClick={() => navigate(`/eval/${evalItem.evalId}`)}
                   >
                                          <td className="py-3 px-2">
                       <div className="font-medium text-white truncate max-w-xs">
                         {evalItem.label || evalItem.evalId}
                       </div>
                     </td>
                     <td className="py-3 px-2">{evalItem.numTests}</td>
                     <td className="py-3 px-2">
                       <Badge
                         variant="outline"
                         className={
                           evalItem.passRate < 50 ? "bg-red-500/20 text-red-400 border-red-500/30" :
                           evalItem.passRate < 80 ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30" :
                           "bg-green-500/20 text-green-400 border-green-500/30"
                         }
                       >
                         {evalItem.passRate < 50 ? "High Risk" : 
                          evalItem.passRate < 80 ? "Medium Risk" : "Low Risk"}
                       </Badge>
                     </td>
                     <td className="py-3 px-2 text-slate-400">
                       {new Date(evalItem.createdAt).toLocaleDateString()}
                     </td>
                   </tr>
                 ))}
                {overview.redTeamEvals.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-4 text-center text-slate-500">
                      No security assessments found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-1 h-8 bg-indigo-500 rounded-full"></div>
          <h2 className="text-2xl font-semibold text-white">Quick Actions</h2>
        </div>
        <p className="text-gray-300 text-sm">
          Common tasks and actions to help you get started quickly
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Play className="h-5 w-5 text-blue-400" />
            </div>
            <h3 className="font-semibold text-white">Run New Evaluation</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Start a new evaluation to test your AI models against predefined test cases
          </p>
          <Button 
            variant="outlined" 
            size="small" 
            className="!text-blue-400 !border-blue-500/30 hover:!bg-blue-500/20"
            onClick={() => navigate('/setup')}
          >
            Start Eval
          </Button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <BugReportIcon className="h-5 w-5 text-red-400" />
            </div>
            <h3 className="font-semibold text-white">Security Assessment</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Launch a red team assessment to identify security vulnerabilities
          </p>
          <Button 
            variant="outlined" 
            size="small" 
            className="!text-red-400 !border-red-500/30 hover:!bg-red-500/20"
            onClick={() => navigate('/redteam/setup')}
          >
            Start Assessment
          </Button>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl hover:border-slate-700 transition-colors">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500/20 rounded-lg">
              <Eye className="h-5 w-5 text-green-400" />
            </div>
            <h3 className="font-semibold text-white">View Reports</h3>
          </div>
          <p className="text-sm text-gray-400 mb-4">
            Access detailed reports and analytics for all your evaluations
          </p>
          <Button 
            variant="outlined" 
            size="small" 
            className="!text-green-400 !border-green-500/30 hover:!bg-green-500/20"
            onClick={() => navigate('/evals')}
          >
            Browse Reports
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
