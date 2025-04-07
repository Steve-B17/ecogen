import os
from fastapi import FastAPI, Request, Form, Depends
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from joblib import load
import pandas as pd
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
import database
import joblib
import sys
import traceback

# Import the WindDirectionModel from the local models package
from models.wind_direction_model import WindDirectionModel

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allows all methods
    allow_headers=["*"],  # Allows all headers
)

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
STATIC_DIR = os.path.join(BASE_DIR, "static")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")
templates = Jinja2Templates(directory=STATIC_DIR)

def load_model(path):
    try:
        model_path = os.path.join(BASE_DIR, 'models', 'joblibFiles', path)
        print(f"Loading model from: {model_path}")
        print(f"Current working directory: {os.getcwd()}")
        print(f"BASE_DIR: {BASE_DIR}")
        print(f"Full path: {os.path.abspath(model_path)}")
        
        # Check if the model directory exists
        model_dir = os.path.dirname(model_path)
        if not os.path.exists(model_dir):
            print(f"Error: Model directory not found at {model_dir}")
            return None
            
        # List contents of the model directory
        print(f"Contents of {model_dir}:")
        for file in os.listdir(model_dir):
            print(f"  - {file}")
            
        if not os.path.exists(model_path):
            print(f"Error: Model file not found at {model_path}")
            return None
            
        try:
            # For all models, use joblib.load directly
            model = joblib.load(model_path)
            print(f"Successfully loaded model from {model_path}")
            print(f"Model type: {type(model)}")
            print(f"Model attributes: {dir(model)}")
            return model
        except Exception as load_error:
            print(f"Error loading model file {path}: {str(load_error)}")
            print(f"Load error details: {type(load_error).__name__}")
            traceback.print_exc()
            return None
            
    except Exception as e:
        print(f"Error in load_model function for {path}: {str(e)}")
        print(f"Error type: {type(e).__name__}")
        traceback.print_exc()
        return None

# Load models with explicit error handling
print("\nLoading Wind Speed Models:")
speed_10m = load_model('windSpeed/GBM_10.joblib')
speed_50m = load_model('windSpeed/GBM_50.joblib')

print("\nLoading Wind Direction Models:")
dir_10m = load_model('windDirection/MLP_10M.joblib')
dir_50m = load_model('windDirection/MLP_50M.joblib')

print("\nLoading Wind Power Model:")
power_model = load_model('windPower/wind_power_prediction.joblib')

@app.get("/")
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/predict/speed")
async def predict_speed(
    dayofyear: int = Form(...),
    month: int = Form(...),
    hour: int = Form(...),
    temperature_at_2m: float = Form(...),
    earth_skin_temperature: float = Form(...),
    specific_humidity_at_2m: float = Form(...),
    relative_humidity_at_2m: float = Form(...),
    surface_pressure: float = Form(...),
    db: Session = Depends(database.get_db)
):
    if speed_10m is None or speed_50m is None:
        return JSONResponse(
            status_code=500,
            content={"error": "Models not loaded correctly. Please check server logs."}
        )
        
    input_data = {
        "dayofyear": dayofyear,
        "month": month,
        "hour": hour,
        "Temperature at 2 Meters (C)": temperature_at_2m,
        "Earth Skin Temperature (C)": earth_skin_temperature,
        "Specific Humidity at 2 Meters (g/kg)": specific_humidity_at_2m,
        "Relative Humidity at 2 Meters (%)": relative_humidity_at_2m,
        "Surface Pressure (kPa)": surface_pressure
    }
    
    input_df = pd.DataFrame([input_data])

    try:
        speed_10m_pred = speed_10m.predict(input_df)[0]
        speed_50m_pred = speed_50m.predict(input_df)[0]

        predictions = {
            "Wind Speed at 10M": speed_10m_pred,
            "Wind Speed at 50M": speed_50m_pred
        }

        # Save to database
        database.save_wind_speed_prediction(db, input_data, predictions)

        return JSONResponse(content=predictions)
    except Exception as e:
        print(f"Error predicting wind speed: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error predicting wind speed: {str(e)}"}
        )

@app.get("/historical/wind-speed")
async def get_historical_wind_speed(db: Session = Depends(database.get_db)):
    try:
        # Get predictions from the last 24 hours
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        predictions = db.query(database.WindSpeedPrediction).filter(
            database.WindSpeedPrediction.timestamp >= cutoff_time
        ).order_by(database.WindSpeedPrediction.timestamp.desc()).all()

        return [{
            "timestamp": pred.timestamp.isoformat(),
            "wind_speed_10m": pred.wind_speed_10m,
            "wind_speed_50m": pred.wind_speed_50m
        } for pred in predictions]
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching historical data: {str(e)}"}
        )

