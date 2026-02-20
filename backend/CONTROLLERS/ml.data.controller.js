const ProductSaleTransaction  = require('./../MLmodels/productSaleTransaction');
const Product = require('./../MODELS/Products');



exports.getSalesHistory = async (req, res) => {
    try {
        const { businessCode, productCode } = req.params;

        const sales = await ProductSaleTransaction.find({
            BuisnessCode: businessCode,
            productCode: productCode
        })
        .select("saleDate quantitySold -_id")
        .sort({ saleDate: 1 });

        if (!sales || sales.length === 0) {
            return res.status(404).json({ message: "no sales data found" });
        }

        // IMPORTANT: send RAW records (NO grouping)
        return res.status(200).json(sales);

    } catch (error) {
        console.error("sales history error", error);
        return res.status(500).json({
            status: 'failure',
            message: "cannot fetch sales history"
        });
    }
};


exports.getProductStock = async(req,res)=>{
    try{
        const {businessCode,productCode} = req.params;
        
        const product = await Product.findOne({
            BuisnessCode:businessCode,
            productcode:productCode,
        })


        if(!product) {
            return res.status(404).json({message:"product not found"});
        }

        return res.status(200).json({
            stock:product.quantity
        });

    } catch(error) {
        console.error("stock fetch error :",error);
        return res.status(500).json({message:"cannot fetch stock"})
    }
}