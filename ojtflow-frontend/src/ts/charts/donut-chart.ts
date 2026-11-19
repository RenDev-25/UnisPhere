
import { Chart } from './chart-setup';
import { getChartTheme } from './chart-theme';

export interface DonutChartItem {
  label: string;
  value: number;
  color: string;
}

export interface DonutChartElements {
  canvas: HTMLCanvasElement;
  center: HTMLElement;
  legend: HTMLElement;
}

type DonutChartInstance = Chart<'doughnut', number[], string>;

function formatPercentage(value: number, total: number): string {
  if (total <= 0) return '0.0%';
  return `${((value / total) * 100).toFixed(1)}%`;
}

function toRgba(color: string, opacity: number): string {
  const hex = color.replace('#', '');

  if (/^[0-9a-fA-F]{3}$/.test(hex)) {
    const expanded = hex
      .split('')
      .map((character) => character + character)
      .join('');

    const red = parseInt(expanded.slice(0, 2), 16);
    const green = parseInt(expanded.slice(2, 4), 16);
    const blue = parseInt(expanded.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  if (/^[0-9a-fA-F]{6}$/.test(hex)) {
    const red = parseInt(hex.slice(0, 2), 16);
    const green = parseInt(hex.slice(2, 4), 16);
    const blue = parseInt(hex.slice(4, 6), 16);

    return `rgba(${red}, ${green}, ${blue}, ${opacity})`;
  }

  return color;
}

function createCenterContent(
  center: HTMLElement
): {
  value: HTMLElement;
  label: HTMLElement;
  subLabel: HTMLElement;
} {
  center.replaceChildren();

  const value = document.createElement('span');
  value.className = 'donut-center__value';

  const label = document.createElement('span');
  label.className = 'donut-center__label';

  const subLabel = document.createElement('span');
  subLabel.className = 'donut-center__sub-label';

  center.classList.add('donut-center');
  center.append(value, label, subLabel);

  return { value, label, subLabel };
}

export function initDonutChart(
  elements: DonutChartElements,
  items: DonutChartItem[]
): DonutChartInstance {
  if (items.length === 0) {
    throw new Error('Doughnut chart requires at least one data item.');
  }

  if (
    items.some(
      (item) =>
        !Number.isFinite(item.value) ||
        item.value < 0 ||
        !item.label ||
        !item.color
    )
  ) {
    throw new Error('Doughnut chart contains invalid data.');
  }

  const { canvas, center, legend } = elements;
  const theme = getChartTheme();

  const total = items.reduce((sum, item) => sum + item.value, 0);

  const centerContent = createCenterContent(center);

  function showTotal(): void {
    centerContent.value.textContent = total.toLocaleString();
    centerContent.value.style.color = theme.text;
    centerContent.label.textContent = 'Total Students';
    centerContent.subLabel.textContent = 'Across all statuses';
  }

  function showItem(index: number): void {
    const item = items[index];

    if (!item) return;

    centerContent.value.textContent = item.value.toLocaleString();
    centerContent.value.style.color = item.color;
    centerContent.label.textContent = item.label;
    centerContent.subLabel.textContent =
      `${formatPercentage(item.value, total)} of total students`;
  }

  function highlightSegment(index: number | null): void {
    chart.data.datasets[0].backgroundColor = items.map((item, itemIndex) =>
      index === null || itemIndex === index
        ? item.color
        : toRgba(item.color, 0.25)
    );

    chart.update('none');

    if (index === null) {
      showTotal();
    } else {
      showItem(index);
    }

    updateLegend(index);
  }

  function updateLegend(activeIndex: number | null): void {
    const buttons = legend.querySelectorAll<HTMLButtonElement>(
      '.donut-legend__item'
    );

    buttons.forEach((button, index) => {
      const isActive = activeIndex === index;

      button.classList.toggle('is-active', isActive);
      button.classList.toggle(
        'is-dimmed',
        activeIndex !== null && !isActive
      );

      button.setAttribute(
        'aria-pressed',
        String(isActive)
      );
    });
  }

  const chart = new Chart(canvas, {
    type: 'doughnut',

    data: {
      labels: items.map((item) => item.label),
      datasets: [
        {
          data: items.map((item) => item.value),
          backgroundColor: items.map((item) => item.color),
          borderWidth: 0,
          hoverOffset: 6,
          spacing: 2,
        },
      ],
    },

    options: {
      responsive: true,
      maintainAspectRatio: false,
      cutout: '70%',

      plugins: {
        legend: {
          display: false,
        },
      },

      onHover: (_event, activeElements) => {
        const active = activeElements[0];

        highlightSegment(
          active ? active.index : null
        );
      },
    },
  });

  // Create the custom interactive HTML legend.
  legend.replaceChildren();
  legend.classList.add('donut-legend');

  items.forEach((item, index) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'donut-legend__item';

    button.setAttribute(
      'aria-label',
      `${item.label}: ${item.value} students, ${formatPercentage(item.value, total)}`
    );

    button.setAttribute('aria-pressed', 'false');

    const indicator = document.createElement('span');
    indicator.className = 'donut-legend__indicator';
    indicator.style.backgroundColor = item.color;

    const label = document.createElement('span');
    label.className = 'donut-legend__label';
    label.textContent = item.label;

    const count = document.createElement('span');
    count.className = 'donut-legend__count';
    count.textContent = item.value.toLocaleString();

    const percentage = document.createElement('span');
    percentage.className = 'donut-legend__percentage';
    percentage.textContent = formatPercentage(item.value, total);

    button.append(indicator, label, count, percentage);

    button.addEventListener('pointerenter', () => {
      highlightSegment(index);
    });

    button.addEventListener('pointerleave', () => {
      highlightSegment(null);
    });

    button.addEventListener('focus', () => {
      highlightSegment(index);
    });

    button.addEventListener('blur', () => {
      highlightSegment(null);
    });

    legend.append(button);
  });

  canvas.addEventListener('mouseleave', () => {
    highlightSegment(null);
  });

  showTotal();

  return chart;
}
