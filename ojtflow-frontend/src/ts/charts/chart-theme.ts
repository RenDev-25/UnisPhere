
import { Chart } from './chart-setup';

export interface ChartTheme {
  brand: string;
  navy: string;
  success: string;
  warning: string;
  critical: string;
  text: string;
  muted: string;
  border: string;
  surface: string;
  fontFamily: string;
}

function getToken(name: string, fallback: string): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();

  return value || fallback;
}

export function getChartTheme(): ChartTheme {
  return {
    brand: getToken('--color-brand', '#b00d26'),
    navy: getToken('--color-navy', '#1e3a8a'),
    success: getToken('--color-success', '#16a34a'),
    warning: getToken('--color-warning', '#d97706'),
    critical: getToken('--color-critical', '#dc2626'),
    text: getToken('--color-on-surface', '#0b1c30'),
    muted: getToken('--color-text-muted', '#64748b'),
    border: getToken('--color-border', '#e2e8f0'),
    surface: getToken('--color-surface-container-lowest', '#ffffff'),
    fontFamily: getToken('--font-family', 'Inter, system-ui, sans-serif'),
  };
}

export function applyChartTheme(): void {
  const theme = getChartTheme();

  Chart.defaults.font.family = theme.fontFamily;
  Chart.defaults.font.size = 12;
  Chart.defaults.color = theme.muted;

  Chart.defaults.plugins.tooltip.backgroundColor = theme.text;
  Chart.defaults.plugins.tooltip.titleColor = '#ffffff';
  Chart.defaults.plugins.tooltip.bodyColor = '#ffffff';
  Chart.defaults.plugins.tooltip.borderColor = theme.border;
  Chart.defaults.plugins.tooltip.borderWidth = 1;
  Chart.defaults.plugins.tooltip.padding = 12;
  Chart.defaults.plugins.tooltip.cornerRadius = 8;
}