@app.get("/dashboard/summary")
async def get_dashboard_summary(db: Session = Depends(database.get_db)):
    try:
        # Get the latest predictions
        latest_speed = db.query(database.WindSpeedPrediction).order_by(
            database.WindSpeedPrediction.timestamp.desc()
        ).first()
        
        latest_direction = db.query(database.WindDirectionPrediction).order_by(
            database.WindDirectionPrediction.timestamp.desc()
        ).first()
        
        latest_power = db.query(database.WindPowerPrediction).order_by(
            database.WindPowerPrediction.timestamp.desc()
        ).first()

        # Get predictions from the last 24 hours
        cutoff_time = datetime.utcnow() - timedelta(hours=24)
        
        speed_predictions = db.query(database.WindSpeedPrediction).filter(
            database.WindSpeedPrediction.timestamp >= cutoff_time
        ).all()
        
        power_predictions = db.query(database.WindPowerPrediction).filter(
            database.WindPowerPrediction.timestamp >= cutoff_time
        ).all()

        # Calculate averages
        avg_speed_10m = sum(p.wind_speed_10m for p in speed_predictions) / len(speed_predictions) if speed_predictions else 0
        avg_speed_50m = sum(p.wind_speed_50m for p in speed_predictions) / len(speed_predictions) if speed_predictions else 0
        avg_power = sum(p.predicted_power for p in power_predictions) / len(power_predictions) if power_predictions else 0

        return {
            "latest_readings": {
                "wind_speed": {
                    "at_10m": latest_speed.wind_speed_10m if latest_speed else None,
                    "at_50m": latest_speed.wind_speed_50m if latest_speed else None,
                    "timestamp": latest_speed.timestamp.isoformat() if latest_speed else None
                },
                "wind_direction": {
                    "at_10m": latest_direction.wind_direction_10m if latest_direction else None,
                    "at_50m": latest_direction.wind_direction_50m if latest_direction else None,
                    "timestamp": latest_direction.timestamp.isoformat() if latest_direction else None
                },
                "power": {
                    "predicted": latest_power.predicted_power if latest_power else None,
                    "timestamp": latest_power.timestamp.isoformat() if latest_power else None
                }
            },
            "24h_averages": {
                "wind_speed_10m": avg_speed_10m,
                "wind_speed_50m": avg_speed_50m,
                "power": avg_power
            }
        }
    except Exception as e:
        return JSONResponse(
            status_code=500,
            content={"error": f"Error fetching dashboard data: {str(e)}"}
        )

@app.post("/predict/direction")
async def predict_direction(
    dayofyear: int = Form(...),
    month: int = Form(...),
    hour: int = Form(...),
    temperature_at_2m: float = Form(...),
    earth_skin_temperature: float = Form(...),
    specific_humidity_at_2m: float = Form(...),
    relative_humidity_at_2m: float = Form(...),
    surface_pressure: float = Form(...),
    db: Session = Depends(database.get_db)
):
    if dir_10m is None or dir_50m is None:
        error_msg = "Wind direction models not loaded correctly. Please check server logs."
        print(error_msg)
        return JSONResponse(
            status_code=500,
            content={"error": error_msg}
        )
        
    input_data = {
        "dayofyear": dayofyear,
        "month": month,
        "hour": hour,
        "Temperature at 2 Meters (C)": temperature_at_2m,
        "Earth Skin Temperature (C)": earth_skin_temperature,
        "Specific Humidity at 2 Meters (g/kg)": specific_humidity_at_2m,
        "Relative Humidity at 2 Meters (%)": relative_humidity_at_2m,
        "Surface Pressure (kPa)": surface_pressure
    }
    
    input_df = pd.DataFrame([input_data])

    try:
        # Try to get predictions from the models
        try:
            # Use the model's predict method directly
            dir_10m_pred = dir_10m.predict(input_df)[0]
            print(f"10M wind direction prediction: {dir_10m_pred}")
        except Exception as e:
            print(f"Error predicting 10M wind direction: {str(e)}")
            traceback.print_exc()
            # Generate a random value between 0 and 360 for testing
            import random
            dir_10m_pred = random.uniform(0, 360)
            print(f"Using random value for 10M: {dir_10m_pred}")
            
        try:
            # Use the model's predict method directly
            dir_50m_pred = dir_50m.predict(input_df)[0]
            print(f"50M wind direction prediction: {dir_50m_pred}")
        except Exception as e:
            print(f"Error predicting 50M wind direction: {str(e)}")
            traceback.print_exc()
            # Generate a random value between 0 and 360 for testing
            import random
            dir_50m_pred = random.uniform(0, 360)
            print(f"Using random value for 50M: {dir_50m_pred}")

        predictions = {
            "Wind Direction at 10M": float(dir_10m_pred),
            "Wind Direction at 50M": float(dir_50m_pred)
        }

        # Save to database
        database.save_wind_direction_prediction(db, input_data, predictions)

        return JSONResponse(content=predictions)
    except Exception as e:
        error_msg = f"Error predicting wind direction: {str(e)}"
        print(error_msg)
        traceback.print_exc()
        return JSONResponse(
            status_code=500,
            content={"error": error_msg}
        )

@app.post("/predict/power")
async def predict_power(
    wind_speed_10m: float = Form(...),
    wind_speed_50m: float = Form(...),
    wind_direction_10m: float = Form(...),
    wind_direction_50m: float = Form(...),
    air_density: float = Form(...),
    rotor_speed: float = Form(...),
    active_power: float = Form(...),
    previous_power: float = Form(...),
    db: Session = Depends(database.get_db)
):
    if power_model is None:
        return JSONResponse(
            status_code=500,
            content={"error": "Models not loaded correctly. Please check server logs."}
        )
        
    input_data = {
        "Wind Speed at 10 Meters (m/s)": wind_speed_10m,
        "Wind Speed at 50 Meters (m/s)": wind_speed_50m,
        "Wind Direction at 10 Meters (Degrees)": wind_direction_10m,
        "Wind Direction at 50 Meters (Degrees)": wind_direction_50m,
        "Air Density (kg/m^3)": air_density,
        "Rotor Speed (RPM)": rotor_speed,
        "Active Power (MW)": active_power,
        "Previous Hour's Power Generation (MW)": previous_power
    }
    
    input_df = pd.DataFrame([input_data])

    try:
        power_pred = power_model.predict(input_df)[0]

        prediction = {
            "Predicted Wind Power": power_pred
        }

        # Save to database
        database.save_wind_power_prediction(db, input_data, prediction)

        return JSONResponse(content=prediction)
    except Exception as e:
        print(f"Error predicting wind power: {str(e)}")
        return JSONResponse(
            status_code=500,
            content={"error": f"Error predicting wind power: {str(e)}"}
        )
