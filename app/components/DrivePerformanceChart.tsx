'use client';

import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { DriveData } from '../types/drive';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface DrivePerformanceChartProps {
  driveHistory: DriveData[];
}

export default function DrivePerformanceChart({ driveHistory }: DrivePerformanceChartProps) {
  const data = {
    labels: driveHistory.map(drive => new Date(drive.date).toLocaleDateString('tr-TR')),
    datasets: [
      {
        label: 'Ortalama Hız (km/s)',
        data: driveHistory.map(drive => drive.averageSpeed),
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1
      },
      {
        label: 'Yakıt Tüketimi (L/100km)',
        data: driveHistory.map(drive => drive.fuelConsumption),
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1
      }
    ]
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Sürüş Performans Grafiği'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  return (
    <div className="w-full h-64 md:h-96">
      <Line data={data} options={options} />
    </div>
  );
}