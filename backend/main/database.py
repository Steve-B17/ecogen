from sqlalchemy import create_engine, Column, Integer, Float, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime

# Create database engine
SQLALCHEMY_DATABASE_URL = "sqlite:///./predictions.db"
engine = create_engine(
    SQLALCHEMY_DATABASE_URL, connect_args={"check_same_thread": False}
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class WindSpeedPrediction(Base):
    __tablename__ = "wind_speed_predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    dayofyear = Column(Integer)
    month = Column(Integer)
    hour = Column(Integer)
    temperature_at_2m = Column(Float)
    earth_skin_temperature = Column(Float)
    specific_humidity_at_2m = Column(Float)
    relative_humidity_at_2m = Column(Float)
    surface_pressure = Column(Float)
    wind_speed_10m = Column(Float)
    wind_speed_50m = Column(Float)

class WindDirectionPrediction(Base):
    __tablename__ = "wind_direction_predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    dayofyear = Column(Integer)
    month = Column(Integer)
    hour = Column(Integer)
    temperature_at_2m = Column(Float)
    earth_skin_temperature = Column(Float)
    specific_humidity_at_2m = Column(Float)
    relative_humidity_at_2m = Column(Float)
    surface_pressure = Column(Float)
    wind_direction_10m = Column(Float)
    wind_direction_50m = Column(Float)

class WindPowerPrediction(Base):
    __tablename__ = "wind_power_predictions"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    wind_speed_10m = Column(Float)
    wind_speed_50m = Column(Float)
    wind_direction_10m = Column(Float)
    wind_direction_50m = Column(Float)
    air_density = Column(Float)
    rotor_speed = Column(Float)
    active_power = Column(Float)
    previous_power = Column(Float)
    predicted_power = Column(Float)

# Create all tables
Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def save_wind_speed_prediction(db, input_data, predictions):
    prediction = WindSpeedPrediction(
        dayofyear=input_data["dayofyear"],
        month=input_data["month"],
        hour=input_data["hour"],
        temperature_at_2m=input_data["Temperature at 2 Meters (C)"],
        earth_skin_temperature=input_data["Earth Skin Temperature (C)"],
        specific_humidity_at_2m=input_data["Specific Humidity at 2 Meters (g/kg)"],
        relative_humidity_at_2m=input_data["Relative Humidity at 2 Meters (%)"],
        surface_pressure=input_data["Surface Pressure (kPa)"],
        wind_speed_10m=predictions["Wind Speed at 10M"],
        wind_speed_50m=predictions["Wind Speed at 50M"]
    )
    db.add(prediction)
    db.commit()
    return prediction

def save_wind_direction_prediction(db, input_data, predictions):
    prediction = WindDirectionPrediction(
        dayofyear=input_data["dayofyear"],
        month=input_data["month"],
        hour=input_data["hour"],
        temperature_at_2m=input_data["Temperature at 2 Meters (C)"],
        earth_skin_temperature=input_data["Earth Skin Temperature (C)"],
        specific_humidity_at_2m=input_data["Specific Humidity at 2 Meters (g/kg)"],
        relative_humidity_at_2m=input_data["Relative Humidity at 2 Meters (%)"],
        surface_pressure=input_data["Surface Pressure (kPa)"],
        wind_direction_10m=predictions["Wind Direction at 10M"],
        wind_direction_50m=predictions["Wind Direction at 50M"]
    )
    db.add(prediction)
    db.commit()
    return prediction

def save_wind_power_prediction(db, input_data, prediction):
    power_prediction = WindPowerPrediction(
        wind_speed_10m=input_data["Wind Speed at 10 Meters (m/s)"],
        wind_speed_50m=input_data["Wind Speed at 50 Meters (m/s)"],
        wind_direction_10m=input_data["Wind Direction at 10 Meters (Degrees)"],
        wind_direction_50m=input_data["Wind Direction at 50 Meters (Degrees)"],
        air_density=input_data["Air Density (kg/m^3)"],
        rotor_speed=input_data["Rotor Speed (RPM)"],
        active_power=input_data["Active Power (MW)"],
        previous_power=input_data["Previous Hour's Power Generation (MW)"],
        predicted_power=prediction["Predicted Wind Power"]
    )
    db.add(power_prediction)
    db.commit()
    return power_prediction 