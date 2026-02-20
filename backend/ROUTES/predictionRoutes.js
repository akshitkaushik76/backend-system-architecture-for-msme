const express = require('express');
const router = express.Router();
const mlcontrollerforrestock = require('./../CONTROLLERS/inventoryPredictionController');
router.route("/restock/:BuisnessCode/:productCode").get(mlcontrollerforrestock.predictProductRestock);


module.exports = router;