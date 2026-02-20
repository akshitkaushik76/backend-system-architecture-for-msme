from flask import Flask, request, jsonify
import joblib
import numpy as np
from forecast_engine import restock_decision
app = Flask(__name__)

# load trained models
# credit_model = joblib.load("models/credit_model.pkl")
# inventory_model = joblib.load("models/inventory_model.pkl")


# ---------------- CREDIT PREDICTION ----------------
# @app.route("/predict-credit", methods=["POST"])
# def predict_credit():

#     data = request.json

#     features = [
#         data["totalCreditsIssued"],
#         data["totalCreditsPaid"],
#         data["totalOutstanding"],
#         data["numberOfCredits"],
#         data["fullySettledCount"],
#         data["partiallyPaidCount"],
#         data["daysSinceLastCreditIssued"],
#         data["averageCreditAmount"],
#         data["maxCreditAmount"],
#         data["minCreditAmount"]
#     ]

#     prediction = credit_model.predict([features])[0]

#     if prediction == 1:
#         result = "HIGH RISK — likely to NOT repay credit"
#     else:
#         result = "SAFE — can give credit"

#     return jsonify({
#         "prediction": int(prediction),
#         "message": result
#     })


# ---------------- INVENTORY PREDICTION ----------------
# @app.route("/predict-restock", methods=["POST"])
# def predict_restock():

#     data = request.json

#     features = [
#         data["averageDailySales"],
#         data["currentStock"],
#         data["daysOfStockLeft"],
#         data["totalRevenueGenerated"]
#     ]

#     prediction = inventory_model.predict([features])[0]

#     if prediction == 1:
#         result = "RESTOCK REQUIRED"
#     else:
#         result = "Stock is sufficient"

#     return jsonify({
#         "prediction": int(prediction),
#         "message": result
#     })

@app.route("/forecast-restock/<business_code>/<product_code>",methods=["GET"])
def forecast_restock(business_code,product_code):
    try:
        result = restock_decision(business_code,product_code)
        return jsonify(result)
    except Exception as e:
        return jsonify({
            "error":str(e)
        }),500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
