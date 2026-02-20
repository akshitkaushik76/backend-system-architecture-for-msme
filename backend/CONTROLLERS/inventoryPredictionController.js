const ProductSaleTransaction  = require('./../MLmodels/productSaleTransaction');
const Product = require('./../MODELS/Products');

const {predictRestock} = require('./../services/mlService');

exports.predictProductRestock = async(req,res)=>{
    try{
        const {BuisnessCode,productCode} = req.params;

        const sales = await ProductSaleTransaction
         .find({ BuisnessCode, productCode })
         .sort({ saleDate: -1 })
         .limit(30);


        if(sales.length === 0) {
            return res.status(404).json({
                status:'fail',
                message:'Not enough sales data for prediction'
            })
        }


        //we are now calculating average daily sales//

        const totalSold = sales.reduce((sum,s)=>sum + s.quantitySold,0);
        const avgDailySales = totalSold/sales.length;

        const product = await Product.findOne({BuisnessCode,productcode:productCode});

        if(!product) {
            return res.status(404).json({
                status:'fail',
                message:'product not found'
            })
        }
        const currentStock = product.quantity;
        const daysOfStockLeft = currentStock/(avgDailySales || 1);
        const totalRevenueGenerated = sales.reduce((sum,s)=> sum + s.totalSaleAmount,0);

        const prediction = await predictRestock({
            averageDailySales:avgDailySales,
            currentStock:currentStock,
            daysOfStockLeft:daysOfStockLeft,
            totalRevenueGenerated:totalRevenueGenerated
        })

        res.status(200).json({
            status:'success',
            productCode,
            prediction
        })
    } catch(error) {
        res.status(500).json({
            status:"error",
            message:error.message
        })
    }
}