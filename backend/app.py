from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List, Optional
import joblib
import numpy as np
import pandas as pd
from datetime import datetime
import os

# Initialize FastAPI app
app = FastAPI(
    title="Wind Power Predictor API",
    description="API for predicting wind power output based on wind parameters",
    version="1.0.0"
)

# Configure CORS to allow frontend requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Modify in production to only allow your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Path to the ML model file
MODEL_PATH = "models/wind_power_model.pkl"

# Load the ML model
def get_model():
    try:
        model = joblib.load(MODEL_PATH)
        return model
    except FileNotFoundError:
        # For demo purposes, create a dummy model if no real model exists
        class DummyModel:
            def predict(self, X):
                # Simple formula for demo purposes: roughly simulate wind power generation
                # Power ∝ wind_speed³ * air_density
                return np.array([x[0]**3 * x[1] * 0.5 for x in X])
        
        # Create models directory if it doesn't exist
        os.makedirs(os.path.dirname(MODEL_PATH), exist_ok=True)
        
        # Save the dummy model
        dummy_model = DummyModel()
        joblib.dump(dummy_model, MODEL_PATH)
        return dummy_model

# Pydantic models for request/response validation
class WindParameters(BaseModel):
    wind_speed: float = Field(..., gt=0, description="Wind speed in meters per second")
    wind_direction: float = Field(..., ge=0, lt=360, description="Wind direction in degrees")
    air_density: float = Field(..., gt=0, description="Air density in kg/m³")
    temperature: float = Field(..., description="Temperature in Celsius")
    humidity: Optional[float] = Field(None, ge=0, le=100, description="Humidity percentage")
    pressure: Optional[float] = Field(None, gt=0, description="Atmospheric pressure in hPa")

class PowerPrediction(BaseModel):
    timestamp: str
    predicted_power: float
    wind_speed: float
    wind_direction: float
    efficiency: float
    
class HistoricalData(BaseModel):
    timestamp: str
    actual_power: float
    wind_speed: float
    
class WindmillInfo(BaseModel):
    id: int
    name: str
    location: str
    capacity: float
    height: float
    rotor_diameter: float
    operational_since: str
    
# Routes
@app.get("/")
async def root():
    return {"message": "Wind Power Predictor API is running. Visit /docs for API documentation."}

@app.post("/predict/", response_model=PowerPrediction)
async def predict_power(params: WindParameters, model=Depends(get_model)):
    try:
        # Prepare features for the model
        features = np.array([[
            params.wind_speed,
            params.air_density,
            params.wind_direction,
            params.temperature,
            params.humidity if params.humidity else 50.0,  # Default value if not provided
            params.pressure if params.pressure else 1013.25  # Default value if not provided
        ]])
        
        # Get prediction from model
        power_output = float(model.predict(features)[0])
        
        # Calculate a simple efficiency metric (just for demonstration)
        # Betz's law states that max efficiency is 59.3% for wind turbines
        theoretical_max = 0.593 * 0.5 * params.air_density * (params.wind_speed ** 3) * 10  # Assuming 10m² area
        efficiency = min(100 * power_output / theoretical_max, 100) if theoretical_max > 0 else 0
        
        # Return prediction
        return PowerPrediction(
            timestamp=datetime.now().isoformat(),
            predicted_power=power_output,
            wind_speed=params.wind_speed,
            wind_direction=params.wind_direction,
            efficiency=efficiency
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

@app.get("/windmills/", response_model=List[WindmillInfo])
async def get_windmills():
    # Mock data - in a real application, this would come from a database
    windmills = [
        WindmillInfo(
            id=1,
            name="Windmill Alpha",
            location="51.5074° N, 0.1278° W",
            capacity=2500.0,  # kW
            height=120.0,  # meters
            rotor_diameter=90.0,  # meters
            operational_since="2018-05-15"
        ),
        WindmillInfo(
            id=2,
            name="Windmill Beta",
            location="52.2297° N, 21.0122° E",
            capacity=3000.0,
            height=135.0,
            rotor_diameter=100.0,
            operational_since="2019-08-22"
        ),
        WindmillInfo(
            id=3,
            name="Windmill Gamma",
            location="48.8566° N, 2.3522° E",
            capacity=2200.0,
            height=110.0,
            rotor_diameter=85.0,
            operational_since="2017-11-30"
        )
    ]
    return windmills

@app.get("/historical/{windmill_id}", response_model=List[HistoricalData])
async def get_historical_data(windmill_id: int):
    # Mock data - in a real application, this would come from a database
    if windmill_id not in [1, 2, 3]:
        raise HTTPException(status_code=404, detail="Windmill not found")
    
    # Generate some mock historical data
    base_date = datetime(2025, 3, 1)
    data = []
    
    for i in range(24):
        hour = base_date.replace(hour=i)
        # Simulate a daily wind pattern with peak in afternoon
        wind_speed = 5 + 3 * np.sin((i - 6) * np.pi / 12) + np.random.normal(0, 0.5)
        wind_speed = max(0.5, wind_speed)  # Ensure positive wind speed
        
        # Calculate power based on wind speed (simplified P ∝ v³)
        power = wind_speed**3 * 10 + np.random.normal(0, 50)
        power = max(0, power)  # Ensure non-negative power
        
        data.append(HistoricalData(
            timestamp=hour.isoformat(),
            actual_power=power,
            wind_speed=wind_speed
        ))
    
    return data

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "api_version": "1.0.0",
        "model_loaded": os.path.exists(MODEL_PATH)
    }

# For local development
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)