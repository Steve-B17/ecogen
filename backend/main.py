from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn
import numpy as np
import pandas as pd
import joblib
import json
import os
from typing import List, Dict, Any, Optional
import plotly.express as px
import plotly.graph_objects as go
from dataclasses import dataclass

app = FastAPI(title="ML Model API", description="API for serving multiple ML models with visualization")

# Configure CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update with your Next.js URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Model registry to store loaded models
class ModelRegistry:
    def __init__(self):
        self.models = {}
        self.load_models()
    
    def load_models(self):
        """Load all models from the models directory."""
        model_dir = "models"
        if not os.path.exists(model_dir):
            os.makedirs(model_dir)
            print(f"Created models directory at {model_dir}")
            return
        
        # Load each model file ending with .pkl or .joblib
        for filename in os.listdir(model_dir):
            if filename.endswith(('.pkl', '.joblib')):
                model_path = os.path.join(model_dir, filename)
                model_name = os.path.splitext(filename)[0]
                try:
                    model = joblib.load(model_path)
                    self.models[model_name] = model
                    print(f"Loaded model: {model_name}")
                except Exception as e:
                    print(f"Error loading model {model_name}: {str(e)}")
    
    def get_model(self, model_name):
        """Get a model by name."""
        if model_name not in self.models:
            raise KeyError(f"Model {model_name} not found in registry")
        return self.models[model_name]
    
    def list_models(self):
        """Return a list of available models."""
        return list(self.models.keys())

# Visualization service
class VisualizationService:
    @staticmethod
    def create_visualization(data, viz_type, params=None):
        """Create visualization based on type and parameters."""
        if params is None:
            params = {}
        
        df = pd.DataFrame(data)
        
        if viz_type == "line":
            fig = px.line(df, **params)
        elif viz_type == "bar":
            fig = px.bar(df, **params)
        elif viz_type == "scatter":
            fig = px.scatter(df, **params)
        elif viz_type == "histogram":
            fig = px.histogram(df, **params)
        elif viz_type == "pie":
            fig = px.pie(df, **params)
        elif viz_type == "heatmap":
            fig = px.imshow(df.pivot_table(index=params.get("y"), 
                                          columns=params.get("x"), 
                                          values=params.get("values")))
        else:
            raise ValueError(f"Unsupported visualization type: {viz_type}")
        
        return json.loads(fig.to_json())

# Request models
class PredictionRequest(BaseModel):
    model_name: str
    data: List[Dict[str, Any]]
    features: List[str]

class VisualizationRequest(BaseModel):
    data: List[Dict[str, Any]]
    viz_type: str
    params: Optional[Dict[str, Any]] = None

# Initialize model registry
model_registry = ModelRegistry()
visualization_service = VisualizationService()

@app.get("/")
def root():
    return {"message": "ML Model API is running"}

@app.get("/models")
def get_models():
    """Get a list of all available models."""
    return {"models": model_registry.list_models()}

@app.post("/predict")
def predict(request: PredictionRequest):
    """Make predictions using a specified model."""
    try:
        model = model_registry.get_model(request.model_name)
        
        # Convert input data to DataFrame
        df = pd.DataFrame(request.data)
        
        # Ensure all required features are present
        if not all(feature in df.columns for feature in request.features):
            missing = [f for f in request.features if f not in df.columns]
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")
        
        # Get only the required features in the right order
        X = df[request.features]
        
        # Make predictions
        try:
            predictions = model.predict(X)
            
            # If model has predict_proba method, include probabilities
            probabilities = None
            if hasattr(model, 'predict_proba'):
                try:
                    probabilities = model.predict_proba(X).tolist()
                except:
                    pass
            
            # Convert predictions to list for JSON serialization
            predictions = predictions.tolist() if isinstance(predictions, np.ndarray) else predictions
            
            return {
                "predictions": predictions,
                "probabilities": probabilities
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")
            
    except KeyError as e:
        raise HTTPException(status_code=404, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {str(e)}")

@app.post("/visualize")
def visualize(request: VisualizationRequest):
    """Create a visualization from data."""
    try:
        visualization = visualization_service.create_visualization(
            request.data, request.viz_type, request.params
        )
        return visualization
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Visualization error: {str(e)}")

@app.post("/compare_models")
def compare_models(request: PredictionRequest):
    """Compare predictions from all models on the same data."""
    try:
        # Convert input data to DataFrame
        df = pd.DataFrame(request.data)
        
        # Ensure all required features are present
        if not all(feature in df.columns for feature in request.features):
            missing = [f for f in request.features if f not in df.columns]
            raise HTTPException(status_code=400, detail=f"Missing features: {missing}")
        
        # Get only the required features in the right order
        X = df[request.features]
        
        results = {}
        for model_name in model_registry.list_models():
            model = model_registry.get_model(model_name)
            try:
                predictions = model.predict(X)
                
                # Convert predictions to list for JSON serialization
                predictions = predictions.tolist() if isinstance(predictions, np.ndarray) else predictions
                
                results[model_name] = predictions
            except Exception as e:
                results[model_name] = f"Error: {str(e)}"
        
        return {"comparison": results}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Comparison error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)