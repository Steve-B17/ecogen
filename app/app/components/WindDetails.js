import React from "react";

const WindDetails = ({
  dailyData,
  forecastData,
  monthlyWindSpeedData,
  monthlyWindDirectionData,
}) => {
  return (
    <div className="w-full bg-sky-200 p-4 rounded-lg">
      {/* Header */}
      <div className="bg-white rounded-full p-2 mb-4 flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center mr-2">
            <span className="text-green-600 text-xl">🌿</span>
          </div>
          <span className="text-xl font-bold">Eco-Gen Forecasts</span>
        </div>
        <div className="flex gap-3">
          <span>🏠</span>
          <span>🌦️</span>
          <span>☀️</span>
          <span>⚡</span>
          <span>🌬️</span>
          <span>🏭</span>
        </div>
      </div>

      {/* Wind Weather Data Section */}
      <h2 className="text-xl font-bold mb-3">WIND WEATHER DATA</h2>

      {/* Daily Weather Card */}
      <div className="bg-white p-3 rounded-lg mb-4">
        <div className="bg-sky-100 inline-block px-3 py-1 rounded-lg mb-3">
          <span className="font-bold">DAILY WEATHER</span>
        </div>

        <div className="grid grid-cols-3 gap-3">
          {/* Temperature */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.temperature || "40"}
            </span>
            <div className="flex items-center">
              <span>🌡️</span>
              <span className="text-sm">TEMPERATURE(°C)</span>
            </div>
          </div>

          {/* Wind Speed */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.windSpeed || "40"}
            </span>
            <div className="flex items-center">
              <span>🌬️</span>
              <span className="text-sm">WIND SPEED</span>
            </div>
          </div>

          {/* Wind Direction */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.windDirection || "40"}
            </span>
            <div className="flex items-center">
              <span>🧭</span>
              <span className="text-sm">WIND DIRECTION</span>
            </div>
          </div>

          {/* Pressure */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.pressure || "40"}
            </span>
            <div className="flex items-center">
              <span>🔄</span>
              <span className="text-sm">PRESSURE</span>
            </div>
          </div>

          {/* Humidity */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.humidity || "40"}
            </span>
            <div className="flex items-center">
              <span>💧</span>
              <span className="text-sm">HUMIDITY</span>
            </div>
          </div>

          {/* Precipitation */}
          <div className="bg-sky-200 p-3 rounded-lg flex flex-col items-center">
            <span className="text-2xl font-bold">
              {dailyData?.precipitation || "40"}
            </span>
            <div className="flex items-center">
              <span>🌧️</span>
              <span className="text-sm">PRECIPITATION</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-2 gap-4">
        {/* Next 5 Days Forecast */}
        <div className="bg-white p-3 rounded-lg">
          <div className="font-bold mb-2">Next 5 Days</div>

          {/* Chart */}
          <div className="h-40 mb-4">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={forecastData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="high"
                  stroke="#ff0000"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#0000ff"
                  dot={false}
                />
                <Line
                  type="monotone"
                  dataKey="low"
                  stroke="#00ff00"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Forecast Data List */}
          <div className="text-sm">
            {forecastData?.map((item, index) => (
              <div key={index} className="flex justify-between mb-1">
                <span>{item.date}</span>
                <span>: {item.value}</span>
              </div>
            )) || (
              <>
                <div className="flex justify-between mb-1">
                  <span>24.04.24</span>
                  <span>: 1052.42</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>25.04.24</span>
                  <span>: 3473.43</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>26.04.24</span>
                  <span>: 2571.44</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>27.04.24</span>
                  <span>: 2758.45</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span>28.04.24</span>
                  <span>: 2392.46</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Monthly Profile */}
        <div className="bg-white p-3 rounded-lg">
          <div className="bg-sky-100 inline-block px-3 py-1 rounded-lg mb-3">
            <span className="font-bold">MONTHLY PROFILE</span>
          </div>

          {/* Wind Speed Chart */}
          <div className="h-32 mb-4">
            <div className="text-center text-sm mb-1">
              <span className="font-bold">WIND SPEED</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyWindSpeedData || []}>
                <XAxis
                  dataKey="day"
                  label={{ value: "DAYS OF THE MONTH", position: "bottom" }}
                />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0000ff"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Wind Direction Chart */}
          <div className="h-32">
            <div className="text-center text-sm mb-1">
              <span className="font-bold">WIND DIRECTION</span>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthlyWindDirectionData || []}>
                <XAxis
                  dataKey="day"
                  label={{ value: "DAYS OF THE MONTH", position: "bottom" }}
                />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#0000ff"
                  dot={false}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Energy Icon */}
      <div className="flex justify-end mt-3">
        <div className="bg-white p-2 rounded-lg">
          <span className="text-xl">⚡</span>
        </div>
      </div>
    </div>
  );
};

export default WindDetails;
