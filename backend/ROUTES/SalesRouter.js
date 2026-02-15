const express = require('express');
const salesController = require('../CONTROLLERS/SalesController');
const router = express.Router();
const AuthController = require('./../AUTHCONTROLLERS/Authcontroller');
router.route('/addSales/:OrganisationCode/:BuisnessCode').post(AuthController.protectOwner,salesController.CreateSale);
router.route('/profitThisDay/:OrganisationCode/:BuisnessCode').get(AuthController.protectOwner,salesController.findProfitperday);
router.route('/getSales/:BusinessCode').get(AuthController.protectOwner,salesController.getSalesofBusiness);
module.exports = router;