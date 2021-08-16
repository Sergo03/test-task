// const { model } = require("mongoose");
// const userSchema = require("./schema/user")
import { model } from 'mongoose';
import userSchema from './schema/user'
const User = model("user", userSchema)

// module.exports = User;
export default User;
    
