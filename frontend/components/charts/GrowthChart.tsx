"use client"

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Filler,
  Legend
);

export const options = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: '#1e293b',
      padding: 12,
      cornerRadius: 12,
    }
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        display: false,
      }
    },
    y: {
      display: false,
      beginAtZero: true,
    },
  },
  elements: {
    line: {
      tension: 0.4,
    },
    point: {
        radius: 0,
        hoverRadius: 6,
    }
  },
};

const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'];

export const data = {
  labels,
  datasets: [
    {
      fill: true,
      label: 'Growth',
      data: [30, 45, 40, 60, 55, 85, 100],
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 3,
    },
  ],
};

export function GrowthChart() {
  return <Line options={options} data={data} />;
}
