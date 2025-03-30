"use client";
import { useState } from "react";

export default function Predict() {
  const [features, setFeatures] = useState({
    feature1: 0,
    feature2: 0,
    feature3: 0,
  });
  const [results, setResults] = useState({
    gbm10: null,
    gbm50: null,
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleFeatureChange = (e) => {
    const { name, value } = e.target;
    setFeatures(prev => ({
      ...prev,
      [name]: parseFloat(value)
    }));
  };

  const handlePredict = async (modelName) => {
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ model_name: modelName, features }),
      });

      const data = await response.json();
      
      setResults(prev => ({
        ...prev,
        [modelName.toLowerCase()]: data
      }));
    } catch (error) {
      console.error(`Error predicting with ${modelName}:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePredictAll = async () => {
    setIsLoading(true);
    try {
      const [gbm10Response, gbm50Response] = await Promise.all([
        fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model_name: "GBM10", features }),
        }),
        fetch("http://localhost:8000/predict", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ model_name: "GBM50", features }),
        })
      ]);

      const gbm10Data = await gbm10Response.json();
      const gbm50Data = await gbm50Response.json();

      setResults({
        gbm10: gbm10Data,
        gbm50: gbm50Data
      });
    } catch (error) {
      console.error("Error predicting with both models:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">ML Model Prediction</h1>
      
      <div className="mb-8 bg-gray-50 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">Input Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {Object.keys(features).map((feature) => (
            <div key={feature} className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {feature.charAt(0).toUpperCase() + feature.slice(1)}
              </label>
              <input
                type="number"
                name={feature}
                value={features[feature]}
                onChange={handleFeatureChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row justify-center gap-4 mb-8">
        <button
          onClick={() => handlePredict("GBM10")}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-md font-medium transition duration-200 disabled:opacity-50"
        >
          Predict with GBM10
        </button>
        <button
          onClick={() => handlePredict("GBM50")}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white py-2 px-6 rounded-md font-medium transition duration-200 disabled:opacity-50"
        >
          Predict with GBM50
        </button>
        <button
          onClick={handlePredictAll}
          disabled={isLoading}
          className="bg-purple-600 hover:bg-purple-700 text-white py-2 px-6 rounded-md font-medium transition duration-200 disabled:opacity-50"
        >
          Compare Both Models
        </button>
      </div>

      {isLoading && (
        <div className="text-center py-4">
          <p className="text-gray-600">Loading predictions...</p>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className={`p-4 rounded-lg border ${results.gbm10 ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-3 text-blue-800">GBM10 Model</h3>
          {results.gbm10 ? (
            <div>
              <p className="font-medium">Prediction: <span className="text-blue-700">{results.gbm10.prediction}</span></p>
              {results.gbm10.probability && (
                <p className="mt-2 text-sm">Probability: {(results.gbm10.probability * 100).toFixed(2)}%</p>
              )}
              {results.gbm10.features_importance && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Feature Importance:</p>
                  <ul className="mt-1 text-sm">
                    {Object.entries(results.gbm10.features_importance).map(([feature, importance]) => (
                      <li key={feature}>{feature}: {importance.toFixed(4)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No prediction yet</p>
          )}
        </div>
        
        <div className={`p-4 rounded-lg border ${results.gbm50 ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
          <h3 className="text-lg font-semibold mb-3 text-green-800">GBM50 Model</h3>
          {results.gbm50 ? (
            <div>
              <p className="font-medium">Prediction: <span className="text-green-700">{results.gbm50.prediction}</span></p>
              {results.gbm50.probability && (
                <p className="mt-2 text-sm">Probability: {(results.gbm50.probability * 100).toFixed(2)}%</p>
              )}
              {results.gbm50.features_importance && (
                <div className="mt-3">
                  <p className="text-sm font-medium">Feature Importance:</p>
                  <ul className="mt-1 text-sm">
                    {Object.entries(results.gbm50.features_importance).map(([feature, importance]) => (
                      <li key={feature}>{feature}: {importance.toFixed(4)}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-500 italic">No prediction yet</p>
          )}
        </div>
      </div>
      
      {results.gbm10 && results.gbm50 && (
        <div className="mt-8 p-4 border border-purple-200 bg-purple-50 rounded-lg">
          <h3 className="text-lg font-semibold mb-3 text-purple-800">Model Comparison</h3>
          <div className="flex flex-col md:flex-row justify-around">
            <div>
              <p className="font-medium">GBM10 Prediction: <span className="text-blue-700">{results.gbm10.prediction}</span></p>
              {results.gbm10.probability && (
                <p className="text-sm">Confidence: {(results.gbm10.probability * 100).toFixed(2)}%</p>
              )}
            </div>
            <div className="mt-4 md:mt-0">
              <p className="font-medium">GBM50 Prediction: <span className="text-green-700">{results.gbm50.prediction}</span></p>
              {results.gbm50.probability && (
                <p className="text-sm">Confidence: {(results.gbm50.probability * 100).toFixed(2)}%</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}