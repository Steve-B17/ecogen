import numpy as np
import joblib

class WindDirectionModel:
    def __init__(self, model_path):
        try:
            self.model = joblib.load(model_path)
            print(f"Successfully loaded wind direction model from {model_path}")
        except Exception as e:
            print(f"Error loading wind direction model from {model_path}: {str(e)}")
            raise

    def predict(self, X):
        try:
            predictions = self.model.predict(X)
            # Ensure predictions are in the range [0, 360)
            predictions = np.mod(predictions, 360)
            return predictions
        except Exception as e:
            print(f"Error making wind direction prediction: {str(e)}")
            raise
