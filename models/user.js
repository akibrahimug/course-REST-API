// Import DataTypes and Modal from sequelize
const { Model, DataTypes} = require('sequelize');
const bcrypt = require('bcryptjs')

module.exports = (sequelize) => {
    class User extends Model {}
    User.init({
        // firstName-STRING
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'First name is required'
                },
                notEmpty: {
                    msg: 'Please provide your first name'
                }
            }
        },
        // lastName-STRING
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Last name is required'
                },
                notEmpty: {
                    msg: 'Please provide your last name'
                }
            }
        },
        // emailAddress-STRING
        emailAddress: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: {
                msg: "This email already exsits"
            },
            validate: {
                notNull: {
                    msg: 'Email is required'
                },
                isEmail: {
                    msg: "Please provide a valid email address"
                }
            }
        },
        // password-STRING
        password: {
            type: DataTypes.VIRTUAL,
            allowNull: false,
            validate: {
                notNull: {
                    msg: "A password is required"
                },
                notEmpty: {
                    msg: "Please provide a password"
                },
                len: {
                    args: [6,15],
                    msg: "Password must be between 6-15 characters long"
                }
            }
        },
        confirmedPassword: {
            type: DataTypes.STRING,
            allowNull: false,
            set(val){
                if(val === this.password){
                    const hashedPassword = bcrypt.hashSync(val, 10);
                    this.setDataValue('confirmedPassword', hashedPassword);
                }
            },
            validate: {
                notNull: {
                    msg: "Both passwords must match"
                }
            }
        }
    }, {sequelize});

    User.associate = (models) => {
        User.hasMany(models.Course, {
            as: "director",
            foreignKey: {
                fieldName: 'directorUserId',
                allowNull: false,
            }
        })
    }
    return User
}




