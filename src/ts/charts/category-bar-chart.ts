import { Chart } from './chart-setup';
import { getChartTheme } from './chart-theme';
import type { Chart as ChartInstance } from 'chart.js';
import type { DashboardBarItem } from '../types/analytics.types';

/** Responsive horizontal bar chart for dashboard category totals. */
export function createCategoryBarChart(
  canvas: HTMLCanvasElement,
  items: DashboardBarItem[],
): ChartInstance<'bar', number[], string> {
  const theme = getChartTheme();
  const labels = items.map(item => item.label);
  const values = items.map(item => Number.isFinite(item.value) ? Math.max(0, item.value) : 0);

  return new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Current count',
        data: values,
        backgroundColor: items.map(item => item.color),
        borderRadius: 5,
        borderSkipped: false,
        barThickness: 'flex',
        maxBarThickness: 26,
      }],
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      animation: { duration: 250 },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          align: 'end',
          labels: { usePointStyle: true, pointStyle: 'rectRounded', color: theme.muted, font: { family: theme.fontFamily, size: 10 } },
        },
        tooltip: {
          enabled: true,
          backgroundColor: theme.text,
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: theme.border,
          borderWidth: 1,
          padding: 10,
          callbacks: {
            label: context => ` ${context.dataset.label}: ${Number(context.raw || 0).toLocaleString()}`,
          },
        },
      },
      scales: {
        x: {
          beginAtZero: true,
          min: 0,
          ticks: {
            precision: 0,
            color: theme.muted,
            font: { family: theme.fontFamily, size: 10 },
          },
          grid: { color: theme.border },
          border: { display: false },
        },
        y: {
          ticks: {
            autoSkip: false,
            color: theme.text,
            font: { family: theme.fontFamily, size: 10 },
          },
          grid: { display: false },
          border: { display: false },
        },
      },
    },
  });
}
