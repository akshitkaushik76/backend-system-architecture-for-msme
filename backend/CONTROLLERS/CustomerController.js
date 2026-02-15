const express = require('express');
const Customer = require('./../MODELS/Customer');
const Owner = require('./../MODELS/Owner');
const transporter = require('./../Utils/email')
const Business = require('./../MODELS/BusinessSchema');
const jwt = require('jsonwebtoken');

// exports.registerCustomer = async(req,res,next)=>{
//    try{
//     const {OrganisationCode,Name,emailid,phoneNumber,password,confirmpassword} = req.body;
//     const BuisnessfromCode = await Business.find({OrganisationCode:OrganisationCode});
//     if(!BuisnessfromCode || BuisnessfromCode.length === 0) {
//         return res.status(404).json({
//             status:'failure',
//             message:'the businesses with the code does not exists'
//         })
//     }
//     const BuisnessCodes = BuisnessfromCode.map(p=>p.CreationCode);
//     const Ownername = BuisnessfromCode.map(p=>p.Owner);
    
//     const Customerdata = await Customer.create({
//         ...req.body,
//         OrganisationCode:[OrganisationCode],
//         EnrolledBusinesses:BuisnessCodes,
//         Name,
//         emailid,
//         phoneNumber,
//         password,
//         confirmpassword
//   })
//   const token  = jwt.sign({id:Customerdata._id},process.env.SECRET_STRING,{
//     expiresIn:process.env.EXPIRES_IN
//   });
//   if(Customerdata.emailid) {
    //   const emailHtml = `
    //     <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border-radius: 8px;">
    //       <h2 style="color: #4CAF50; text-align: center;">🎉 Welcome to Our Business Family 🎉</h2>
    //       <p>Dear <b>${Customerdata.Name}</b>,</p>
    //       <p>We are excited to inform you that your registration has been <b style="color: #4CAF50;">successful</b>!</p>
          
    //       <div style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 6px;">
    //         <p><b>📌 Registered Business Owner:</b> ${Ownername[0]}</p>
    //         <p><b>🏷️ Business Code(s):</b> ${BuisnessCodes.join(", ")}</p>
    //         <p><b>📞 Phone Number:</b> ${Customerdata.phoneNumber}</p>
    //       </div>

    //       <p>Thank you for joining us. You can now enjoy seamless access to our services and stay updated with your credits and payments.</p>

    //       <div style="text-align: center; margin-top: 30px;">
    //         <a href="https://your-frontend-app.com/login" 
    //            style="background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
    //           Login to Your Account
    //         </a>
    //       </div>

    //       <p style="margin-top: 30px; font-size: 13px; color: #777;">
    //         If you have any questions, feel free to reply to this email.<br>
    //         — Team ${Ownername[0]}
    //       </p>
    //     </div>
    //   `;
//     await transporter.sendMail({
//         from:process.env.email_user,
//         to:Customerdata.emailid,
//         subject:'SUCCESSFULL REGISTRATION',
//         html:emailHtml
//     })
//   }
//   res.status(201).json({
//     status:'success',
//     token,
//     Customerdata
//   })

//    }catch(error) {
//     res.status(500).json({
//         status:'failure',
//         message:error.message
//     })
//    }
// }

