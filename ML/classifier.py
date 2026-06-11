from pymongo import MongoClient
import pandas as pd
from datetime import datetime
import joblib
from dotenv import load_dotenv
import os

load_dotenv()

MONGO_URI = os.getenv('MONGO_CONNECTION_STR')
DB_NAME = "test"
COLLECTION_NAME = "empprogresses"

client = MongoClient(MONGO_URI)
db = client[DB_NAME]
collection = db[COLLECTION_NAME]

records = list(collection.find({}, {"_id": 0}))
real_df = pd.DataFrame(records)

if real_df.empty:
    print("No employee progress records found in MongoDB!")
    exit()

today = datetime.now()
real_df['dueDate'] = pd.to_datetime(real_df['dueDate'])
real_df['days_remaining'] = (real_df['dueDate'] - today).dt.days

# ================== LOAD MODEL ==================
try:
    model = joblib.load("employee_risk_model.pkl")
    progress_encoder = joblib.load("progress_encoder.pkl")
    print("Loaded trained model successfully")
except:
    print("Trained model err. Please run train.py first.")
    exit()

# ================== ENCODE PROGRESS ==================
real_df['progress_encoded'] = progress_encoder.transform(real_df['progress'].str.lower())

# ================== PREDICTIONS ==================
real_df['PredictedRisk'] = model.predict(real_df[['days_remaining', 'progress_encoded']])

print("\n=== Predictions ===")
print(real_df[['username', 'task', 'progress', 'days_remaining', 'PredictedRisk']])
