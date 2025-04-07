import os
import joblib
import numpy as np
import pandas as pd
import sys

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

# Path to the model files
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, 'main', 'models', 'joblibFiles', 'windDirection')

# Test data
test_data = {
    "dayofyear": 1,
    "month": 1,
    "hour": 12,
    "Temperature at 2 Meters (C)": 20.0,
    "Earth Skin Temperature (C)": 18.0,
    "Specific Humidity at 2 Meters (g/kg)": 10.0,
    "Relative Humidity at 2 Meters (%)": 50.0,
    "Surface Pressure (kPa)": 101.3
}

test_df = pd.DataFrame([test_data])

# Try to load and test the 10M model
print("\nTesting 10M model:")
try:
    model_path = os.path.join(MODEL_DIR, 'MLP_10M.joblib')
    print(f"Loading model from: {model_path}")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"Model type: {type(model)}")
        print(f"Model attributes: {dir(model)}")
        
        # Try to make a prediction
        if hasattr(model, 'predict'):
            pred = model.predict(test_df)
            print(f"Prediction: {pred}")
        else:
            print("Model does not have a predict method")
    else:
        print(f"Model file not found: {model_path}")
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc()

# Try to load and test the 50M model
print("\nTesting 50M model:")
try:
    model_path = os.path.join(MODEL_DIR, 'MLP_50M.joblib')
    print(f"Loading model from: {model_path}")
    
    if os.path.exists(model_path):
        model = joblib.load(model_path)
        print(f"Model type: {type(model)}")
        print(f"Model attributes: {dir(model)}")
        
        # Try to make a prediction
        if hasattr(model, 'predict'):
            pred = model.predict(test_df)
            print(f"Prediction: {pred}")
        else:
            print("Model does not have a predict method")
    else:
        print(f"Model file not found: {model_path}")
except Exception as e:
    print(f"Error: {str(e)}")
    import traceback
    traceback.print_exc() 