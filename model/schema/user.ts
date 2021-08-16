const { Schema } = require("mongoose");
const bcrypt = require("bcryptjs");

// import { Schema } from 'mongoose';
// import bcrypt from 'bcryptjs';


const userSchema = Schema({
    password: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Name is required']
    },
     surname: {
        type: String,
        required: [true, 'Surname is required']
    },
    avatarURL: {
        type: String,
    },
});

userSchema.methods.setPassword = function (password) {
    this.password = bcrypt.hashSync(password, bcrypt.genSaltSync(10));
}

userSchema.methods.comparePassword = function (password) {
      return bcrypt.compareSync(password, this.password);
}

// module.exports = userSchema;
export default userSchema