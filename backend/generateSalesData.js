const mongoose = require('mongoose');

const ProductSaleTransaction = require('./MLmodels/productSaleTransaction');


const MONGO_URL = "mongodb://localhost:27017/ILBA"

const BUSINESS_CODE = "AKS218061618012026" 
const ORG_CODE = "AKS2"
const PRODUCT_CODE = "maggi10"
const UNIT_PRICE = 10;

// Approx major Indian retail-impact festivals
const FESTIVALS = {
    "01-01": "NewYear",
    "01-14": "MakarSankranti",
    "01-26": "RepublicDay",
    "03-08": "Holi",
    "08-15": "IndependenceDay",
    "10-02": "GandhiJayanti",
    "10-20": "Dussehra",
    "11-01": "Diwali",
    "11-02": "Diwali",
    "11-03": "Diwali",
    "12-25": "Christmas"
};

function isFestival(date){
    const key = String(date.getMonth()+1).padStart(2,'0') + "-" +
                String(date.getDate()).padStart(2,'0');
    return FESTIVALS[key] ? true : false;
}

function getSeason(month){
    if([12,1,2].includes(month)) return "WINTER";
    if([3,4,5,6].includes(month)) return "SUMMER";
    return "MONSOON";
}


function randomDemand(date) {

    let demand = 2 + Math.random()*2; // normal daily demand

    // Weekend boost
    if(date.getDay() === 0 || date.getDay() === 6){
        demand += 2 + Math.random()*2;
    }

    // Salary week boost
    if(date.getDate() <= 7){
        demand += 2 + Math.random()*3;
    }

    // Festival spike (THE REAL MAGIC)
    if(isFestival(date)){
        demand += 6 + Math.random()*8;   // festival explosion
    }

    return Math.round(demand);
}



async function run() {
    await mongoose.connect(MONGO_URL);
    console.log("MONGO CONNECTED")

    let stock = 120;
    const today = new Date();

    for(let i = 60;i>=1;i--) {
        const saledate = new Date(today);
        saledate.setDate(today.getDate()-i);
        const qty = randomDemand(saledate);

        const before = stock;
        stock-=qty;
        const after = stock;

        await ProductSaleTransaction.create({
            productCode:PRODUCT_CODE,
            BuisnessCode:BUSINESS_CODE,
            OrganisationCode:ORG_CODE,
            quantitySold:qty,
            unitPrice:UNIT_PRICE,
            totalSaleAmount: qty * UNIT_PRICE,
            stockBeforeSale: before,
            stockAfterSale: after,
            saleDate:saledate,
            dayOfWeek: saledate.getDay(),
            weekOfMonth:Math.ceil(saledate.getDate()/7),
            month:saledate.getMonth()+1,
            season:getSeason(saledate.getMonth()+1),
            isWeekend:[0,6].includes(saledate.getDay()),
            festivalPeriod:isFestival(saledate),
            salaryWeek:saledate.getDate() <= 7
        });
        console.log(`Inserted ${qty} units for ${saledate.toDateString()}`);
    }
    console.log("60 day data added");
    process.exit();
}

run();