from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import joblib  # or torch, tensorflow, etc.
import numpy as np

# Initialize FastAPI app
app = FastAPI()

# Load your trained ML model
model = joblib.load("model/model.pkl")

# Define a Pydantic model for input validation
class ModelInput(BaseModel):
    feature1: float
    feature2: float
    feature3: float

# Define a route to make predictions
@app.post("/predict")
async def predict(input_data: ModelInput):
    try:
        # Extract features and prepare them for the model
        features = np.array([[input_data.feature1, input_data.feature2, input_data.feature3]])
        
        # Use the ML model to make predictions
        prediction = model.predict(features)
        
        # Return the prediction result as JSON
        return {"prediction": prediction.tolist()}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error during prediction: {str(e)}")

