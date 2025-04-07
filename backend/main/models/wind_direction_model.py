import numpy as np
import joblib
import pandas as pd
from sklearn.preprocessing import StandardScaler
import os

class WindDirectionModel:
    def __init__(self, model_path=None):
        self.model = None
        self.scaler = None
        if model_path:
            try:
                # Load the model and scaler
                model_dir = os.path.dirname(model_path)
                model_name = os.path.basename(model_path)
                
                # Load the model
                self.model = joblib.load(model_path)
                print(f"Successfully loaded wind direction model from {model_path}")
                
                # Try to load the scaler if it exists
                scaler_path = os.path.join(model_dir, f"scaler_{model_name}")
                if os.path.exists(scaler_path):
                    self.scaler = joblib.load(scaler_path)
                    print(f"Successfully loaded scaler from {scaler_path}")
                else:
                    print(f"No scaler found at {scaler_path}, using default StandardScaler")
                    self.scaler = StandardScaler()
                    
            except Exception as e:
                print(f"Error loading wind direction model from {model_path}: {str(e)}")
                raise

    def preprocess_input(self, X):
        """Preprocess the input data."""
        if isinstance(X, dict):
            X = pd.DataFrame([X])
        elif isinstance(X, pd.DataFrame):
            pass
        else:
            raise ValueError("Input must be a dictionary or pandas DataFrame")
            
        # Ensure all required features are present
        required_features = [
            "dayofyear", "month", "hour",
            "Temperature at 2 Meters (C)",
            "Earth Skin Temperature (C)",
            "Specific Humidity at 2 Meters (g/kg)",
            "Relative Humidity at 2 Meters (%)",
            "Surface Pressure (kPa)"
        ]
        
        missing_features = [feat for feat in required_features if feat not in X.columns]
        if missing_features:
            raise ValueError(f"Missing required features: {missing_features}")
            
        # Scale the features if we have a scaler
        if self.scaler is not None:
            X_scaled = self.scaler.transform(X)
            return X_scaled
        return X

    def predict(self, X):
        """Make predictions for wind direction."""
        if self.model is None:
            raise ValueError("Model not loaded correctly")
            
        try:
            # Preprocess the input
            X_processed = self.preprocess_input(X)
            
            # Make predictions
            if hasattr(self.model, 'predict'):
                predictions = self.model.predict(X_processed)
            else:
                # If the model doesn't have a predict method, try to use it directly
                predictions = self.model(X_processed)
                
            # Ensure predictions are in the range [0, 360)
            predictions = np.mod(predictions, 360)
            
            # Convert to float to ensure JSON serialization
            predictions = predictions.astype(float)
            
            return predictions
            
        except Exception as e:
            print(f"Error making wind direction prediction: {str(e)}")
            raise 