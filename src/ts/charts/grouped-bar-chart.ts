
import { Chart } from './chart-setup';
import { getChartTheme } from './chart-theme';
import type { Chart as ChartInstance, Plugin } from 'chart.js';

// ==========================================
// TYPES
// ==========================================

export interface MonthPoint {
  month: string;
  applications: number;
  placements: number;
  projected?: boolean;
}

// ==========================================
// COLORS
// ==========================================

const COLORS = {
  applications: '#b00d26',
  placements: '#1e3a8a',

  applicationsProjected: 'rgba(176, 13, 38, 0.25)',
  placementsProjected: 'rgba(30, 58, 138, 0.25)',
};

// ==========================================
// VALUE LABEL PLUGIN
// ==========================================

const valueLabelPlugin: Plugin<'bar'> = {
  id: 'groupedBarValueLabels',

  afterDatasetsDraw(chart) {
    const { ctx } = chart;

    ctx.save();

    ctx.font = '600 11px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillStyle = '#64748b';

    chart.data.datasets.forEach((dataset, datasetIndex) => {
      const meta = chart.getDatasetMeta(datasetIndex);

      meta.data.forEach((bar, index) => {
        const value = dataset.data[index];

        if (typeof value !== 'number' || !meta.data[index]) {
          return;
        }

        const position = bar.getProps(['x', 'y'], true);

        ctx.fillText(
          value.toLocaleString(),
          position.x,
          position.y - 6
        );
      });
    });

    ctx.restore();
  },
};

// ==========================================
// CHART FACTORY
// ==========================================

export function createGroupedBarChart(
  canvas: HTMLCanvasElement,
  points: MonthPoint[]
): ChartInstance<'bar', number[], string> {

  const theme = getChartTheme();

  const labels = points.map((point) => point.month);

  const applicationColors = points.map((point) =>
    point.projected
      ? COLORS.applicationsProjected
      : COLORS.applications
  );

  const placementColors = points.map((point) =>
    point.projected
      ? COLORS.placementsProjected
      : COLORS.placements
  );

  const chart = new Chart(canvas, {
    type: 'bar',

    data: {
      labels,

      datasets: [
        {
          label: 'Student Applications',
          data: points.map((point) => point.applications),

          backgroundColor: applicationColors,
          borderColor: COLORS.applications,
          borderWidth: 1,

          borderRadius: 4,
          barPercentage: 0.75,
          categoryPercentage: 0.7,
        },

        {
          label: 'Confirmed Placements',
          data: points.map((point) => point.placements),

          backgroundColor: placementColors,
          borderColor: COLORS.placements,
          borderWidth: 1,

          borderRadius: 4,
          barPercentage: 0.75,
          categoryPercentage: 0.7,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      interaction: {
        mode: 'index',
        intersect: false,
      },

      plugins: {
        legend: {
          display: true,
          position: 'top',

          align: 'end',

          labels: {
            usePointStyle: true,
            pointStyle: 'rectRounded',
            boxWidth: 9,
            boxHeight: 9,
            padding: 18,

            color: theme.text,

            font: {
              family: theme.fontFamily,
              size: 11,
              weight: 500,
            },
          },
        },

        tooltip: {
          enabled: true,

          backgroundColor: '#ffffff',
          titleColor: '#1e293b',
          bodyColor: '#475569',

          borderColor: theme.border,
          borderWidth: 1,

          padding: 12,
          cornerRadius: 8,

          displayColors: true,

          callbacks: {
            label(context) {
              return `${context.dataset.label}: ${Number(
                context.raw
              ).toLocaleString()}`;
            },
          },
        },
      },

      scales: {
        x: {
          grid: {
            display: false,
          },

          border: {
            display: false,
          },

          ticks: {
            color: theme.muted,

            font: {
              family: theme.fontFamily,
              size: 11,
            },
          },
        },

        y: {
          beginAtZero: true,
          min: 0,
          max: 120,

          ticks: {
            stepSize: 30,

            color: theme.muted,

            font: {
              family: theme.fontFamily,
              size: 11,
            },
          },

          grid: {
            color: theme.border,
            lineWidth: 1,
          },

          border: {
            display: false,
          },
        },
      },
    },

    plugins: [valueLabelPlugin],
  });

  return chart;
}
