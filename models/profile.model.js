module.exports = (sequelize,DataTypes) => {
    const Profile = sequelize.define('profile',{
        userId:{
            type: DataTypes.INTEGER,
        },
        number:{
            type: DataTypes.STRING,
        },
        video:{
            type: DataTypes.STRING,
        },
        thumbnail:{
            type:DataTypes.STRING
        },
        signUpDate: {
            type: DataTypes.DATE,
        },
        loginDate:{
            type: DataTypes.DATE
        }
    },{
        timestamps:false
    });
    return Profile;
}