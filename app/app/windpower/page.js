"use client";

import React, { useState, useEffect, useRef } from 'react'
import Image from "next/image";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function WindPowerPage() {
  const [formData, setFormData] = useState({
    wind_speed_10m: '',
    wind_speed_50m: '',
    wind_direction_10m: '',
    wind_direction_50m: '',
    air_density: '',
    rotor_speed: '',
    active_power: '',
    previous_power: ''
  });

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const chartRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const formDataToSend = new FormData();
      Object.keys(formData).forEach(key => {
        formDataToSend.append(key, formData[key]);
      });

      const response = await fetch('http://localhost:8000/predict/power', {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('Failed to fetch predictions');
      }

      const data = await response.json();
      setPredictions(data);
      
      // Add the new prediction to historical data
      const timestamp = new Date().toLocaleTimeString();
      setHistoricalData(prev => [
        ...prev, 
        { 
          time: timestamp, 
          power: data["Predicted Wind Power"]
        }
      ].slice(-24)); // Keep only the last 24 data points
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: historicalData.map(item => item.time),
    datasets: [
      {
        label: 'Wind Power (MW)',
        data: historicalData.map(item => item.power),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      }
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
        text: 'Wind Power Generation History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Power (MW)',
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
      <main className="pt-28 pb-16 px-4 min-h-screen max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Wind Power Generation</h1>
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Wind Speed at 10M (m/s)</label>
                <input
                  type="number"
                  name="wind_speed_10m"
                  value={formData.wind_speed_10m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wind Speed at 50M (m/s)</label>
                <input
                  type="number"
                  name="wind_speed_50m"
                  value={formData.wind_speed_50m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wind Direction at 10M (Degrees)</label>
                <input
                  type="number"
                  name="wind_direction_10m"
                  value={formData.wind_direction_10m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Wind Direction at 50M (Degrees)</label>
                <input
                  type="number"
                  name="wind_direction_50m"
                  value={formData.wind_direction_50m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Air Density (kg/m³)</label>
                <input
                  type="number"
                  name="air_density"
                  value={formData.air_density}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Rotor Speed (RPM)</label>
                <input
                  type="number"
                  name="rotor_speed"
                  value={formData.rotor_speed}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Active Power (MW)</label>
                <input
                  type="number"
                  name="active_power"
                  value={formData.active_power}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Previous Hour's Power Generation (MW)</label>
                <input
                  type="number"
                  name="previous_power"
                  value={formData.previous_power}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Predicting...' : 'Predict Wind Power'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              {error}
            </div>
          )}

          {predictions && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
              <div className="p-4 bg-white rounded-md shadow">
                <h3 className="font-medium text-gray-700">Predicted Wind Power</h3>
                <p className="text-2xl font-bold text-blue-600">{predictions["Predicted Wind Power"].toFixed(2)} MW</p>
              </div>
            </div>
          )}
          
          {/* Wind Power Chart */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Wind Power Generation History</h2>
            <div className="bg-white p-4 rounded-md shadow" style={{ height: '400px' }}>
              {historicalData.length > 0 ? (
                <Line data={chartData} options={chartOptions} />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No historical data available yet. Make a prediction to see the chart.
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}