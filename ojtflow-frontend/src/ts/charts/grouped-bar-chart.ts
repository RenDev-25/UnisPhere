
import { Chart } from './chart-setup';

export interface MonthPoint {
  month: string;
  applications: number;
  placements: number;
  projected?: boolean;
}

export function createGroupedBarChart(
  canvas: HTMLCanvasElement,
  points: MonthPoint[]
): Chart {
  const red = '#b00d26';
  const navy = '#1e3a8a';

  // Projected or target bars use lighter colors.
  const fade = (hex: string, point: MonthPoint): string =>
    point.projected ? `${hex}66` : hex;

  // Display values above each bar.
  const valueLabels = {
    id: 'valueLabels',

    afterDatasetsDraw(chart: Chart): void {
      const ctx = chart.ctx;

      ctx.save();
      ctx.font = "600 11px 'Inter', sans-serif";
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';

      chart.data.datasets.forEach((dataset, i) => {
        chart.getDatasetMeta(i).data.forEach((bar, j) => {
          ctx.fillStyle = i === 0 ? red : navy;
          ctx.fillText(
            String(dataset.data[j]),
            bar.x,
            bar.y - 4
          );
        });
      });

      ctx.restore();
    },
  };

  return new Chart(canvas, {
    type: 'bar',

    data: {
      labels: points.map((point) => point.month),

      datasets: [
        {
          label: 'Student Applications',
          data: points.map((point) => point.applications),
          backgroundColor: points.map((point) => fade(red, point)),
          borderColor: red,
          borderWidth: 1,
          borderRadius: 4,

          // Dashed outline for projected or target bars.
          borderDash: (context) =>
            points[context.dataIndex]?.projected ? [5, 4] : [],
        },
        {
          label: 'Confirmed Placements',
          data: points.map((point) => point.placements),
          backgroundColor: points.map((point) => fade(navy, point)),
          borderColor: navy,
          borderWidth: 1,
          borderRadius: 4,

          // Dashed outline for projected or target bars.
          borderDash: (context) =>
            points[context.dataIndex]?.projected ? [5, 4] : [],
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,

      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },

      scales: {
        y: {
          min: 0,
          max: 120,

          ticks: {
            stepSize: 30,
          },
        },

        x: {
          grid: {
            display: false,
          },
        },
      },
    },

    plugins: [valueLabels],
  });
}