exports.registerCustomer = async(req,res,next) =>{
     const {OrganisationCode,Name,emailid,phoneNumber,password,confirmpassword} = req.body;
     try{
        const Businessesfromcode = await Business.find({OrganisationCode});
        if(!Businessesfromcode.length === 0) {
            return res.status(404).json({
                status:'failure',
                message:'no business for the organization code exists'
            })
        }
        const BusinessCode = Businessesfromcode.map(p=>p.CreationCode);
        const Ownername = Businessesfromcode.map(p=>p.Owner);
       let existing_customer = await Customer.findOne({phoneNumber});
        if(existing_customer) {
            const isMatch = await bcrypt.compare(password,existing_customer.password);
            if(isMatch) {
                return res.status(401).json({
                    status:'fail',
                    message:'incorrect password'
                })
            }
            if(existing_customer.OrganisationCode.includes(OrganisationCode)) {
                return res.status(400).json({
                    status:'failure',
                    message:'Customer already registered in the organization'
                });
            }
            existing_customer.OrganisationCode.push(OrganisationCode);

            BusinessCode.forEach(code=>{
                if(!existing_customer.EnrolledBusinesses.includes(code)) {
                    existing_customer.EnrolledBusinesses.push(code);
                }
            });
            await existing_customer.save();

            const token = jwt.sign({id:existing_customer._id},process.env.SECRET_STRING,{
                expiresIn:process.env.EXPIRES_IN
            });
            return res.status(200).json({
                status:'success',
                message:'joined new organisation successfully',
                token,
                customer_Data:existing_customer
            })
        }

        //new customer //
       const new_customer_Data = await Customer.create({
        Name,
        emailid,
        phoneNumber,
        password,
        confirmpassword,
        OrganisationCode:[OrganisationCode],
        EnrolledBusinesses:BusinessCode
       }) 

       const token = jwt.sign({id:new_customer_Data._id},process.env.SECRET_STRING,{
        expiresIn:process.env.EXPIRES_IN
       })

       if(new_customer_Data.emailid) {
          const emailHtml = `
        <div style="font-family: Arial, sans-serif; color: #333; padding: 20px; background: #f9f9f9; border-radius: 8px;">
          <h2 style="color: #4CAF50; text-align: center;">🎉 Welcome to Our Business Family 🎉</h2>
          <p>Dear <b>${new_customer_Data.Name}</b>,</p>
          <p>We are excited to inform you that your registration has been <b style="color: #4CAF50;">successful</b>!</p>
          
          <div style="margin: 20px 0; padding: 15px; background: #fff; border: 1px solid #ddd; border-radius: 6px;">
            <p><b>📌 Registered Business Owner:</b> ${Ownername[0]}</p>
            <p><b>🏷️ Business Code(s):</b> ${new_customer_Data.EnrolledBusinesses.join(", ")}</p>
            <p><b>📞 Phone Number:</b> ${new_customer_Data.phoneNumber}</p>
          </div>

          <p>Thank you for joining us. You can now enjoy seamless access to our services and stay updated with your credits and payments.</p>

          <div style="text-align: center; margin-top: 30px;">
            <a href="https://your-frontend-app.com/login" 
               style="background: #4CAF50; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Login to Your Account
            </a>
          </div>

          <p style="margin-top: 30px; font-size: 13px; color: #777;">
            If you have any questions, feel free to reply to this email.<br>
            — Team ${Ownername[0]}
          </p>
        </div>
      `;
        transporter.sendMail({
       
            from:process.env.email_user,
            to:new_customer_Data.emailid,
            subject:"SUCCESSFUL REGISTRATION",
            html:emailHtml
        })
       }
     } catch(error) {
    res.status(500).json({
        status:'fail',
        error:error.message
    })
} 
}


exports.getCustomers = async(req,res,next)=>{
    try{
        const phoneNumber = req.params.phoneNumber;
        const CustomerData = await Customer.findOne({phoneNumber});
        if(!CustomerData) {
            return res.status(404).json({
                status:'failure',
                message:'the user does not exist or try a valid phone number'
            })
        }
        res.status(200).json({
            status:'success',
            CustomerData
        })
    } catch(error) {
        res.status(500).json({
            status:'fail',
            message:error.message
        }
        )
    }
}

