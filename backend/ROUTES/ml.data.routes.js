const express = require('express');
const router = express.Router();

const mlDataController = require('./../CONTROLLERS/ml.data.controller');

router.route('/ml/sales-history/:businessCode/:productCode').get(mlDataController.getSalesHistory);

router.route('/ml/product-stock/:businessCode/:productCode').get(mlDataController.getProductStock);


module.exports = router;