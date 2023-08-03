module.exports = (sequelize,DataTypes) => {
    const Phone = sequelize.define('phone',{
        number:{
            type: DataTypes.STRING,
        },
        otp:{
            type: DataTypes.INTEGER,
        },
        createdAt: {
            type: DataTypes.DATE,
        },
        expiredAt:{
            type: DataTypes.DATE
        }
    },{
        timestamps:false
    });
    return Phone;
}