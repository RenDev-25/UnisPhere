
import { Chart, registerables } from 'chart.js';

// Register all Chart.js components once.
Chart.register(...registerables);

export { Chart };
