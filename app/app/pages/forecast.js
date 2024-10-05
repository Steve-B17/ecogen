import React from "react";
export default function Forecast() {
  return (
    <div className="bg-blue-50 min-h-screen p-4">
      <div className="grid grid-cols-3 gap-4">
        {/* Weather Widget */}
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Weather</div>
          <div className="text-2xl">Partly Cloudy</div>
          <div className="text-4xl">24°C</div>
        </div>

        {/* Weekly Forecast */}
        <div className="col-span-2 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Weekly Forecast</div>
          <div className="flex space-x-2 mt-4">
            {["25°C", "19°C", "14°C", "7°C", "-3°C", "0°C", "5°C"].map(
              (temp, index) => (
                <div
                  key={index}
                  className="bg-blue-200 p-4 rounded-lg flex flex-col items-center"
                >
                  <div className="text-lg">{temp}</div>
                  <div className="text-sm">Day {index + 1}</div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Temperature Graph */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Temperature</div>
          <div>
            {/* Add temperature chart here */}
          </div>
        </div>

        {/* Seasonal Profile */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Seasonal Profile</div>
          <div>
            {/* Add seasonal wind speed chart here */}
          </div>
        </div>

        {/* Daily Profile */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Daily Profile</div>
          <div>
            {/* Add daily wind speed chart here */}
          </div>
        </div>

        {/* Humidity */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Humidity</div>
          <div className="text-2xl">84%</div>
          <div>The dew point is 27°C right now</div>
        </div>

        {/* Wind Speed */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Wind Speed</div>
          <div className="text-3xl">7.5 km/h</div>
          <div>at 6:20 AM</div>
        </div>

        {/* Wind Direction */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Wind Direction</div>
          <div>
            {/* Add wind direction chart here */}
          </div>
        </div>

        {/* Precipitation */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Precipitation</div>
          <div className="text-3xl">4mm</div>
        </div>

        {/* Pressure */}
        <div className="col-span-1 bg-white p-4 rounded-lg shadow-md">
          <div className="text-xl font-bold">Pressure</div>
          <div className="text-3xl">997hPa</div>
        </div>
      </div>
    </div>
  );
}