const db = require('../models');
const { Sequelize,Op } = require('sequelize');
const dateTime = require("date-and-time");
const {generateToken} = require('../utils/cryptAndJwt');
const sharp = require('sharp');
const ffmpeg = require('fluent-ffmpeg');
const path = require('path');
const {encrypt,decrypt} = require('../utils/cryptAndJwt');
const Profile = db.profile;
const Phone = db.phone;

const signUp = async (req,res,next) => {
    const number =encrypt(String(req.body.number));
    const otp = Math.floor(100000 + Math.random() * 900000);
    const currenTime = new Date();
    const type = req.body.type;
    if(type == "sendotp"){
        const count = await Phone.count({
            where:{
                number,
                createdAt:{
                    [Op.gte]:new Date(currenTime.getTime() - 5 * 60000)
                }
            }
        });
        if(count >=5 ){
            return res.status(404).json({statuscode:404,message:"OTP Has Reached Limit. Try Again After 5 Minutes"});
        }
        else {
            const expiredAt = new Date(currenTime.getTime() + 5 * 60000);
            const phone = await Phone.create({
                number:encrypt(String(req.body.number)),
                otp:otp,
                createdAt:new Date(currenTime.getTime()),
                expiredAt:expiredAt
            });
            return res.status(200).json({
                statuscode:200,
                message:"OTP Generated"
            });
        }
    }
    if(type == "verifyotp"){
        const phone = await Phone.findOne({
            where:{
                number:number,
                otp:req.body.otp,
                expiredAt:{
                    [Op.gt]:currenTime
                }
            }
        });
        if(!phone || currenTime>phone.expiredAt){
            return res.status(402).json({
                statuscode:402,
                message:"OTP Has EXpired"
            })
        }
        else{
            const userId = Math.floor(10000000 + Math.random() * 90000000);
            const number = encrypt(String(req.body.number));
            const signUpDate = new Date();
            const loginDate = dateTime.format(new Date(),'YYYY-MM-DD HH:mm:ss');
            const numberExists = await Profile.findOne({where:{number}});
            if(numberExists){
                await Profile.update({userId,loginDate},{
                    where:{
                        number
                    }
                });
            }
            else{
                const profile = await Profile.create({
                    userId,
                    number,
                    signUpDate,
                    loginDate,
                });
            }
            const token = generateToken(userId,loginDate);
            return res.status(200).json({
                statuscode:200,
                message:"User Profile Succesfully Updated",
                accesstoken:token
            });
        }
    }
};

const uploadVideo = async (req, res, next) => {
try{
    const videoPath = req.file.path;
    const videoUrl = `http://localhost:7878/${videoPath}`;
    const thumbnailPath = `public/thumbnails/${path.basename(videoPath, path.extname(videoPath))}.jpg`;
    ffmpeg.ffprobe(videoPath, (err, metadata) => {
      const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');
      const defaultWidth = videoStream.width;
      const defaultHeight = videoStream.height;
    ffmpeg(videoPath)
    .screenshots({
      timestamps: ['50%'],
      filename: path.basename(thumbnailPath),
      folder: path.dirname(thumbnailPath),
      size: `${defaultWidth}x${defaultHeight}`,
    })
    .on('end',async () => {
        const profile = await Profile.update(
          {
            video: videoUrl,
            thumbnail: thumbnailPath,
          },
          {
            where: {
              userId: req.profile.userId,
            },
          }
        );

        return res.status(200).json({
          stautscode: 200,
          message: 'Video Uploaded',
          data: {
            id: req.profile.id,
            userId: req.profile.userId,
            number: decrypt(req.profile.number),
            video: videoUrl,
            thumbnail: thumbnailPath,
          },
        });
      })
      .on('error', (err) => {
        console.error('error', err);
        return res.status(500).json({ error: err.message });
      });
    });
    }
    catch(error){
        return res.status(500).json({error:error.message})
    }
};


module.exports = { signUp,uploadVideo};