const Sales  = require('../MODELS/SalesSchema');
const Product = require('../MODELS/Products');
// const updateProductInventoryAnalysis = require('../ETL_controllers/productInventory')
  const {recordSaleTransaction} = require('./../ETL_controllers/productSaleETL');
const computeSaletime = ()=>{
  
          const now = new Date();
          const hour = now.getHours().toString().padStart(2,'0');
          const min = now.getMinutes().toString().padStart(2,'0');
          const sec = now.getSeconds().toString().padStart(2,'0');
          return `${hour}:${min}:${sec}`;
        
}
const computeSaleDate = ()=>{
  const now = new Date();
  const date = now.getDate().toString().padStart(2,'0');
  const month = (now.getMonth()+1).toString().padStart(2,'0');
  const year = now.getFullYear().toString().padStart(2,'0');
  return `${date}/${month}/${year}`;
}


exports.CreateSale = async(req,res,next)=>{
    try{
        const OrganisationCode = req.params.OrganisationCode;
        const BuisnessCode = req.params.BuisnessCode;
        const {productCode,quantity} = req.body;
        const product = await Product.findOne({BuisnessCode:BuisnessCode,productcode:productCode});
        if(!product) {
            return res.status(404).json({
                status:'fail',
                message:'the product is not registered'
            })
        }
        if(product.quantity<quantity) {
            return res.status(403).json({
                status:'fail',
                message:'the quantity of product is not enough'
            })
        }
        const stockbefore = product.quantity;
        const totalAmount = product.sellingPrice*quantity;
        const profit = (product.sellingPrice-product.costPrice)*quantity
        const sales = await Sales.create({
            OrganisationCode:OrganisationCode,
            BuisnessCode:BuisnessCode,
            productCode:productCode,
            quantity:quantity,
            totalCost:totalAmount,
            date:computeSaleDate(),
            time:computeSaletime(),
            profitMade:profit
        })


        // product.quantity = product.quantity-quantity
        //  await product.save();
        const updatedProduct = await Product.findOneAndUpdate(
            {BuisnessCode,productcode:productCode,quantity:{$gte:quantity}},
            {$inc:{quantity:-quantity}},
            {new:true}
        )
        if(!updatedProduct) {
            return res.status(400).json({
                status:'fail',
                message:'stock changed , try again'
            })
        }
         const stockafter = updatedProduct.quantity;
    //     updateProductInventoryAnalysis(OrganisationCode,BuisnessCode, productCode)
    //   .then(() => console.log(`✅ Inventory analytics updated for ${productCode}`))
    //   .catch(err => console.error(`❌ Inventory ETL failed: ${err.message}`));
   const qty = Number(quantity);   // 🔥 MOST IMPORTANT LINE

console.log("ETL DEBUG >>>", {
    productCode: product.productcode,
    unitPrice: Number(product.sellingPrice),
    quantity: qty,
    OrganisationCode,
    BuisnessCode,
    stockBefore: Number(stockbefore),
    stockAfter: Number(stockafter)
});

await recordSaleTransaction({
    productCode: String(product.productcode),
    unitPrice: Number(product.sellingPrice),
    quantity: qty,
    OrganisationCode: String(OrganisationCode),
    BuisnessCode: String(BuisnessCode),
    stockBefore: Number(stockbefore),
    stockAfter: Number(stockafter)
});

    res.status(200).json({
            status:'success',
            data:sales
        })
    }catch(error) {
        console.error("sale controller error >>>", error)
        res.status(500).json({
            status:'failure',
            error:error.message
        })
    }
}

exports.findProfitperday = async(req,res,next)=>{
    try{
        const BuisnessCode = req.params.BuisnessCode;
        const OrganisationCode = req.params.OrganisationCode;
        const date = req.query.date;
        const result = await Sales.find({date:date,BuisnessCode:BuisnessCode,OrganisationCode:OrganisationCode});
        if( !result || result.length == 0) {
            return res.status(404).json({
                status:'failure',
                message:'no record for this date'
            })
        }
      const profitmade = result.reduce((sum,s)=>sum+s.profitMade,0);
      res.status(200).json({
        status:'success',
         date,
         profit:profitmade
      })
    } 
    catch(error) {
        res.status(500).json({
            status:'failure',
            error:error.message
        })
    }
}
exports.getSalesofBusiness = async(req,res,next)=>{
   try{
    const BusinessCode = req.params.BusinessCode;
    const date = req.query.date;
    if(!date) {
        return res.status(400).json({
            status:'fail',
            message:'please enter the date'
        })
    }
    const result = await Sales.find({BuisnessCode:BusinessCode,date:date});
    if(!result) {
        return res.status(404).json({
            status:'fail',
            message:'the sales record are not available for this date'
        })
    }
    res.status(200).json({
        status:'success',
        result
    })
   }catch(error){
    console.error("sale error >>>",error);
    res.status(500).json({
        status:'failure',
        error:error.message
    })
   }
}
