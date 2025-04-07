"use client"
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch dashboard summary
        const summaryResponse = await fetch('http://localhost:8000/dashboard/summary');
        const summaryData = await summaryResponse.json();

        if (!summaryResponse.ok) {
          throw new Error(summaryData.error || 'Failed to fetch dashboard data');
        }

        setSummary(summaryData);

        // Fetch historical wind speed data
        const historyResponse = await fetch('http://localhost:8000/historical/wind-speed');
        const historyData = await historyResponse.json();

        if (!historyResponse.ok) {
          throw new Error(historyData.error || 'Failed to fetch historical data');
        }

        setHistoricalData(historyData);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message || 'An error occurred while fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 300000); // Refresh every 5 minutes
    return () => clearInterval(interval);
  }, []);

  const chartData = {
    labels: historicalData.map(item => new Date(item.timestamp).toLocaleTimeString()),
    datasets: [
      {
        label: 'Wind Speed at 10M (m/s)',
        data: historicalData.map(item => item.wind_speed_10m),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Wind Speed at 50M (m/s)',
        data: historicalData.map(item => item.wind_speed_50m),
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.5)',
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '24-Hour Wind Speed History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Wind Speed (m/s)',
        },
      },
      x: {
        title: {
          display: true,
          text: 'Time',
        },
      },
    },
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-32 pb-16 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-800 mb-8">Wind Energy Dashboard</h1>

          {error && (
            <div className="mb-8 p-4 bg-red-100 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
            </div>
          ) : summary && (
            <>
              {/* Latest Readings */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Latest Wind Speed</h2>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">At 10M:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.latest_readings.wind_speed.at_10m?.toFixed(2)} m/s
                    </p>
                    <p className="text-sm text-gray-600">At 50M:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.latest_readings.wind_speed.at_50m?.toFixed(2)} m/s
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(summary.latest_readings.wind_speed.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Latest Wind Direction</h2>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-600">At 10M:</p>
                    <p className="text-2xl font-bold text-blue-600">
                      {summary.latest_readings.wind_direction.at_10m?.toFixed(2)}°
                    </p>
                    <p className="text-sm text-gray-600">At 50M:</p>
                    <p className="text-2xl font-bold text-green-600">
                      {summary.latest_readings.wind_direction.at_50m?.toFixed(2)}°
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(summary.latest_readings.wind_direction.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h2 className="text-lg font-semibold mb-4">Latest Power Prediction</h2>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold text-purple-600">
                      {summary.latest_readings.power.predicted?.toFixed(2)} MW
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      Last updated: {new Date(summary.latest_readings.power.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              {/* 24h Averages */}
              <div className="bg-white p-6 rounded-lg shadow mb-8">
                <h2 className="text-lg font-semibold mb-4">24-Hour Averages</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-gray-600">Average Wind Speed (10M)</p>
                    <p className="text-2xl font-bold text-blue-600">{summary["24h_averages"].wind_speed_10m.toFixed(2)} m/s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Wind Speed (50M)</p>
                    <p className="text-2xl font-bold text-green-600">{summary["24h_averages"].wind_speed_50m.toFixed(2)} m/s</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Average Power Generation</p>
                    <p className="text-2xl font-bold text-purple-600">{summary["24h_averages"].power.toFixed(2)} MW</p>
                  </div>
                </div>
              </div>

              {/* Historical Chart */}
              <div className="bg-white p-6 rounded-lg shadow" style={{ height: '400px' }}>
                <Line data={chartData} options={chartOptions} />
              </div>
            </>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 