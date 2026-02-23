import os
os.makedirs("models", exist_ok=True)

import joblib
import pandas as pd
import requests
from prophet import Prophet
from datetime import datetime, timedelta

NODE_BACKEND_URL = "http://localhost:7600"


# -----------------------------
# SALES HISTORY
# -----------------------------


def load_or_train_model(business_code, product_code, df):

    model_path = f"models/{business_code}_{product_code}.pkl"

    # If model already exists → LOAD
    if os.path.exists(model_path):
        print("Loading cached model...")
        model = joblib.load(model_path)
        return model

    # Otherwise → TRAIN + SAVE
    print("Training new model...")
    model = train_forecast_model(df)

    joblib.dump(model, model_path)
    print("Model saved:", model_path)

    return model


def get_sales_history(business_code, product_code):
    url = f"{NODE_BACKEND_URL}/ilba/ml/sales-history/{business_code}/{product_code}"
    res = requests.get(url)

    if res.status_code != 200:
        raise Exception("Cannot fetch sales history from backend")

    data = res.json()

    if len(data) == 0:
        raise Exception("No sales data found in database")

    df = pd.DataFrame(data)

    # ----- VERY IMPORTANT FIX -----
    # your mongo fields
    df = df.rename(columns={
        "saleDate": "ds",
        "quantitySold": "y"
    })

    # convert date
    df["ds"] = pd.to_datetime(df["ds"]).dt.tz_localize(None)

    # combine same day sales
    df = df.groupby("ds").sum().reset_index()

    # fill missing dates
    full_range = pd.date_range(start=df["ds"].min(), end=df["ds"].max())
    df = df.set_index("ds").reindex(full_range).fillna(0).rename_axis("ds").reset_index()

    print("Training data days:", len(df))   # DEBUG (keep this)

    return df

# -----------------------------
# CURRENT STOCK
# -----------------------------
def get_current_stock(business_code, product_code):
    url = f"{NODE_BACKEND_URL}/ilba/ml/product-stock/{business_code}/{product_code}"
    res = requests.get(url)

    if res.status_code != 200:
        raise Exception("Cannot fetch stock")

    data = res.json()
    return data["stock"]


# -----------------------------
# FESTIVALS (LIVE API)
# -----------------------------
def get_festivals():

    indian_festivals = [
        # 2025
        ("2025-01-14", "Makar Sankranti"),
        ("2025-03-14", "Holi"),
        ("2025-04-10", "Eid"),
        ("2025-08-19", "Raksha Bandhan"),
        ("2025-10-02", "Gandhi Jayanti"),
        ("2025-10-20", "Dussehra"),
        ("2025-11-01", "Diwali"),
        ("2025-12-25", "Christmas"),

        # 2026
        ("2026-01-14", "Makar Sankranti"),
        ("2026-03-04", "Holi"),
        ("2026-03-21", "Eid"),
        ("2026-08-08", "Raksha Bandhan"),
        ("2026-10-20", "Dussehra"),
        ("2026-11-08", "Diwali"),
        ("2026-12-25", "Christmas"),
    ]

    holidays = pd.DataFrame(indian_festivals, columns=["ds", "holiday"])
    holidays["ds"] = pd.to_datetime(holidays["ds"])

    # demand rises few days before festivals
    holidays["lower_window"] = -3
    holidays["upper_window"] = 2

    return holidays


# -----------------------------
# TRAIN MODEL
# -----------------------------
def train_forecast_model(df):
    model = Prophet(
        yearly_seasonality=True,
        weekly_seasonality=True,
        daily_seasonality=False,
        holidays=get_festivals()
    )

    model.fit(df)
    return model


# -----------------------------
# FORECAST
# -----------------------------
def forecast_next_days(model, days=7):
    future = model.make_future_dataframe(periods=days)
    forecast = model.predict(future)

    # Prevent negative predictions
    forecast["yhat"] = forecast["yhat"].clip(lower=0)
    forecast["yhat_upper"] = forecast["yhat_upper"].clip(lower=0)

    return forecast.tail(days)


# -----------------------------
# RESTOCK DECISION
# -----------------------------
def restock_decision(business_code, product_code):

    df = get_sales_history(business_code, product_code)

    model = train_forecast_model(df)
    # model = load_or_train_model(business_code, product_code, df)

    forecast = forecast_next_days(model, 7)

    expected_consumption = forecast["yhat_upper"].sum()

    current_stock = get_current_stock(business_code, product_code)

    if current_stock < expected_consumption:
        decision = "RESTOCK REQUIRED"
        prediction = 1
    else:
        decision = "STOCK SAFE"
        prediction = 0

    return {
        "productCode": product_code,
        "currentStock": current_stock,
        "expectedConsumptionNext7Days": round(float(expected_consumption), 2),
        "message": decision,
        "prediction": prediction
    }
