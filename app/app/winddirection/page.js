"use client";

import React, { useState, useEffect, useRef } from 'react'
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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

export default function WindDirectionPage() {
  const [formData, setFormData] = useState({
    dayofyear: '',
    month: '',
    hour: '',
    temperature_at_2m: '',
    earth_skin_temperature: '',
    specific_humidity_at_2m: '',
    relative_humidity_at_2m: '',
    surface_pressure: ''
  });

  const [predictions, setPredictions] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [historicalData, setHistoricalData] = useState([]);
  const [isBackendAvailable, setIsBackendAvailable] = useState(true);
  const chartRef = useRef(null);

  // Check if backend is available on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/');
        setIsBackendAvailable(response.ok);
      } catch (err) {
        console.error('Backend connection error:', err);
        setIsBackendAvailable(false);
      }
    };
    
    checkBackend();
  }, []);

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

      console.log('Sending request to backend...');
      const response = await fetch('http://localhost:8000/predict/direction', {
        method: 'POST',
        body: formDataToSend,
      });

      console.log('Response status:', response.status);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch predictions');
      }

      console.log('Received data:', data);
      setPredictions(data);
      
      // Add the new prediction to historical data
      const timestamp = new Date().toLocaleTimeString();
      setHistoricalData(prev => [
        ...prev, 
        { 
          time: timestamp, 
          direction10m: data["Wind Direction at 10M"],
          direction50m: data["Wind Direction at 50M"]
        }
      ].slice(-24)); // Keep only the last 24 data points
    } catch (err) {
      console.error('Error:', err);
      setError(err.message || 'An error occurred while fetching predictions');
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const chartData = {
    labels: historicalData.map(item => item.time),
    datasets: [
      {
        label: 'Wind Direction at 10M (Degrees)',
        data: historicalData.map(item => item.direction10m),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
        tension: 0.3,
      },
      {
        label: 'Wind Direction at 50M (Degrees)',
        data: historicalData.map(item => item.direction50m),
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
        text: 'Wind Direction History',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: 'Wind Direction (Degrees)',
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
        <h1 className="text-3xl font-bold mb-6">Wind Direction Analysis</h1>
        
        {!isBackendAvailable && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            <p className="font-medium">Backend Connection Error</p>
            <p>Unable to connect to the backend server. Please make sure the backend server is running at http://localhost:8000</p>
          </div>
        )}
        
        <div className="bg-white rounded-lg shadow-md p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Day of Year</label>
                <input
                  type="number"
                  name="dayofyear"
                  value={formData.dayofyear}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Month</label>
                <input
                  type="number"
                  name="month"
                  value={formData.month}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Hour</label>
                <input
                  type="number"
                  name="hour"
                  value={formData.hour}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Temperature at 2M (°C)</label>
                <input
                  type="number"
                  name="temperature_at_2m"
                  value={formData.temperature_at_2m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Earth Skin Temperature (°C)</label>
                <input
                  type="number"
                  name="earth_skin_temperature"
                  value={formData.earth_skin_temperature}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Specific Humidity at 2M (g/kg)</label>
                <input
                  type="number"
                  name="specific_humidity_at_2m"
                  value={formData.specific_humidity_at_2m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Relative Humidity at 2M (%)</label>
                <input
                  type="number"
                  name="relative_humidity_at_2m"
                  value={formData.relative_humidity_at_2m}
                  onChange={handleInputChange}
                  step="any"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Surface Pressure (kPa)</label>
                <input
                  type="number"
                  name="surface_pressure"
                  value={formData.surface_pressure}
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
                disabled={loading || !isBackendAvailable}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? 'Predicting...' : 'Predict Wind Direction'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
              <p className="font-medium">Error</p>
              <p>{error}</p>
              {error.includes("Models not loaded correctly") && (
                <div className="mt-2">
                  <p className="text-sm">This error indicates that the wind direction models are not properly loaded on the backend server.</p>
                  <p className="text-sm mt-1">Please contact the administrator or try again later.</p>
                </div>
              )}
            </div>
          )}

          {predictions && (
            <div className="mt-6 p-4 bg-green-50 rounded-md">
              <h2 className="text-xl font-semibold mb-4">Prediction Results</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-white rounded-md shadow">
                  <h3 className="font-medium text-gray-700">Wind Direction at 10M</h3>
                  <p className="text-2xl font-bold text-blue-600">{predictions["Wind Direction at 10M"].toFixed(2)}°</p>
                </div>
                <div className="p-4 bg-white rounded-md shadow">
                  <h3 className="font-medium text-gray-700">Wind Direction at 50M</h3>
                  <p className="text-2xl font-bold text-blue-600">{predictions["Wind Direction at 50M"].toFixed(2)}°</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Wind Direction Chart */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Wind Direction History</h2>
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