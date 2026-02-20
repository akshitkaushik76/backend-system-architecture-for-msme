import random
import pandas as pd
import numpy as np
from faker import Faker
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.tree import DecisionTreeClassifier
import joblib

fake = Faker()

# ---------------- CREDIT MODEL ----------------
def generate_credit_dataset(n=5000):
    data = []

    for _ in range(n):

        numberOfCredits = random.randint(1, 25)

        avg_credit = random.randint(200, 5000)
        max_credit = avg_credit + random.randint(0, 3000)
        min_credit = max(50, avg_credit - random.randint(0, 200))

        totalCreditsIssued = avg_credit * numberOfCredits

        payment_ratio = random.uniform(0.2, 1.1)
        totalCreditsPaid = totalCreditsIssued * payment_ratio

        totalOutstanding = max(0, totalCreditsIssued - totalCreditsPaid)

        fullySettled = int(numberOfCredits * random.uniform(0.2, 0.9))
        partial = numberOfCredits - fullySettled

        daysSinceLastCredit = random.randint(1, 120)

        creditDefaultFlag = 0

        if totalOutstanding > avg_credit * 2 and daysSinceLastCredit > 45:
            creditDefaultFlag = 1
        elif payment_ratio < 0.5 and numberOfCredits > 5:
            creditDefaultFlag = 1

        data.append([
            totalCreditsIssued,
            totalCreditsPaid,
            totalOutstanding,
            numberOfCredits,
            fullySettled,
            partial,
            daysSinceLastCredit,
            avg_credit,
            max_credit,
            min_credit,
            creditDefaultFlag
        ])

    cols = [
        'totalCreditsIssued',
        'totalCreditsPaid',
        'totalOutstanding',
        'numberOfCredits',
        'fullySettledCount',
        'partiallyPaidCount',
        'daysSinceLastCreditIssued',
        'averageCreditAmount',
        'maxCreditAmount',
        'minCreditAmount',
        'default'
    ]

    return pd.DataFrame(data, columns=cols)


credit_df = generate_credit_dataset()

X = credit_df.drop("default", axis=1)
y = credit_df["default"]

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

credit_model = RandomForestClassifier(n_estimators=200, max_depth=8)
credit_model.fit(X_train, y_train)

joblib.dump(credit_model, "models/credit_model.pkl")
print("Credit model trained & saved")


# ---------------- INVENTORY MODEL ----------------
def generate_inventory_dataset(n=4000):
    data = []

    for _ in range(n):
        avg_daily = random.uniform(1, 40)
        stock = random.randint(0, 400)
        days_left = stock / avg_daily if avg_daily > 0 else 999
        revenue = avg_daily * random.randint(10, 100) * random.randint(10, 60)
        restock = 1 if days_left < 5 else 0

        data.append([
            avg_daily,
            stock,
            days_left,
            revenue,
            restock
        ])

    cols = [
        "averageDailySales",
        "currentStock",
        "daysOfStockLeft",
        "totalRevenueGenerated",
        "restock"
    ]

    return pd.DataFrame(data, columns=cols)


inv_df = generate_inventory_dataset()

X2 = inv_df.drop("restock", axis=1)
y2 = inv_df["restock"]

X2_train, X2_test, y2_train, y2_test = train_test_split(X2, y2, test_size=0.2)

inventory_model = DecisionTreeClassifier(max_depth=5)
inventory_model.fit(X2_train, y2_train)

joblib.dump(inventory_model, "models/inventory_model.pkl")
print("Inventory model trained & saved")
