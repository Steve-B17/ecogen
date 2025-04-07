# 📌 Wind Prediction Web App (FastAPI)

## **Overview**
This project is a web app built with **FastAPI** to predict **wind speed** and **wind direction** at **10M and 50M** height using trained machine learning models (`.joblib` files). The app has two tabs for separate predictions.

## **Project Structure**
```
main/
│── main.py                      # FastAPI backend
│── models/                       # Model directory
│   ├── joblibFiles/
│   │   ├── windSpeed/
│   │   │   ├── GBM_10.joblib     # Wind speed at 10M model
│   │   │   ├── GBM_50.joblib     # Wind speed at 50M model
│   │   ├── windDirection/
│   │   │   ├── MLP_10M.joblib    # Wind direction at 10M model
│   │   │   ├── MLP_50M.joblib    # Wind direction at 50M model
│   ├── wind_weather.csv          # Dataset (optional)
│── static/
│   ├── index.html                # Frontend HTML file
│── README.md                     # Documentation
│── requirements.txt               # Dependencies
```

## **Installation & Setup**
### **1️⃣ Clone the repository**
```bash
git clone <repo-url> && cd main
```

### **2️⃣ Create & activate a virtual environment**
```bash
python3 -m venv venv && source venv/bin/activate  # Linux/macOS
venv\Scripts\activate  # Windows
```

### **3️⃣ Install dependencies**
```bash
pip install -r requirements.txt
```

### **4️⃣ Run the FastAPI server**
```bash
uvicorn main:app --reload
```

## **Usage**
📌 Open **`http://127.0.0.1:8000/`** in your browser.
🌬️ Predict **Wind Speed** and **Wind Direction** at **10M & 50M** using the web interface.

🚀 Enjoy your **Wind Prediction Web App!**
