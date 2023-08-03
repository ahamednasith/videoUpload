const cron = require('node-cron');
const {Op} = require('sequelize');
const db = require('../models/index');
const Phone = db.phone;

const deleteOtp = async () => {
    const currenTime = new Date();
    await Phone.destroy({
        where:{
            expiredAt:{
                [Op.lte]:currenTime
            },
        },
    });
};

cron.schedule("*/5 * * * *",deleteOtp);

module.exports = {deleteOtp};