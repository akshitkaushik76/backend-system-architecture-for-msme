const express = require('express');
const Product = require('./../MODELS/Products');
const Business = require('./../MODELS/BusinessSchema');
// const Customer = require('./../MODELS/Customer');
const Owner = require('./../MODELS/Owner');
const transporter = require('./../Utils/email');
//productname+sellingprice--->productcode
function Productcode(name,sellingPrice) {
  const cp = sellingPrice.toString();
  const code = name+cp;
  return code;
}
function TimeFunction() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2,'0');
    const minutes = now.getMinutes().toString().padStart(2,'0');
    const seconds = now.getSeconds().toString().padStart(2,'0');

    const day = now.getDate().toString().padStart(2,'0');
    const month = (now.getMonth()+1).toString().padStart(2,'0');
    const year = now.getFullYear().toString().padStart(2,'0');
   
    return `${hours}:${minutes}:${seconds}  Date:${day}/${month}/${year}`;
}

exports.addProduct = async(req,res,next)=>{
    try{
        const BuisnessCreationCode = req.params.BuisnessCode;
        const {productName,costPrice,sellingPrice,quantity} = req.body;
        const Businessdata = await Business.findOne({CreationCode:BuisnessCreationCode});
        if(!Businessdata) {
           return res.status(404).json({
            status:'failure',
            message:'the Buisness id is not valid'
           })
        }
        const product = await Product.create({
            BuisnessCode:Businessdata.CreationCode,
            OrganisationCode:Businessdata.OrganisationCode,
            productName,
            costPrice,
            sellingPrice,
            quantity,
            totalCostSpent:costPrice*quantity,
            dateofPurchase:TimeFunction(),
            productcode:Productcode(productName,sellingPrice)
        })
        res.status(201).json({
            status:'success',
            product
        })
    }catch(error) {
        res.status(500).json({
            status:'fail',
            error:error.message
        })
    }
}

exports.updateProduct = async(req,res,next)=>{
    try{
        const {productcode,BuisnessCode,OrganisationCode} = req.params;

        const owner = await Owner.findOne({OrganisationCode});
        if(!owner) {
            return res.status(404).json({
                status:"failure",
                message:"owner with the organization was not found"
            })
        }
        const product = await Product.findOne({productcode,BuisnessCode});
        if(!product) {
            return res.status(404).json({
                status:"failure",
                message:"product with the business was not found"
            })
        }
        if(product.costPrice !== undefined) {
            product.costPrice = req.body.costPrice
        }
        if(product.sellingPrice !== undefined) {
            product.sellingPrice = req.body.sellingPrice
        }
        if(req.body.quantity !== undefined) {
            const oldQty = product.quantity;
            const newQty = Number(req.body.quantity);

            const addedUnits = newQty - oldQty;
            if(addedUnits) {
                const cost = req.body.costPrice || product.costPrice;
                product.totalCostSpent = (product.totalCostSpent || 0) + addedUnits*cost;
            }
            product.quantity = newQty;
        }
        product.updationChanges = TimeFunction();
        if(owner.email) {
            await transporter.sendMail({
                from:process.env.email_user,
                to:owner.email,
                subject:'SUCCESSFULL UPDATION OF PRODUCT',
                text:`Dear ${owner.Name}
                The product with product id: ${product.productcode} was updated.
                If it was not you then please mail us at devsaccuflow@gmail.com`
            })
        }
        res.status(200).json({
            status:"success",
            message:"product updated successfully",
            product
        })
    } catch(error) {
        res.status(500).json({
            status:'failure',
            error:error.message
        })
    }

}
// exports.getProduct = async(req,res,next)=>{
//     try{
//         const code = req.params.productCode;
//         const buisnessCode = req.params.businessCode;

//         const product_info = await Product.findOne({
//             productcode: code,          
//             BuisnessCode: buisnessCode
//         });

//         if(!product_info) {
//             return res.status(404).json({
//                 status:'failure',
//                 message:'the product with this business does not exist'
//             })
//         }

//         res.status(200).json({
//             status:'success',
//             product_info
//         })

//     } catch(error) {
//         res.status(500).json({
//             status:'failure',
//             error:error.message
//         })
//     }
// }
// controllers/ProductController.js



exports.getProduct = async (req, res, next) => {
  try {
    // 1️ Read params safely
    let { productCode, businessCode } = req.params;

    if (!productCode || !businessCode) {
      return res.status(400).json({
        status: "failure",
        message: "Product code and business code are required",
      });
    }

    //  Clean the values (VERY IMPORTANT)
    productCode = productCode.trim();
    businessCode = businessCode.trim();

    //Case-insensitive search (prevents 'Maggi10' vs 'maggi10' issue)
    const product_info = await Product.findOne({
      productcode: { $regex: new RegExp(`^${productCode}$`, "i") },
      BuisnessCode: businessCode,
    });

    
    if (!product_info) {
      return res.status(404).json({
        status: "failure",
        message: "Product not found in this business",
      });
    }

    
    res.status(200).json({
      status: "success",
      product_info,
    });

  } catch (error) {
    console.error("GET PRODUCT ERROR:", error);

    res.status(500).json({
      status: "failure",
      message: "Server error while fetching product",
    });
  }
};
exports.getAllProduct = async(req,res,next)=>{
    try{
        const BusinessCode = req.params.BuisnessCode;
        const products = await Product.find({BuisnessCode:BusinessCode});
        if(!products || products.length === 0) {
            return res.status(404).json({
                status:'failure',
                message:'this product is not registered for this business code'
            })
        }
        res.status(200).json({
            status:'success',
            products
        })
    }catch(error) {
        res.status(500).json({
            status:'failure',
            error:error.message
        })
    }
}


exports.searchProducts = async(req,res,next)=>{
    try{
        const {businessCode} = req.params;
        const {q} = req.query;

        if(!q || q.trim() === "") {
            return res.json({
                status:'success',
                products:[]
            })
        }
        const products = await Product.find({
            BuisnessCode:businessCode,
            productName:{$regex: q,$options:"i"}
        }).select("productName productcode quantity sellingPrice").limit(7);

        res.json({
            status:"success",
            products
        })
    } catch(error) {
        res.status(500).json({
            status:"failure",
            error:error.message
        })
    }
}