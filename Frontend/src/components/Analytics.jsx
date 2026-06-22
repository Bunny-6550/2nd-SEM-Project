import { Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler)

export default function Analytics() {
  const labels = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const data = {
    labels,
    datasets: [
      {
        label: 'Activity',
        data: [120, 200, 170, 250, 220, 300, 260],
        borderColor: '#FFFFFF',
        backgroundColor: 'rgba(255,255,255,0.06)',
        fill: true,
        tension: 0.35,
        pointRadius: 2,
        pointBackgroundColor: '#FFFFFF',
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        titleColor: '#FFFFFF',
        bodyColor: '#FFFFFF',
        backgroundColor: '#111111',
        borderColor: 'rgba(255,255,255,0.06)',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        grid: { color: 'transparent' },
        ticks: { color: '#FFFFFF' },
      },
      y: {
        grid: { color: 'rgba(255,255,255,0.03)' },
        ticks: { color: '#FFFFFF', beginAtZero: true },
      },
    },
  }

  return (
    <div className="card p-4">
      <h3 className="font-semibold text-lg">Analytics</h3>
      <div className="mt-4" style={{height: 160}}>
        <Line data={data} options={options} />
      </div>

      <div className="mt-4 flex gap-4 items-center" style={{color: '#FFFFFF'}}>
        <div className="flex-1 flex flex-col">
          <div className="text-sm" style={{color: '#FFFFFF'}}>Questions Solved</div>
          <div className="text-2xl font-bold" style={{color: '#FFFFFF'}}>1,024</div>
        </div>
        <div className="flex-1 flex flex-col">
          <div className="text-sm" style={{color: '#FFFFFF'}}>Avg Effort</div>
          <div className="text-2xl font-bold" style={{color: '#FFFFFF'}}>2.3</div>
        </div>
      </div>
    </div>
  )
}
