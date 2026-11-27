
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

    // Chart.js keeps a real zero-value doughnut instance when there are no
    // records. This plugin draws only a neutral track in that state so the
    // chart remains visibly rendered without inventing non-zero data.
    plugins: [{
      id: 'empty-doughnut-track',
      afterDraw: chart => {
        const values = chart.data.datasets[0]?.data ?? [];
        if (!values.length || values.some(value => Number(value) > 0)) return;
        const area = chart.chartArea;
        if (!area) return;
        const radius = Math.min(area.right - area.left, area.bottom - area.top) / 2 - 3;
        if (radius <= 0) return;
        const lineWidth = Math.max(8, radius * 0.3);
        const context = chart.ctx;
        context.save();
        context.beginPath();
        context.arc((area.left + area.right) / 2, (area.top + area.bottom) / 2, radius - lineWidth / 2, 0, Math.PI * 2);
        context.strokeStyle = theme.border;
        context.lineWidth = lineWidth;
        context.stroke();
        context.restore();
      },
    }],

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
