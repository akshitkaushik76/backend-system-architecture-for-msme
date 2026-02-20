const express = require("express");
const router = express.Router();

const mlController = require("./../services/mlService");

// RESTOCK FORECAST
router.get(
    "/restock-check/:businessCode/:productCode",
    mlController.getForecastRestock
);

module.exports = router;