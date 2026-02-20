const axios = require("axios");

const ML_URL = "http://127.0.0.1:5000";

exports.predictCreditRisk = async(data)=>{
    try{
        const response = await axios.post(`${ML_URL}/predict-credit`,data);
        return response.data;
    } catch(err) {
        console.error("ML credit Prediction Error",err.message);
        return null;
    }
}

exports.getForecastRestock = async (req, res) => {
    try {
        const { businessCode, productCode } = req.params;

        const response = await axios.get(
            `${ML_URL}/forecast-restock/${businessCode}/${productCode}`,
            {
                timeout: 60000   // VERY IMPORTANT (60s for Prophet)
            }
        );

        return res.status(200).json({
            success: true,
            source: "AI Engine",
            data: response.data
        });

    } catch (error) {

        console.log("ML SERVICE DOWN:", error.message);

        return res.status(500).json({
            success: false,
            message: "needs more sale data for this product",
            tip: "Is Flask server running on port 5000?"
        });
    }
};
// exports.predictRestock = async(data)=>{
//     try{
//         const response = await axios.post(`${ML_URL}/predict-restock`,data);
//         return response.data;
//     } catch(err) {
//         console.error("ml restock prediction error:",err.message);
//         return null
//     }
// }

// exports.getForecastRestock = async(req,res)=>{
//     try{
//         const {businessCode,productCode}  = req.params;
//         const response = await axios.get(`${ML_URL}/forecast-restock/${businessCode}/${productCode}`);
//         return res.status(200).json({
//             success:true,
//             ai:response.data
//         })
//     } catch(error) {
//         console.error("ML SERVICE ERROR:",err);
//         return res.status(500).json({
//             success:false,
//             message:"ai prediction service unavailable"
//         });
//     }
// }