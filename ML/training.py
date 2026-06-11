import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# ================== TEST CASES ==================
# username, task, progress, days_remaining
data = [
    # Completed tasks (Risk Free)
    ("A", "Frontend Deploy", "completed", -10),
    ("B", "Backend Deploy", "completed", 0),
    ("C", "Testing", "completed", 15),
    ("D", "Docs Update", "completed", 30),

    # Overdue & not completed (Risk)
    ("E", "Frontend Bugfix", "in progress", -5),
    ("F", "Backend API", "not started", -2),
    ("G", "Database Migration", "in progress", -15),
    ("H", "UI Cleanup", "not started", -20),

    # Due soon (<=2 days left, not completed → Risk)
    ("I", "Frontend Review", "in progress", 1),
    ("J", "Backend Auth", "not started", 2),
    ("K", "Testing", "in progress", 0),
    ("L", "Docs Update", "not started", -1),

    # Safe zone (Risk Free)
    ("M", "Frontend Setup", "not started", 10),
    ("N", "Backend Setup", "in progress", 7),
    ("O", "Database Indexing", "not started", 20),
    ("P", "UI Research", "in progress", 25),

    # Mix more examples
    ("Q", "API Gateway", "completed", -3),
    ("R", "Performance Test", "in progress", 12),
    ("S", "Security Patch", "not started", 8),
    ("T", "Monitoring", "in progress", 5),
    ("U", "Logging", "not started", 3),
    ("V", "Deployment", "completed", -7),
    ("W", "Integration Test", "not started", 1),
    ("X", "Unit Test", "in progress", 2),

    # Extra safe completed
    ("Y", "Research", "completed", 40),
    ("Z", "UI Migration", "completed", 18),

    # More overdue risky
    ("AA", "Refactor", "not started", -8),
    ("BB", "Load Testing", "in progress", -12),
    ("CC", "CI/CD Setup", "not started", -25),
    ("DD", "Frontend Optimization", "in progress", -4),

    # Near deadline risky
    ("EE", "Docs Fix", "not started", 0),
    ("FF", "API Mock", "in progress", 2),
    ("GG", "Security Audit", "in progress", 1),
    ("HH", "Unit Refactor", "not started", 2),

    # Risk Free safe zone
    ("II", "UI Design", "in progress", 9),
    ("JJ", "DB Backup", "not started", 6),
    ("KK", "Cache Layer", "in progress", 11),
    ("LL", "System Config", "not started", 14),

    # Completed (always Risk Free)
    ("MM", "Report Gen", "completed", 5),
    ("NN", "Schema Update", "completed", -9),
    ("OO", "Error Tracking", "completed", 0),
    ("PP", "Analytics", "completed", 12),

    # Risk overdue
    ("QQ", "Bug Hunt", "not started", -18),
    ("RR", "UI Bugfix", "in progress", -6),
    ("SS", "API Cleanup", "not started", -1),
    ("TT", "Load Balance", "in progress", -13),

    # Risk near deadline
    ("UU", "Hotfix", "not started", 1),
    ("VV", "UI Review", "in progress", 2),
    ("WW", "Auth Module", "in progress", 0),
    ("XX", "Payment", "not started", -2),

    # Risk Free
    ("YY", "Deployment Plan", "not started", 21),
    ("ZZ", "System Test", "in progress", 17),
    ("AAA", "Architecture Review", "not started", 19),
    ("BBB", "Frontend Theme", "in progress", 22),
]

df = pd.DataFrame(data, columns=["username", "task", "progress", "days_remaining"])

# ================== LABEL CREATION ==================
def label_risk(days_remaining, progress):
    progress = progress.lower()
    if progress == "completed":
        return "Risk Free"
    if days_remaining < 0:
        return "Risk"
    if days_remaining <= 2:
        return "Risk"
    return "Risk Free"

df["RiskStatus"] = df.apply(
    lambda row: label_risk(row["days_remaining"], row["progress"]), axis=1
)

# ================== ENCODING ==================
progress_encoder = LabelEncoder()
progress_encoder.fit(["not started", "in progress", "completed"])

df["progress_encoded"] = progress_encoder.transform(df["progress"].str.lower())

X = df[["days_remaining", "progress_encoded"]]
y = df["RiskStatus"]

# ================== MODEL TRAINING ==================
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

model = RandomForestClassifier(random_state=42)
model.fit(X_train, y_train)

print("✅ Model trained successfully on 60 test cases")
print("🔹 Test Accuracy:", model.score(X_test, y_test))

# ================== SAVE MODEL ==================
joblib.dump(model, "employee_risk_model.pkl")
joblib.dump(progress_encoder, "progress_encoder.pkl")

# ================== PREDICTIONS ==================
df["PredictedRisk"] = model.predict(X)

print("\n=== Predictions Sample ===")
print(df.head(15)[["username", "task", "progress", "days_remaining", "RiskStatus", "PredictedRisk"]])
