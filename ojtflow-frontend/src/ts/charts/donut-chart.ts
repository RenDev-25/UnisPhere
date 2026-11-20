
import { Chart } from './chart-setup';
import { getChartTheme } from './chart-theme';

// =========================================
// TYPES
// =========================================

export interface DonutChartItem {
  label: string;
  value: number;
  color: string;
}

// Backward-compatible name used by the dashboard.
export type DonutSegment = DonutChartItem;

// =========================================
// CREATE DOUGHNUT CHART
// =========================================

export function createDonutChart(
  canvas: HTMLCanvasElement,
  segments: DonutChartItem[],
  onHover?: (index: number | null) => void
): Chart<'doughnut', number[], string> {

  const theme = getChartTheme();

  return new Chart(canvas, {
    type: 'doughnut',

    data: {
      labels: segments.map(segment => segment.label),

      datasets: [
        {
          data: segments.map(segment => segment.value),

          backgroundColor: segments.map(
            segment => segment.color
          ),

          borderWidth: 0,
          hoverOffset: 5,
        },
      ],
    },

    options: {
      cutout: '70%',
      responsive: true,
      maintainAspectRatio: false,

      animation: {
        duration: 250,
      },

      plugins: {
        legend: {
          display: false,
        },

        tooltip: {
          backgroundColor: theme.text,
          titleColor: '#ffffff',
          bodyColor: '#ffffff',
          borderColor: theme.border,
          borderWidth: 1,
          padding: 12,
          cornerRadius: 8,
          displayColors: true,
        },
      },

      onHover: (_event, elements) => {
        onHover?.(
          elements.length > 0
            ? elements[0].index
            : null
        );
      },
    },
  });
}

// =========================================
// HIGHLIGHT DOUGHNUT SEGMENT
// =========================================

export function highlightDonutSegment(
  chart: Chart<'doughnut', number[], string>,
  segments: DonutChartItem[],
  activeIndex: number | null
): void {

  const dataset = chart.data.datasets[0];

  if (!dataset) return;

  dataset.backgroundColor = segments.map(
    (segment, index) => {

      if (activeIndex === null) {
        return segment.color;
      }

      return index === activeIndex
        ? segment.color
        : `${segment.color}33`;
    }
  );

  chart.update('none');
}
