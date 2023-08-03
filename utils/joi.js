const Joi = require('joi');

const otpSchema =Joi.object({
    userId: Joi.number().min(10000000).max(99999999),
    number: Joi.number().min(1000000000).max(9999999999),
    otp:Joi.number().min(100000).max(999999),
    signUpDate:Joi.date().iso(),
    loginDate:Joi.date().iso()
});
const phoneValidate = (req,res,next) =>{
    const number = req.body.number;
    const otp = Math.floor(100000 + Math.random() * 900000)
    const {error} = otpSchema.validate({number,otp});
    if(error){
        return res.status(402).json({error:error.message});
    }
    next();
}

const profileSchema = Joi.object({
    userId: Joi.number().min(10000000).max(99999999),
    number: Joi.number().min(1000000000).max(9999999999),
    signUpDate: Joi.date().iso(),
    loginDate: Joi.date().iso()
});

const profileValidate = (req,res,next) => {
    const userId = Math.floor(10000000 + Math.random() * 90000000);
    const number = req.body.number;
    const signUpDate = new Date();
    const loginDate = new Date();
    const {error} =profileSchema.validate(userId,number,signUpDate,loginDate);
    if(error){
        return res.status(401).json({error:error.message});
    }
    next();
};

module.exports = { phoneValidate,profileValidate };