exports.patchCustomer = async(req,res,next)=>{
    try{
        const phoneNumber = req.params.phoneNumber;
        const CustomerData = await Customer.findOne({phoneNumber});
        if(!CustomerData) {
            return res.status(404).json({
                status:'failure',
                message:'the Customer with the given phone Number does not exist'
            })
        }
        let updatedName = req.body.Name??CustomerData.Name;
        const updatedData = {
            ...req.body,
            Name:updatedName,
            email:CustomerData.emailid,
        }
        const data = await Customer.findOneAndUpdate(
            {phoneNumber},
            {$set:updatedData},
            {new:true,runValidators:true}
        );
        if(data.emailid) {
            await transporter.sendMail({
                from:process.env.email_user,
                to:data.emailid,
                subject:'INFORMATION UPDATED',
                text:'Dear User. \n\n Your information was recently changed upon your request.\n\n If it was not you please contact on devsaccuflow@gmail.com . '
            })
        }
        res.status(200).json({
            status:'success',
            data
        })
    } 
    catch(error) {
       res.status(500).json({
        status:'fail',
        message:error.message
       })
    } 
}
exports.SubscribetonewOrganisation = async(req,res,next)=>{
   try{
    // const phoneNumber = req.params.phoneNumber;
    // const CustomerData = await Customer.findOne({phoneNumber});
    // if(!CustomerData.OrganisationCode) {
    //     return res.status(404).json({
    //         status:'fail',
    //         message:'this is a invalid operation, register yourself as a customer to a buisness service first :('
    //     })
    // }
    // const {OrganisationCode} = req.body;
   
    // const BuisnessfromCode = await Business.find({OrganisationCode:OrganisationCode});
    // if(!BuisnessfromCode || BuisnessfromCode.length === 0) {
    //     return res.status(404).json({
    //         status:'failure',
    //         message:'the businesses with the code does not exists'
    //     })
    // }
    // const BuisnessCodes = BuisnessfromCode.map(p=>p.CreationCode);
    // const newdata = await Customer.findOneAndUpdate(
    //     {phoneNumber},
    //     {$addToSet:{OrganisationCode:OrganisationCode}},
    //     {$addToSet:{EnrolledBusinesses:BuisnessCodes}},
    //     {new:true,runValidators:true}
    // );
    // if(newdata.emailid) {
    //     await transporter.sendMail({
    //         from:process.env.email_user,
    //         to:newdata.emailid,
    //         subject:'SUBSCRIPTION TO NEW SERVICE',
    //         text:`Dear ${newdata.Name}\n\nYour are now registered to new service\n\nOrganisation code ${OrganisationCode}\n\n.If it was not you then contact the support at devsaccuflow@gmail.com`,
    //     })
    // }
    // res.status(201).json({
    //     status:'success',
    //     details:newdata
    // })
    const phoneNumber = req.params.phoneNumber;
    const customer = await Customer.findOne({phoneNumber:phoneNumber});
    console.log(customer);
    if(!customer) {
        return res.status(404).json({
            status:'failure',
            message:'invalid phone number'
        })
    }
    const {OrganisationCode} = req.body;
    const listofBuisness = await Business.find({OrganisationCode:OrganisationCode});
    if(!listofBuisness || listofBuisness.length === 0) {
        return res.status(404).json({
            status:'failure',
            message:'invalid code , please enter correct code'
        })
    } 

    const Codes = listofBuisness.map(p=>p.CreationCode);
    if(!Codes || Codes.length === 0) {
        return res.status(404).json({
            status:'failure',
            message:'the Owner has no buisness!!'
        })
    }
    const updatedCustomer = await Customer.findOneAndUpdate(
        {phoneNumber:phoneNumber},
        {$addToSet:{
            OrganisationCode:OrganisationCode,
            EnrolledBusinesses:{$each:Codes}
        }},
        {new:true,runValidators:true}
    );
    if(updatedCustomer.emailid) {
        await transporter.sendMail({
            from:process.env.email_user,
            to:updatedCustomer.emailid,
            subject:'SUBSCRIBED TO NEW BUSINESS',
            text:`dear Customer\n\nYou have successfully subscribed to new buisness : ${OrganisationCode}`
        })
    }
    res.status(200).json({
        status:'success',
        updatedCustomer
    })
   }catch(error) {
    res.status(500).json({
        status:'fail',
        message:error.message
    })
   }
}