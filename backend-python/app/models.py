from sqlalchemy import Column, Integer, Float, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class EmissionData(Base):
    __tablename__ = "emission_data"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    source = Column(String, index=True)
    value = Column(Float)
    unit = Column(String)
    location = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class PredictionResult(Base):
    __tablename__ = "prediction_results"

    id = Column(Integer, primary_key=True, index=True)
    model_name = Column(String)
    prediction_time = Column(DateTime)
    predicted_value = Column(Float)
    confidence_level = Column(Float)
    parameters = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)