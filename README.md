# EcoGen - Wind Energy Prediction System

EcoGen is a comprehensive wind energy prediction system that provides forecasts for wind speed, wind direction, and wind power generation. The application uses machine learning models to predict these parameters based on meteorological data.

## Features

- **Wind Speed Prediction**: Forecasts wind speed at 10m and 50m heights
- **Wind Direction Prediction**: Predicts wind direction at 10m and 50m heights
- **Wind Power Prediction**: Estimates potential wind power generation
- **Historical Data Visualization**: Charts showing historical predictions
- **Real-time Dashboard**: Summary of latest predictions and 24-hour averages

## Project Structure

```
ecogen/
├── backend/                 # Backend application
│   ├── main/                # Main application code
│   │   ├── models/          # ML models and model wrappers
│   │   │   ├── joblibFiles/ # Trained model files
│   │   │   │   ├── windDirection/  # Wind direction models
│   │   │   │   ├── windSpeed/      # Wind speed models
│   │   │   │   └── windPower/      # Wind power models
│   │   │   ├── wind_direction_model.py
│   │   │   ├── wind_speed_model.py
│   │   │   └── wind_power_model.py
│   │   ├── static/          # Frontend static files
│   │   │   ├── css/         # CSS stylesheets
│   │   │   ├── js/          # JavaScript files
│   │   │   └── index.html   # Main HTML page
│   │   ├── database.py      # Database models and operations
│   │   └── main.py          # FastAPI application
│   └── test_wind_direction_model.py  # Test script for wind direction model
└── requirements.txt         # Python dependencies
```

## Prerequisites

- Python 3.8 or higher
- pip (Python package installer)
- SQLite (for local development)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/ecogen.git
   cd ecogen
   ```

2. Create a virtual environment (recommended):
   ```bash
   python -m venv venv
   # On Windows
   venv\Scripts\activate
   # On macOS/Linux
   source venv/bin/activate
   ```

3. Install the required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Running the Application

1. Start the backend server:
   ```bash
   cd ecogen/backend
   uvicorn main.main:app --reload
   ```

2. Open your web browser and navigate to:
   ```
   http://localhost:8000
   ```

## API Endpoints

The application provides the following API endpoints:

- `GET /`: Main dashboard
- `POST /predict/speed`: Predict wind speed
- `POST /predict/direction`: Predict wind direction
- `POST /predict/power`: Predict wind power
- `GET /historical/wind-speed`: Get historical wind speed data
- `GET /dashboard/summary`: Get dashboard summary data

## Model Training

The models used in this application were trained on meteorological data. The training process is not included in this repository, but the trained models are provided in the `joblibFiles` directory.

## Testing

To test the wind direction model:

```bash
cd ecogen/backend
python test_wind_direction_model.py
```

## Troubleshooting

If you encounter issues with the wind direction model returning zeros:

1. Check the server logs for error messages
2. Verify that the model files exist in the correct location
3. Ensure all required dependencies are installed
4. Try running the test script to diagnose model loading issues

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Meteorological data providers
- Machine learning libraries (scikit-learn, joblib)
- Web frameworks (FastAPI, Jinja2) 