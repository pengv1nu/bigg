import { DataTypes } from "sequelize";
import bcrypt from "bcryptjs";
import { sequelize } from "../db.js";   // ← путь может отличаться, сверьтесь со своим db.js

const User = sequelize.define("User", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            isEmail: { msg: "Некорректный email" },
            notEmpty: { msg: "Email не может быть пустым" }
        }
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
            notEmpty: { msg: "Пароль не может быть пустым" },
            len: { args: [6, 100], msg: "Пароль от 6 до 100 символов" }
        }
    }
}, {
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) user.password = await bcrypt.hash(user.password, 10);
        },
        beforeUpdate: async (user) => {
            if (user.changed("password")) user.password = await bcrypt.hash(user.password, 10);
        }
    }
});

User.prototype.validPassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

export { User };