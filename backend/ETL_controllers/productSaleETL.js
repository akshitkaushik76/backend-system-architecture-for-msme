// const ProductSaleTransaction = require("./../MLmodels/productSaleTransaction");

// function getSeason(month){
//     if([12,1,2].includes(month)) return "WINTER";
//     if([3,4,5,6].includes(month)) return "SUMMER";
//     return "MONSOON";
// }

// function getSalaryWeek(date){
//     return date.getDate() <= 7;
// }

// exports.recordSaleTransaction = async (product, quantity, OrganisationCode, BuisnessCode) => {

//     const now = new Date();

//     const beforeStock = product.quantity;
//     const afterStock = product.quantity - quantity;

//     await ProductSaleTransaction.create({

//         productCode: product.productcode,
//         OrganisationCode,
//         BuisnessCode,

//         quantitySold: Number(quantity),
//         unitPrice: product.sellingPrice,
//         totalSaleAmount: quantity * product.sellingPrice,

//         stockBeforeSale: beforeStock,
//         stockAfterSale: Number(afterStock),

//         saleDate: now,
//         dayOfWeek: now.getDay(),
//         weekOfMonth: Math.ceil(now.getDate()/7),
//         month: now.getMonth()+1,
//         season: getSeason(now.getMonth()+1),

//         isWeekend: [0,6].includes(now.getDay()),
//         festivalPeriod: [10,11,12,3].includes(now.getMonth()+1),
//         salaryWeek: getSalaryWeek(now)
//     });
// };

const ProductSaleTransaction = require("./../MLmodels/productSaleTransaction");

function getSeason(month){
    if([12,1,2].includes(month)) return "WINTER";
    if([3,4,5,6].includes(month)) return "SUMMER";
    return "MONSOON";
}

function getSalaryWeek(date){
    return date.getDate() <= 7;
}

exports.recordSaleTransaction = async ({
    productCode,
    unitPrice,
    quantity,
    OrganisationCode,
    BuisnessCode,
    stockBefore,
    stockAfter
}) => {

    const now = new Date();

    const qty = Number(quantity);
    const price = Number(unitPrice);
    const before = Number(stockBefore);
    const after = Number(stockAfter);

    await ProductSaleTransaction.create({

        productCode: String(productCode),
        OrganisationCode: String(OrganisationCode),
        BuisnessCode: String(BuisnessCode),

        quantitySold: qty,
        unitPrice: price,
        totalSaleAmount: qty * price,

        stockBeforeSale: before,
        stockAfterSale: after,

        saleDate: now,
        dayOfWeek: now.getDay(),
        weekOfMonth: Math.ceil(now.getDate()/7),
        month: now.getMonth()+1,
        season: getSeason(now.getMonth()+1),

        isWeekend: [0,6].includes(now.getDay()),
        festivalPeriod: [10,11,12,3].includes(now.getMonth()+1),
        salaryWeek: getSalaryWeek(now)
    });
};
