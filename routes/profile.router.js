const express = require('express');
const profileController = require('../controllers/profile.controller');
const Joi = require('../utils/joi');
const jwt = require('../utils/cryptAndJwt');
const multer = require('multer');
const path = require('path');
const router = express.Router();

const storage = multer.diskStorage({
    destination:'./public/vidoes',
    filename:(req,file,cb) => {
        return cb(null,file.fieldname +'_'+ Date.now()+ '-' + path.extname(file.originalname));
    }
});

const upload = multer({
    storage:storage
}).single('video');

router.post('/signup',Joi.phoneValidate,profileController.signUp,jwt.generateToken);

router.put('/video',jwt.verifyToken,upload,profileController.uploadVideo);


module.exports = router;